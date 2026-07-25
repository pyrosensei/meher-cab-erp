"""
Chatbot HTTP endpoint.

Thin wrapper around `AI_SEC.services.ai_service` that maps HTTP
requests to the AI subsystem. The router knows nothing about NVIDIA
NIM, ChromaDB, or embeddings — those live entirely in `AI_SEC`.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from loguru import logger
from pydantic import BaseModel, Field

try:
    from AI_SEC.services.ai_service import ai_service
except ImportError:
    ai_service = None
    logger.warning(
        "AI_SEC.services.ai_service is not available in this workspace; "
        "the chatbot endpoint will return a clear service-unavailable error."
    )


router = APIRouter(prefix="/chat", tags=["AI Chatbot"])


class ChatMessage(BaseModel):
    role: str = Field(..., min_length=1)
    content: str = Field(..., min_length=1)


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
    """Main chatbot endpoint — delegates entirely to AI_SEC."""
    if ai_service is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "AI chatbot service is not available in this workspace. "
                "The expected AI_SEC implementation is missing from the repository."
            ),
        )

    try:
        outcome = await ai_service.chat(
            user_message=request.message,
            history=[{"role": m.role, "content": m.content} for m in request.history],
            top_k=request.top_k,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 — last-resort guard
        logger.exception(f"Chat endpoint failed: {exc}")
        raise HTTPException(status_code=500, detail="Chat service unavailable") from exc

    return ChatResponse(reply=outcome.reply, sources=outcome.sources, used_rag=outcome.used_rag)


@router.get("/stats")
async def stats() -> dict:
    """Diagnostic endpoint exposing AI_SEC configuration."""
    if ai_service is None:
        return {
            "available": False,
            "reason": "AI_SEC.services.ai_service is missing from this workspace",
        }

    return ai_service.stats()
