"""
Thin async wrapper around the NVIDIA NIM API (OpenAI-compatible).
Free-tier models (2025): meta/llama-3.1-8b-instruct, nvidia/nv-embedqa-e5-v5
"""
import httpx
from loguru import logger
from app.core.config import settings

class NIMClient:
    def __init__(self):
        self.base_url = settings.NIM_BASE_URL
        self.api_key = settings.NVIDIA_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def chat(self, messages: list, model: str | None = None, max_tokens: int = 1024) -> str:
        """Send chat completion request. Returns assistant reply text."""
        model = model or settings.NIM_LLM_MODEL
        payload = {"model": model, "messages": messages, "max_tokens": max_tokens, "stream": False}
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                json=payload,
                headers=self.headers,
            )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    async def embed(self, texts: list[str]) -> list[list[float]]:
        """Get NIM embeddings. input_type='query' required by nv-embedqa-e5-v5."""
        payload = {
            "model": settings.NIM_EMBEDDING_MODEL,
            "input": texts,
            "input_type": "query",
            "encoding_format": "float",
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.base_url}/embeddings",
                json=payload,
                headers=self.headers,
            )
        response.raise_for_status()
        return [item["embedding"] for item in response.json()["data"]]

# Singleton — import this everywhere instead of instantiating a new client
nim_client = NIMClient()
