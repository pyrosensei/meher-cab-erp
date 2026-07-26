"""MeharBot chatbot service - wraps RAG pipeline for the chatbot router."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from app.core.config import settings
from app.ai.rag.pipeline import initialize_rag, query_rag, get_stats


@dataclass
class ChatOutcome:
    reply: str
    sources: list[str]
    used_rag: bool


class AIService:
    """Thin wrapper around RAG pipeline for the chatbot router."""

    @staticmethod
    def _normalize_history(history: list[dict[str, str]]) -> list[dict[str, str]]:
        allowed_roles = {"system", "user", "assistant"}
        normalized_history: list[dict[str, str]] = []

        for turn in history:
            role = turn.get("role", "")
            content = turn.get("content", "")
            if role not in allowed_roles or not content.strip():
                continue
            normalized_history.append({"role": role, "content": content.strip()})

        return normalized_history
    
    async def chat(
        self,
        user_message: str,
        history: list[dict[str, str]],
        top_k: int | None = None,
    ) -> ChatOutcome:
        """Process a chat message through the RAG pipeline."""
        result = await query_rag(
            query=user_message,
            top_k=top_k or settings.rag_top_k,
            history=self._normalize_history(history),
        )
        return ChatOutcome(
            reply=result["reply"],
            sources=result["sources"],
            used_rag=result["used_rag"],
        )
    
    def stats(self) -> dict[str, Any]:
        """Get AI service statistics."""
        return get_stats()


ai_service = AIService()