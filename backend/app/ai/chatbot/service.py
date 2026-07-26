"""MeharBot chatbot service - wraps RAG pipeline for the chatbot router."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from app.ai.rag.pipeline import initialize_rag, query_rag, get_stats


@dataclass
class ChatOutcome:
    reply: str
    sources: list[str]
    used_rag: bool


class AIService:
    """Thin wrapper around RAG pipeline for the chatbot router."""
    
    async def chat(
        self,
        user_message: str,
        history: list[dict[str, str]],
        top_k: int | None = None,
    ) -> ChatOutcome:
        """Process a chat message through the RAG pipeline."""
        result = await query_rag(
            query=user_message,
            top_k=top_k or 5,
            history=history,
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