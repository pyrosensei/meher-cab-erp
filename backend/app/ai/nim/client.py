"""NVIDIA NIM async client wrapper for LLM and embeddings."""

from __future__ import annotations

from typing import Any

from openai import AsyncOpenAI, OpenAI
from loguru import logger

from app.core.config import settings


class NIMClient:
    """Async client for NVIDIA NIM API (OpenAI-compatible)."""

    def __init__(self) -> None:
        self._llm_client: AsyncOpenAI | None = None
        self._embed_client: OpenAI | None = None

    @property
    def llm(self) -> AsyncOpenAI:
        if self._llm_client is None:
            if not settings.nvidia_api_key:
                raise ValueError(
                    "NVIDIA_API_KEY environment variable is not set. "
                    "Get a free key at https://build.nvidia.com and set it in your .env file."
                )
            self._llm_client = AsyncOpenAI(
                api_key=settings.nvidia_api_key,
                base_url="https://integrate.api.nvidia.com/v1",
            )
        return self._llm_client

    @property
    def embed(self) -> OpenAI:
        if self._embed_client is None:
            if not settings.nvidia_api_key:
                raise ValueError(
                    "NVIDIA_API_KEY environment variable is not set. "
                    "Get a free key at https://build.nvidia.com and set it in your .env file."
                )
            self._embed_client = OpenAI(
                api_key=settings.nvidia_api_key,
                base_url="https://integrate.api.nvidia.com/v1",
            )
        return self._embed_client

    async def chat_completion(
        self,
        messages: list[dict[str, str]],
        model: str | None = None,
        max_tokens: int | None = None,
        temperature: float = 0.2,
    ) -> str:
        """Call NVIDIA NIM chat completion API."""
        client = self.llm
        completion = await client.chat.completions.create(
            model=model or settings.nvidia_model,
            messages=messages,
            max_tokens=max_tokens or settings.nvidia_max_tokens,
            temperature=temperature,
        )
        return completion.choices[0].message.content or "(empty response)"

    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        """Generate embeddings for a list of texts."""
        client = self.embed
        response = client.embeddings.create(
            input=texts,
            model=settings.embedding_model,
            extra_body={"input_type": "query"},
        )
        return [data.embedding for data in response.data]


nim_client = NIMClient()