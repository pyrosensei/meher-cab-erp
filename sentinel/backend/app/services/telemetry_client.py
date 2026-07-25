"""
backend/app/services/telemetry_client.py
=========================================
Async HTTP client for the mock-container telemetry service.

The backend uses this module to pull new logs and the current metric
snapshot from the mock container. All calls are fire-and-forget from
within the ingestion scheduler — if the mock container is temporarily
unavailable, the error is logged and the next tick retries automatically.
"""

import time
from typing import Any

import httpx
from loguru import logger

from app.core.config import settings


class TelemetryClient:
    """
    Thin async HTTP client wrapping the mock-container REST API.
    Uses httpx for async requests with a shared connection pool.
    """

    def __init__(self) -> None:
        # Shared async client — reused across all scheduler ticks to benefit
        # from HTTP keep-alive and connection pooling.
        self._client = httpx.AsyncClient(
            base_url=settings.mock_container_url,
            timeout=5.0,
        )

    async def get_logs_since(self, since_unix: float) -> list[dict[str, Any]]:
        """
        Fetch log entries from the mock container that were generated after
        `since_unix` (a Unix timestamp float).

        Returns a list of log dicts:
            { "timestamp": "<ISO8601>", "level": "INFO|WARNING|ERROR",
              "message": "...", "service": "mock-service" }

        Returns [] on any HTTP or network error (ingestion simply skips that tick).
        """
        try:
            response = await self._client.get(
                "/logs",
                params={"since": since_unix},
            )
            response.raise_for_status()
            data = response.json()
            return data.get("logs", [])
        except Exception as exc:
            logger.warning(f"Failed to fetch logs from mock container: {exc}")
            return []

    async def get_metrics(self) -> dict[str, Any] | None:
        """
        Fetch the current metric snapshot from the mock container.

        Returns a dict:
            { "cpu_percent": float, "memory_percent": float,
              "latency_ms": float, "requests_per_second": float,
              "timestamp": "<ISO8601>" }

        Returns None on any error.
        """
        try:
            response = await self._client.get("/metrics")
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            logger.warning(f"Failed to fetch metrics from mock container: {exc}")
            return None

    async def close(self) -> None:
        """Close the underlying httpx connection pool."""
        await self._client.aclose()


# Module-level singleton — shared by the ingestion service
telemetry_client = TelemetryClient()
