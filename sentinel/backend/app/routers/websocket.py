"""
backend/app/routers/websocket.py
=================================
WebSocket endpoint for the live dashboard.

WS /ws/dashboard?token=<jwt>
  - Authenticates the connection using the JWT provided in the query string
  - Every 5 seconds, pushes the current `rolling_stats` dictionary (maintained
    by the ingestion service) to the connected browser
  - The browser uses this payload to update KPI counters, charts, and the log feed
"""

import asyncio
import json

from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect
from loguru import logger

from app.core.security import decode_token
from app.services.ingestion import rolling_stats

router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws/dashboard")
async def dashboard_websocket(
    websocket: WebSocket,
    token: str = Query(..., description="JWT access token"),
) -> None:
    """
    Live dashboard WebSocket endpoint.

    The frontend connects here and receives a JSON payload every 5 seconds
    containing the latest telemetry stats and recent log entries.
    """
    # ── Authenticate connection ─────────────────────────────────────────────
    try:
        user_email = decode_token(token)
    except HTTPException:
        logger.warning("WebSocket connection rejected: invalid token.")
        # HTTP 4001 indicates an unauthorized websocket closure
        await websocket.close(code=4001)
        return

    # Accept the connection
    await websocket.accept()
    logger.info(f"WebSocket connected for user: {user_email}")

    # ── Push loop ──────────────────────────────────────────────────────────
    try:
        while True:
            # We copy the dictionary structure to ensure thread-safety against
            # the ingestion scheduler (which is running in the same event loop)
            payload = {
                "stats": {
                    "avg_cpu": rolling_stats["avg_cpu"],
                    "avg_memory": rolling_stats["avg_memory"],
                    "avg_latency": rolling_stats["avg_latency"],
                    "error_count": rolling_stats["error_count"],
                    "total_docs": rolling_stats["total_docs"],
                    "last_updated": rolling_stats["last_updated"],
                },
                "recent_logs": rolling_stats["recent_logs"],
                "cpu_history": rolling_stats["cpu_history"],
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(5.0)  # Sleep matches the INGEST_INTERVAL_SECONDS

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for user: {user_email}")
    except Exception as exc:
        logger.error(f"WebSocket error for user {user_email}: {exc}")
        # Only try to close if the socket isn't already closed
        try:
            await websocket.close(code=1011)
        except Exception:
            pass
