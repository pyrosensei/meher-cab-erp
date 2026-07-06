"""
Backend application settings (non-AI).

All AI-related configuration (NVIDIA NIM, ChromaDB, RAG, embeddings)
lives in `AI_SEC.config`. Do NOT add AI settings here.
"""
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralised non-AI application settings."""

    app_env: str = "development"
    secret_key: str = "dev-secret-change-in-production"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "sqlite+aiosqlite:///./meher_erp.db"
    allowed_origins: List[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


settings = Settings()
