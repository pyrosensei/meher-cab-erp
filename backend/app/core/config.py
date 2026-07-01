# Centralized settings via pydantic-settings; reads from .env file automatically
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    APP_ENV: str = "development"
    SECRET_KEY: str = "dev-secret-change-in-production"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = "sqlite+aiosqlite:///./meher_erp.db"
    NVIDIA_API_KEY: str = "nvapi-placeholder"
    NIM_BASE_URL: str = "https://integrate.api.nvidia.com/v1"
    NIM_LLM_MODEL: str = "meta/llama-3.1-8b-instruct"
    NIM_EMBEDDING_MODEL: str = "nvidia/nv-embedqa-e5-v5"
    CHROMA_PERSIST_DIR: str = "./data/chroma_db"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
