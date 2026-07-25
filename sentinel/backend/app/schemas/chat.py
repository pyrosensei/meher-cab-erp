"""
backend/app/schemas/chat.py
============================
Pydantic schemas for the RAG chat endpoint.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """A single turn in the conversation history."""
    role: str = Field(..., description="'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    """Payload for POST /api/v1/chat/"""
    message: str = Field(..., min_length=1, description="The user's question")
    history: List[ChatMessage] = Field(
        default_factory=list,
        description="Previous turns for multi-turn context",
    )
    top_k: Optional[int] = Field(
        default=None,
        ge=1,
        le=20,
        description="Override the number of retrieved chunks (default: RAG_TOP_K setting)",
    )


class ChatResponse(BaseModel):
    """Response from POST /api/v1/chat/"""
    reply: str = Field(..., description="The LLM-generated answer, grounded in retrieved context")
    sources: List[str] = Field(
        default_factory=list,
        description="Short labels identifying the retrieved telemetry chunks used",
    )
    used_rag: bool = Field(
        default=False,
        description="True if any relevant chunks were retrieved from ChromaDB",
    )
