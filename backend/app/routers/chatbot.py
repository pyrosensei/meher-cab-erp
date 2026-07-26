"""
Chatbot HTTP endpoint.

Thin wrapper around `app.ai.chatbot.service.ai_service` that maps HTTP
requests to the local AI subsystem. The router knows nothing about NVIDIA
NIM, ChromaDB, or embeddings — those live entirely in `app.ai`.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from loguru import logger
from pydantic import BaseModel, Field, field_validator

from app.ai.chatbot.service import ai_service


router = APIRouter(prefix="/chat", tags=["AI Chatbot"])


class ChatMessage(BaseModel):
    role: str = Field(..., min_length=1)
    content: str = Field(..., min_length=1)

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: str) -> str:
        allowed_roles = {"system", "user", "assistant"}
        if value not in allowed_roles:
            raise ValueError("role must be one of: system, user, assistant")
        return value


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: list[ChatMessage] = Field(default_factory=list)
    top_k: int | None = Field(default=None, ge=1, le=50)


class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = Field(default_factory=list)
    used_rag: bool = False


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Main chatbot endpoint — delegates to local AI service."""
    try:
        outcome = await ai_service.chat(
            user_message=request.message,
            history=[{"role": m.role, "content": m.content} for m in request.history],
            top_k=request.top_k,
        )
    except ValueError as exc:
        logger.warning(f"Chat request rejected: {exc}")
        raise HTTPException(status_code=422, detail="Invalid chat request") from exc
    except Exception as exc:  # noqa: BLE001 — last-resort guard
        logger.exception(f"Chat endpoint failed: {exc}")
        raise HTTPException(status_code=500, detail="Chat service unavailable") from exc

    return ChatResponse(reply=outcome.reply, sources=outcome.sources, used_rag=outcome.used_rag)


@router.get("/stats")
async def stats() -> dict:
    """Diagnostic endpoint exposing local AI service configuration."""
    return ai_service.stats()
