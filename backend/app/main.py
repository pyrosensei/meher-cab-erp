"""FastAPI application entry point."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.core.config import settings
from app.core.database import init_db
from app.routers import chatbot, dashboard, drivers, notifications, trips, vehicles


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all DB tables on startup (idempotent).
    await init_db()
    logger.info(f"Mehar ERP API started [{settings.APP_ENV}] — docs at /api/docs")
    yield
    logger.info("Mehar ERP API shutting down")


app = FastAPI(
    title="Mehar Cab ERP API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all domain routers under /api/v1.
for router in (dashboard, drivers, vehicles, trips, notifications, chatbot):
    app.include_router(router.router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
async def health() -> dict:
    """Health check endpoint."""
    return {"status": "ok", "env": settings.APP_ENV}
