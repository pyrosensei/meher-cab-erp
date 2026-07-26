"""Backend application settings including AI configuration."""
from __future__ import annotations

from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).parent.parent.parent.parent


class Settings(BaseSettings):
    """Centralised application settings."""

    app_env: str = "development"
    secret_key: str = "dev-secret-change-in-production"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "sqlite+aiosqlite:///./meher_erp.db"
    allowed_origins: List[str] = ["http://localhost:3000"]

    # NVIDIA NIM settings
    nvidia_api_key: str = ""
    nvidia_model: str = "meta/llama-3.1-8b-instruct"
    nvidia_max_tokens: int = 1024
    embedding_model: str = "nvidia/nv-embedqa-e5-v5"

    # RAG settings
    rag_top_k: int = 5

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

def _validate_settings(settings: Settings) -> Settings:
    if settings.app_env != "development":
        if settings.secret_key in {"dev-secret-change-in-production", "meher-cab-erp-dev-secret-key-2025"}:
            raise ValueError("secret_key must be set in non-development environments")
        if not settings.nvidia_api_key:
            raise ValueError("nvidia_api_key must be set in non-development environments")
    return settings


settings = _validate_settings(Settings())
