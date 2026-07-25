"""
mock-container/main.py
======================
Synthetic telemetry generator for the Sentinel demo.

This service runs as a separate container and continuously generates:
  - Realistic log lines (INFO / WARNING / ERROR) with varied messages
  - Metric snapshots (CPU %, memory %, request latency, RPS)
  - Occasional injected spikes so there's always something interesting
    for the RAG chatbot to find

Clients poll:
  GET /logs?since=<unix_timestamp>  → returns new log entries since that time
  GET /metrics                       → returns the current metric snapshot
  GET /health                        → liveness check
"""

import os
import random
import threading
import time
from datetime import datetime, timezone
from typing import Optional

import uvicorn
from fastapi import FastAPI, Query
from pydantic import BaseModel

# ── App ────────────────────────────────────────────────────────────────────
app = FastAPI(title="Sentinel Mock Telemetry Container", version="1.0.0")

# ── In-memory buffers (thread-safe access via locks) ───────────────────────
_logs: list[dict] = []          # Rolling log buffer (capped at MAX_LOGS)
_metrics: dict = {}             # Latest metric snapshot
_logs_lock = threading.Lock()
_metrics_lock = threading.Lock()

MAX_LOGS = 10_000               # Keep at most 10 000 entries in memory

# ── Realistic log message templates by severity ────────────────────────────
LOG_TEMPLATES: dict[str, list[str]] = {
    "INFO": [
        "Request processed: GET /api/products → 200 OK in {a}ms",
        "User authenticated successfully for user_id={a}",
        "Database query returned {a} rows in {b}ms",
        "Cache HIT for key=product_catalog_{a}",
        "Cache MISS for key=session_{a}, fetching from DB",
        "Scheduled job 'cleanup_sessions' completed ({a} rows removed)",
        "New TCP connection from 192.168.1.{a}",
        "Health check passed (uptime {a}s)",
        "Metric export completed: {a} data points sent to collector",
        "Worker thread-{a} started, pool size now {b}",
        "Rate limit counter reset for client_id={a}",
        "Background job 'prune_logs' started",
        "TLS certificate valid, expires in {a} days",
        "Config reload triggered — {a} settings updated",
        "Request queue depth: {a} pending",
    ],
    "WARNING": [
        "High memory usage detected: {a}% (threshold: 70%)",
        "Response time exceeded SLA threshold: {a}ms (limit: 200ms)",
        "Rate limit approaching for client IP 10.0.0.{a}: {b}/100 req",
        "Retry attempt {a}/3 for failed DB query (will retry in {b}ms)",
        "Connection pool at {a}% capacity ({b}/100 connections used)",
        "Disk space below 20%: {a}GB remaining",
        "Deprecated API endpoint called: /api/v1/legacy (client: {a})",
        "Cache eviction triggered: {a} items removed due to memory pressure",
        "External service 'payment-gateway' latency elevated: {a}ms",
        "Worker-{a} queue backlog: {b} messages pending",
    ],
    "ERROR": [
        "Database connection timeout after {a}ms — pool exhausted",
        "Unhandled exception in worker-{a}: NullPointerException at line {b}",
        "Authentication failed for user_id={a}: invalid token",
        "External API call to 'payment-gateway' failed: HTTP 503",
        "Message queue overflow: {a} messages dropped",
        "Circuit breaker OPEN for service 'inventory-service'",
        "Failed to acquire lock for resource '{a}' after {b}ms",
        "Out of memory error in heap allocation: requested {a}MB",
        "SSL handshake failed with peer 203.0.113.{a}",
        "Write-ahead log corruption detected — initiating recovery",
    ],
}

# Spike injection messages (make the AI assistant have something juicy)
SPIKE_MESSAGES = {
    "ERROR": [
        "CRITICAL: Database primary node unreachable — failing over to replica",
        "CRITICAL: Memory leak detected — heap usage at {a}% and climbing",
        "CRITICAL: Cascading failure in microservice mesh — {a} services affected",
    ],
    "WARNING": [
        "ALERT: CPU spike to {a}% — investigating root cause",
        "ALERT: Request queue depth exceeded safe limit: {a} pending",
    ],
}


def _fill(template: str) -> str:
    """Fill {a}, {b} placeholders with random integers for realistic variety."""
    return template.format(a=random.randint(1, 999), b=random.randint(1, 999))


def _generate_log(force_error: bool = False) -> dict:
    """
    Generate a single log entry dict.

    Weights:  INFO 70% | WARNING 20% | ERROR 10%
    5% chance of a 'spike' — a more dramatic message injected to give
    the chatbot something interesting to surface.
    """
    # Decide level
    if force_error:
        level = "ERROR"
    else:
        level = random.choices(["INFO", "WARNING", "ERROR"], weights=[0.70, 0.20, 0.10])[0]

    # Occasionally inject a spike message
    is_spike = random.random() < 0.05 and level in SPIKE_MESSAGES
    if is_spike:
        templates = SPIKE_MESSAGES[level]
    else:
        templates = LOG_TEMPLATES[level]

    message = _fill(random.choice(templates))

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "level": level,
        "message": message,
        "service": "mock-service",
        "is_spike": is_spike,
    }


def _generate_metrics() -> dict:
    """
    Generate a metric snapshot using a random-walk with mean reversion
    so values feel natural and correlated over time.

    Occasional spikes are injected to make the dashboard interesting.
    """
    with _metrics_lock:
        prev = _metrics.copy() if _metrics else {
            "cpu_percent": 25.0,
            "memory_percent": 48.0,
            "latency_ms": 55.0,
            "requests_per_second": 12.0,
        }

    # ── CPU: mean-reverting to ~30%, occasional spike to 70-95% ──────────
    if random.random() < 0.04:              # 4% chance of CPU spike
        cpu = random.uniform(70.0, 95.0)
    else:
        cpu = prev["cpu_percent"] + random.gauss(0, 3)
        cpu = max(5.0, min(95.0, cpu))

    # ── Memory: slow drift up, GC-style drop ~2% of the time ─────────────
    if random.random() < 0.02:             # 2% chance of GC collection
        mem = random.uniform(30.0, 45.0)
    else:
        mem = prev["memory_percent"] + random.gauss(0.3, 1.5)
        mem = max(20.0, min(92.0, mem))

    # ── Latency: correlated with CPU (higher CPU → higher latency) ────────
    base_latency = 25.0 + (cpu / 100.0) * 200.0
    latency = max(5.0, base_latency + random.gauss(0, 15))

    # ── RPS: inversely correlated with latency ────────────────────────────
    rps = max(0.0, 22.0 - (latency / 100.0) * 4.0 + random.gauss(0, 1.5))

    return {
        "cpu_percent": round(cpu, 1),
        "memory_percent": round(mem, 1),
        "latency_ms": round(latency, 1),
        "requests_per_second": round(rps, 1),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def _background_generator() -> None:
    """
    Background daemon thread:
    - Emits a new log line every LOG_INTERVAL_SECONDS
    - Refreshes the metrics snapshot every METRICS_INTERVAL_SECONDS
    - Every ~60 s injects a burst of ERROR messages for demo-readiness
    """
    log_interval = float(os.getenv("LOG_INTERVAL_SECONDS", "1.5"))
    metrics_interval = float(os.getenv("METRICS_INTERVAL_SECONDS", "2.0"))

    last_metrics_ts = 0.0
    last_burst_ts = 0.0
    burst_mode = False
    burst_count = 0

    while True:
        now = time.time()

        # ── Burst mode: inject 5-10 errors in quick succession every ~60 s ──
        if now - last_burst_ts > 60.0 and not burst_mode:
            burst_mode = True
            burst_count = random.randint(5, 10)
            last_burst_ts = now

        # Generate log entry
        log_entry = _generate_log(force_error=burst_mode)
        with _logs_lock:
            _logs.append(log_entry)
            if len(_logs) > MAX_LOGS:
                _logs.pop(0)

        if burst_mode:
            burst_count -= 1
            if burst_count <= 0:
                burst_mode = False

        # Refresh metrics on its own cadence
        if now - last_metrics_ts >= metrics_interval:
            new_metrics = _generate_metrics()
            with _metrics_lock:
                _metrics.update(new_metrics)
            last_metrics_ts = now

        time.sleep(log_interval)


# ── Start the background generator on module load ─────────────────────────
_thread = threading.Thread(target=_background_generator, daemon=True)
_thread.start()


# ── Routes ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health() -> dict:
    """Liveness check — used by Docker healthcheck and the backend."""
    return {"status": "ok", "service": "mock-container"}


@app.get("/logs")
def get_logs(
    since: Optional[float] = Query(
        default=None,
        description="Unix timestamp (float). Only return logs newer than this.",
    )
) -> dict:
    """
    Return log entries from the buffer.

    - If `since` is provided: return only logs with timestamp > since.
    - If `since` is omitted: return the most recent 50 entries (useful for
      initial page load or manual inspection).

    The backend calls this every 5 seconds with the Unix timestamp of the
    last poll so it only receives incremental new data.
    """
    with _logs_lock:
        if since is None:
            return {"logs": list(_logs[-50:])}

        # Convert the Unix float to an ISO string for direct string comparison
        # (ISO 8601 strings sort lexicographically when using UTC with the same format)
        since_iso = datetime.fromtimestamp(since, tz=timezone.utc).isoformat()
        filtered = [entry for entry in _logs if entry["timestamp"] > since_iso]
        return {"logs": filtered}


@app.get("/metrics")
def get_metrics() -> dict:
    """Return the current metric snapshot (CPU, memory, latency, RPS)."""
    with _metrics_lock:
        if not _metrics:
            return {
                "cpu_percent": 0.0,
                "memory_percent": 0.0,
                "latency_ms": 0.0,
                "requests_per_second": 0.0,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        return dict(_metrics)


# ── Entrypoint ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
