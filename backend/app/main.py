from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from app.core.config import settings
from app.core.database import init_db
from app.routers import drivers, vehicles, trips, notifications, dashboard, chatbot

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all DB tables on startup (idempotent)
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

# Register all domain routers under /api/v1
app.include_router(dashboard.router,      prefix=settings.API_V1_PREFIX)
app.include_router(drivers.router,        prefix=settings.API_V1_PREFIX)
app.include_router(vehicles.router,       prefix=settings.API_V1_PREFIX)
app.include_router(trips.router,          prefix=settings.API_V1_PREFIX)
app.include_router(notifications.router,  prefix=settings.API_V1_PREFIX)
app.include_router(chatbot.router,        prefix=settings.API_V1_PREFIX)

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "env": settings.APP_ENV}
