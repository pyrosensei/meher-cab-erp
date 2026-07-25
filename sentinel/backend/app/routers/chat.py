"""
backend/app/routers/chat.py
============================
RAG chat endpoint — the main AI inference route.

POST /api/v1/chat/
  - Requires a valid Bearer JWT (enforced via Depends(get_current_user_email))
  - Delegates to rag_chat() in the RAG service
  - Returns { reply, sources, used_rag }
"""

from fastapi import APIRouter, Depends, HTTPException, status
from loguru import logger

from app.core.security import get_current_user_email
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag import rag_chat

router = APIRouter(tags=["Chat"])


@router.post("/chat/", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    current_user: str = Depends(get_current_user_email),
) -> ChatResponse:
    """
    Send a message to the RAG assistant.

    The assistant:
      1. Embeds the message
      2. Retrieves top-k relevant telemetry chunks from ChromaDB
      3. Builds a grounded prompt
      4. Calls the NVIDIA NIM LLM via OpenAI API
      5. Returns the reply + source citations

    A 422 is returned if NVIDIA_API_KEY is not configured (clearly explained in
    the error detail so the frontend can show a helpful message).
    A 503 is returned on NVIDIA API failures.
    """
    logger.info(f"Chat request from {current_user}: {body.message[:80]!r}")

    try:
        result = await rag_chat(
            user_message=body.message,
            history=[m.model_dump() for m in body.history],
            top_k=body.top_k,
        )
    except ValueError as exc:
        # NVIDIA_API_KEY not configured
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.error(f"RAG chat failed: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI service encountered an error. Please try again.",
        ) from exc

    return ChatResponse(
        reply=result.reply,
        sources=result.sources,
        used_rag=result.used_rag,
    )
