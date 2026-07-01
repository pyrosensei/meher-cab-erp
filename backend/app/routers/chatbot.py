from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from loguru import logger
from app.ai.chatbot.service import chatbot_service
from app.ai.rag.pipeline import rag_pipeline

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str
    sources: List[str] = []

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chatbot endpoint — retrieves RAG context then queries NIM LLM."""
    if not request.message.strip():
        raise HTTPException(status_code=422, detail="Message cannot be empty")

    # Gracefully degrade if RAG fails — chatbot still works without context
    context, sources = "", []
    try:
        context, sources = await rag_pipeline.retrieve(request.message)
    except Exception as e:
        logger.warning(f"RAG retrieval failed (non-fatal): {e}")

    history = [{"role": m.role, "content": m.content} for m in request.history]
    reply = await chatbot_service.respond(
        user_message=request.message,
        history=history,
        context=context,
    )
    return ChatResponse(reply=reply, sources=sources)
