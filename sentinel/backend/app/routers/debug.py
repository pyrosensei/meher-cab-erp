"""
backend/app/routers/debug.py
=============================
Debug / diagnostic endpoints — not for production use.
"""

from fastapi import APIRouter

from app.vectorstore.chroma import total_docs
from app.services.ingestion import rolling_stats

router = APIRouter(tags=["Debug"])


@router.get("/api/v1/debug/stats")
async def debug_stats() -> dict:
    """Debug endpoint — returns vector store and ingestion stats."""
    return {
        "total_docs": total_docs(),
        "ingestion": {
            "avg_active_trips": rolling_stats["avg_active_trips"],
            "avg_fleet_health": rolling_stats["avg_fleet_health"],
            "avg_wait_time": rolling_stats["avg_wait_time"],
            "avg_revenue_per_hour": rolling_stats["avg_revenue_per_hour"],
            "avg_trip_completion": rolling_stats["avg_trip_completion"],
            "avg_drivers_online": rolling_stats["avg_drivers_online"],
            "error_count": rolling_stats["error_count"],
            "last_updated": rolling_stats["last_updated"],
        },
    }
