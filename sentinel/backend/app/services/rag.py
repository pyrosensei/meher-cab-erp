"""
backend/app/services/rag.py
============================
RAG (Retrieval-Augmented Generation) service.

Pipeline for each chat query:
  1. Embed the user's question using the local sentence-transformers model
  2. Retrieve the top-k most semantically similar telemetry chunks from ChromaDB
  3. Build a grounded system prompt with the retrieved context
  4. Send the prompt + conversation history to the Groq LLM API
  5. Return the reply text + source labels (for citation chips in the UI)

If NVIDIA_API_KEY is not set, raises a clear ValueError that the router
catches and returns as a 422 HTTP response.  The frontend displays a
friendly inline error message — no blank bubbles.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from openai import AsyncOpenAI, OpenAIError
from loguru import logger

from app.core.config import settings
from app.vectorstore.chroma import query_chunks


# ── Response dataclass ─────────────────────────────────────────────────────

@dataclass
class RAGResult:
    reply: str
    sources: list[str] = field(default_factory=list)
    used_rag: bool = False


# ── System prompt template ─────────────────────────────────────────────────

_SYSTEM_PROMPT_TEMPLATE = """\
You are Sentinel, an intelligent monitoring assistant for a containerized service.
You analyze real-time telemetry data — logs and metrics — to answer operator questions.

IMPORTANT RULES:
- Base your answers ONLY on the telemetry context provided below.
- If the context doesn't contain enough information to answer, say so honestly.
- Be concise and precise. Operators need actionable information.
- When citing specific events, include the timestamp and log level.
- For metrics questions, quote the actual numbers from the context.

--- RETRIEVED TELEMETRY CONTEXT ---
{context}
--- END CONTEXT ---

Current time (UTC): {current_time}
"""

_SYSTEM_PROMPT_NO_CONTEXT = """\
You are Sentinel, an intelligent monitoring assistant for a containerized service.
No telemetry data has been ingested yet, or no relevant chunks were found.
Tell the user that you're still waiting for telemetry data to be ingested,
and suggest they wait a few seconds and try again.
"""


# ── OpenAI client for NVIDIA NIM (lazy-initialised) ───────────────────────

_openai_client: AsyncOpenAI | None = None


def _get_llm_client() -> AsyncOpenAI:
    """
    Return the AsyncOpenAI client configured for NVIDIA NIM, initialising it on first call.
    Raises ValueError with a helpful message if the API key is not set.
    """
    global _openai_client
    if _openai_client is None:
        if not settings.nvidia_api_key:
            raise ValueError(
                "NVIDIA_API_KEY environment variable is not set. "
                "Get a free key at https://build.nvidia.com and set it in your .env file."
            )
        _openai_client = AsyncOpenAI(
            api_key=settings.nvidia_api_key,
            base_url="https://integrate.api.nvidia.com/v1",
        )
    return _openai_client


# ── Main RAG function ─────────────────────────────────────────────────────

async def rag_chat(
    user_message: str,
    history: list[dict[str, Any]],
    top_k: int | None = None,
) -> RAGResult:
    """
    Run the full RAG pipeline for a single user message.

    Args:
        user_message: The operator's natural-language question.
        history:      Previous turns in [{role, content}] format.
        top_k:        Override the number of chunks to retrieve.

    Returns:
        RAGResult with reply text, source labels, and a used_rag flag.

    Raises:
        ValueError: If NVIDIA_API_KEY is not configured.
        OpenAIError: On NVIDIA API failures (propagated to the router).
    """
    from datetime import datetime, timezone
    current_time = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    # ── Step 1: Retrieve relevant chunks ──────────────────────────────────
    chunks = query_chunks(user_message, top_k=top_k)

    # ── Step 2: Build context string and source labels ────────────────────
    sources: list[str] = []
    context_parts: list[str] = []

    for i, chunk in enumerate(chunks, start=1):
        meta = chunk.get("metadata", {})
        chunk_type = meta.get("type", "unknown")
        ts = meta.get("timestamp", "")[:19]         # Trim to YYYY-MM-DDTHH:MM:SS
        level = meta.get("level", "")

        # Build a human-readable source label for the citation chip
        if chunk_type == "log":
            label = f"{level} log @ {ts}"
        elif chunk_type == "metrics":
            label = f"Metrics snapshot @ {ts}"
        else:
            label = f"Chunk {i} @ {ts}"
        sources.append(label)

        # Add the chunk text to context (numbered for the LLM to reference)
        context_parts.append(f"[{i}] {chunk['text']}")

    used_rag = bool(chunks)

    # ── Step 3: Build system prompt ───────────────────────────────────────
    if used_rag:
        context_text = "\n".join(context_parts)
        system_prompt = _SYSTEM_PROMPT_TEMPLATE.format(
            context=context_text,
            current_time=current_time,
        )
        logger.debug(f"RAG: retrieved {len(chunks)} chunks for query: {user_message[:60]!r}")
    else:
        system_prompt = _SYSTEM_PROMPT_NO_CONTEXT
        logger.warning(f"RAG: no chunks retrieved for query: {user_message[:60]!r}")

    # ── Step 4: Build the messages list for the LLM ───────────────────────
    messages: list[dict[str, str]] = [{"role": "system", "content": system_prompt}]

    # Include recent conversation history (last 6 turns to stay within token limits)
    for turn in history[-6:]:
        messages.append({"role": turn["role"], "content": turn["content"]})

    # Append the current user message
    messages.append({"role": "user", "content": user_message})

    # ── Step 5: Call NVIDIA NIM via OpenAI SDK ────────────────────────────
    client = _get_llm_client()

    try:
        completion = await client.chat.completions.create(
            model=settings.nvidia_model,
            messages=messages,  # type: ignore[arg-type]
            max_tokens=settings.nvidia_max_tokens,
            temperature=0.2,    # Low temperature → more factual, less creative
        )
        reply = completion.choices[0].message.content or "(empty response)"
    except OpenAIError as exc:
        logger.error(f"NVIDIA API error: {exc}")
        raise

    return RAGResult(reply=reply, sources=sources, used_rag=used_rag)
