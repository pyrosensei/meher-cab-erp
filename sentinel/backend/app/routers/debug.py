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
            "avg_cpu": rolling_stats["avg_cpu"],
            "avg_memory": rolling_stats["avg_memory"],
            "avg_latency": rolling_stats["avg_latency"],
            "error_count": rolling_stats["error_count"],
            "last_updated": rolling_stats["last_updated"],
        },
    }
