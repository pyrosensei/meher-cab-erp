"""
backend/app/main.py
====================
FastAPI application factory.

Responsibilities:
  - Assemble all routers under the /api/v1 prefix
  - Initialise the database tables on startup
  - Start the ingestion APScheduler job on startup
  - Load the embedding model once (shared singleton)
  - CORS middleware so the Next.js dev server can reach the API
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.core.config import settings
from app.core.database import init_db
from app.routers import auth, chat, health, websocket
from app.services.ingestion import start_scheduler, stop_scheduler
from app.vectorstore.chroma import init_chroma


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager — runs startup logic before the first
    request and teardown logic on shutdown.
    """
    # ── Startup ────────────────────────────────────────────────────────────
    logger.info("Sentinel backend starting up…")

    # 1. Create SQLite tables (idempotent — safe to call on every restart)
    await init_db()
    logger.info("Database tables ready.")

    # 2. Initialise ChromaDB collection (creates the collection if absent)
    init_chroma()
    logger.info("ChromaDB collection ready.")

    # 3. Start the ingestion background scheduler
    #    (polls mock-container every INGEST_INTERVAL_SECONDS and embeds new data)
    start_scheduler()
    logger.info(f"Ingestion scheduler started — tick every {settings.ingest_interval_seconds}s.")

    yield  # ← app is now serving requests

    # ── Shutdown ───────────────────────────────────────────────────────────
    stop_scheduler()
    logger.info("Sentinel backend shut down.")


# ── Create the FastAPI app ─────────────────────────────────────────────────
app = FastAPI(
    title="Sentinel API",
    version="1.0.0",
    description="Real-time RAG assistant for container telemetry monitoring.",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────
# Allow the Next.js dev server (and any configured origins) to call the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ───────────────────────────────────────────────────────
app.include_router(health.router)                              # GET /health
app.include_router(auth.router, prefix="/api/v1/auth")        # POST /api/v1/auth/*
app.include_router(chat.router, prefix="/api/v1")             # POST /api/v1/chat/
app.include_router(websocket.router)                          # WS  /ws/dashboard
