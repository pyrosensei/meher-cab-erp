"""
backend/app/core/config.py
===========================
Centralised settings using pydantic-settings.

All values can be overridden via environment variables (case-insensitive).
The .env file in the backend directory is loaded automatically.
"""

from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── Auth ──────────────────────────────────────────────────────────────
    secret_key: str = "sentinel-dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days

    # ── Database ──────────────────────────────────────────────────────────
    database_url: str = "sqlite+aiosqlite:///./sentinel.db"

    # ── Mock container ────────────────────────────────────────────────────
    mock_container_url: str = "http://localhost:8001"

    # ── ChromaDB ──────────────────────────────────────────────────────────
    chroma_path: str = "./chroma_db"
    chroma_collection: str = "telemetry"

    # ── Embedding model (NVIDIA NIM) ──────────────────────────────────────
    embedding_model: str = "nvidia/nv-embedqa-e5-v5"

    # ── NVIDIA NIM LLM ───────────────────────────────────────────────────
    nvidia_api_key: str = ""          # Must be set via env var
    nvidia_model: str = "meta/llama-3.1-8b-instruct"
    nvidia_max_tokens: int = 1024

    # ── Ingestion ─────────────────────────────────────────────────────────
    ingest_interval_seconds: int = 5
    # How many recent metric snapshots to use for the rolling-avg window
    rolling_window_size: int = 60

    # ── RAG ───────────────────────────────────────────────────────────────
    rag_top_k: int = 5

    # ── CORS ──────────────────────────────────────────────────────────────
    allowed_origins: List[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


# Module-level singleton — import this everywhere
settings = Settings()
