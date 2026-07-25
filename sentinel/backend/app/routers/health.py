"""
backend/app/routers/health.py
==============================
Simple liveness check endpoint.

GET /health — polled by:
  - Docker healthcheck
  - The frontend chat page on mount (to show the AI Connected / Backend Offline badge)
"""

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health() -> dict:
    """Liveness check — returns 200 OK when the backend is running."""
    return {"status": "ok", "service": "sentinel-backend"}
