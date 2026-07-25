"""
backend/app/core/database.py
=============================
Async SQLAlchemy setup for SQLite.

We use:
  - AsyncEngine        — non-blocking I/O with aiosqlite
  - async_sessionmaker — factory for per-request sessions
  - Base               — declarative base for ORM models
"""

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


class Base(DeclarativeBase):
    """Shared declarative base — all ORM models inherit from this."""
    pass


# Create the async engine.
# check_same_thread=False is required for SQLite with async drivers.
engine = create_async_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},
    echo=False,  # Set to True to see raw SQL in logs during development
)

# Session factory — each request gets its own session via Depends(get_session)
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db() -> None:
    """
    Create all tables defined on Base.metadata.
    Called once at application startup — idempotent (won't drop existing tables).
    """
    async with engine.begin() as conn:
        # Import all models so they are registered on Base.metadata
        from app.models import user  # noqa: F401
        await conn.run_sync(Base.metadata.create_all)


async def get_session() -> AsyncSession:  # type: ignore[return]
    """
    FastAPI dependency that yields a database session.
    Usage in a router:
        session: AsyncSession = Depends(get_session)
    """
    async with AsyncSessionLocal() as session:
        yield session
