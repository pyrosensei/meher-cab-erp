"""
backend/app/services/ingestion.py
===================================
Telemetry ingestion service — the heart of the data pipeline.

What happens every INGEST_INTERVAL_SECONDS seconds:
  1. Poll GET /logs?since=<last_ts>  → get new log lines
  2. Poll GET /metrics               → get the current metric snapshot
  3. Chunk each log line into a text document
  4. Chunk the metric snapshot into a summary text document
  5. Embed all new chunks with sentence-transformers (via the chroma module)
  6. Upsert into ChromaDB with metadata (timestamp, level, type)
  7. Update the in-memory rolling stats (shared with the WebSocket hub)

The rolling stats dict is read by the WebSocket router to push dashboard
updates to connected browsers.
"""

from __future__ import annotations

import asyncio
import time
import uuid
from collections import deque
from datetime import datetime, timezone
from typing import Any

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from loguru import logger

from app.core.config import settings
from app.services.telemetry_client import telemetry_client
from app.vectorstore.chroma import total_docs, upsert_chunks

# ── Rolling stats ─────────────────────────────────────────────────────────
# Shared in-memory state read by the WebSocket router.
# Thread-safety note: APScheduler runs the job in the main asyncio event
# loop, so reading from async WS handlers is safe (single-threaded event loop).

rolling_stats: dict[str, Any] = {
    "avg_active_trips": 0.0,
    "avg_fleet_health": 0.0,
    "avg_wait_time": 0.0,
    "avg_revenue_per_hour": 0.0,
    "avg_trip_completion": 0.0,
    "avg_drivers_online": 0.0,
    "error_count": 0,
    "total_docs": 0,
    "last_updated": None,
    "recent_logs": [],          # Last 50 log entries for the live feed
    "metric_history": [],       # Last 30 metric snapshots for the chart
}

# Internal ring buffers (not exposed to callers)
_metric_window: deque = deque(maxlen=settings.rolling_window_size)  # last N metric snapshots
_log_window: deque = deque(maxlen=50)    # last 50 log entries for live feed
_error_window: deque = deque(maxlen=200) # last 200 entries to count errors

# Unix timestamp of the last successful log poll
# Initialise to 60 seconds ago so we grab some seed data on the first tick
_last_poll_ts: float = time.time() - 60.0


# ── Scheduler setup ───────────────────────────────────────────────────────
_scheduler = AsyncIOScheduler()


def start_scheduler() -> None:
    """Start the APScheduler — called once at app startup."""
    _scheduler.add_job(
        _ingest_tick,
        trigger="interval",
        seconds=settings.ingest_interval_seconds,
        id="ingestion",
        max_instances=1,          # Prevent overlapping runs
        coalesce=True,            # Skip missed ticks instead of queuing them
        next_run_time=datetime.now(timezone.utc),  # Run immediately on startup
    )
    _scheduler.start()
    logger.info("Ingestion scheduler started.")


def stop_scheduler() -> None:
    """Gracefully shut down the scheduler — called on app shutdown."""
    if _scheduler.running:
        _scheduler.shutdown(wait=False)
        logger.info("Ingestion scheduler stopped.")


# ── Core ingestion logic ──────────────────────────────────────────────────

async def _ingest_tick() -> None:
    """
    Single ingestion tick — runs every INGEST_INTERVAL_SECONDS.
    Errors are caught so a transient failure doesn't stop the scheduler.
    """
    global _last_poll_ts
    try:
        await _do_ingest()
    except Exception as exc:
        logger.opt(exception=True).error("Ingestion tick failed: {}", exc)


async def _do_ingest() -> None:
    """The actual ingestion work."""
    global _last_poll_ts

    tick_start = time.time()

    # ── 1. Poll new logs ──────────────────────────────────────────────────
    new_logs = await telemetry_client.get_logs_since(_last_poll_ts)

    # ── 2. Poll current metrics ───────────────────────────────────────────
    metrics = await telemetry_client.get_metrics()

    # Update the poll timestamp AFTER successful fetch
    _last_poll_ts = time.time()

    chunks_to_upsert: list[dict[str, Any]] = []

    # ── 3. Chunk log entries ──────────────────────────────────────────────
    for entry in new_logs:
        # Convert each log line into a self-contained text document
        text = (
            f"[{entry['timestamp']}] [{entry['level']}] {entry['message']} "
            f"(service: {entry.get('service', 'unknown')})"
        )
        chunk_id = f"log_{uuid.uuid4().hex[:16]}"
        chunks_to_upsert.append({
            "id": chunk_id,
            "text": text,
            "metadata": {
                "type": "log",
                "level": entry["level"],
                "timestamp": entry["timestamp"],
                "service": entry.get("service", "mock-service"),
            },
        })

        # Update the log and error windows
        _log_window.append(entry)
        _error_window.append(entry)

    # ── 4. Chunk metric snapshot ──────────────────────────────────────────
    if metrics:
        ts = metrics.get("timestamp", datetime.now(timezone.utc).isoformat())
        text = (
            f"Fleet KPI snapshot at {ts}: "
            f"Active trips={metrics['active_trips']}, "
            f"Fleet health={metrics['fleet_health_score']}%, "
            f"Drivers online={metrics['driver_online_count']}, "
            f"Avg wait={metrics['avg_wait_time_min']}min, "
            f"Revenue/hr=₹{metrics['revenue_per_hour']}, "
            f"Trip completion={metrics['trip_completion_rate']}%"
        )
        chunk_id = f"metric_{uuid.uuid4().hex[:16]}"
        chunks_to_upsert.append({
            "id": chunk_id,
            "text": text,
            "metadata": {
                "type": "metrics",
                "timestamp": ts,
                "active_trips": metrics["active_trips"],
                "fleet_health": metrics["fleet_health_score"],
                "drivers_online": metrics["driver_online_count"],
                "avg_wait_min": metrics["avg_wait_time_min"],
                "revenue_per_hour": metrics["revenue_per_hour"],
                "trip_completion_rate": metrics["trip_completion_rate"],
            },
        })

        # Update rolling metric window
        _metric_window.append(metrics)

    # ── 5. Upsert all chunks into ChromaDB ────────────────────────────────
    if chunks_to_upsert:
        upsert_chunks(chunks_to_upsert)
        logger.debug(f"Upserted {len(chunks_to_upsert)} chunks into ChromaDB.")

    # ── 6. Recompute rolling stats ────────────────────────────────────────
    _recompute_stats()

    elapsed = (time.time() - tick_start) * 1000
    logger.debug(
        f"Ingest tick complete in {elapsed:.0f}ms — "
        f"new_logs={len(new_logs)}, chunks={len(chunks_to_upsert)}"
    )


def _recompute_stats() -> None:
    """
    Recompute all rolling_stats from the current window buffers.
    This is called after every ingestion tick.
    """
    # Averages from the metric window
    if _metric_window:
        trips_vals = [m["active_trips"] for m in _metric_window]
        health_vals = [m["fleet_health_score"] for m in _metric_window]
        wait_vals = [m["avg_wait_time_min"] for m in _metric_window]
        rev_vals = [m["revenue_per_hour"] for m in _metric_window]
        rate_vals = [m["trip_completion_rate"] for m in _metric_window]
        driver_vals = [m["driver_online_count"] for m in _metric_window]
        rolling_stats["avg_active_trips"] = round(sum(trips_vals) / len(trips_vals), 1)
        rolling_stats["avg_fleet_health"] = round(sum(health_vals) / len(health_vals), 1)
        rolling_stats["avg_wait_time"] = round(sum(wait_vals) / len(wait_vals), 1)
        rolling_stats["avg_revenue_per_hour"] = round(sum(rev_vals) / len(rev_vals), 1)
        rolling_stats["avg_trip_completion"] = round(sum(rate_vals) / len(rate_vals), 1)
        rolling_stats["avg_drivers_online"] = round(sum(driver_vals) / len(driver_vals), 1)

    # Error count across the recent log window
    rolling_stats["error_count"] = sum(
        1 for e in _error_window if e.get("level") == "ERROR"
    )

    # Total docs ever ingested into ChromaDB
    rolling_stats["total_docs"] = total_docs()

    # Recent log entries for the live telemetry feed
    rolling_stats["recent_logs"] = list(_log_window)

    # Metric history for the dashboard chart (last 30 data points)
    window = list(_metric_window)[-30:]
    rolling_stats["metric_history"] = [
        {
            "t": m["timestamp"][11:19],  # Extract HH:MM:SS from ISO string
            "active_trips": m["active_trips"],
            "fleet_health": m["fleet_health_score"],
            "revenue_per_hour": m["revenue_per_hour"],
        }
        for m in window
    ]

    rolling_stats["last_updated"] = datetime.now(timezone.utc).isoformat()
