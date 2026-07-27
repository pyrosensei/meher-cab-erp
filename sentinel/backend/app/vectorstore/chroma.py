"""
backend/app/vectorstore/chroma.py
==================================
Pure Python/NumPy in-memory vector store.

(Replaced ChromaDB because it requires C++ build tools on Windows for Python 3.14)
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

import numpy as np
from loguru import logger
from openai import OpenAI

from app.core.config import settings


# ── Module-level singletons ────────────────────────────────────────────────
_documents: list[dict[str, Any]] = []
_embedder_client: OpenAI | None = None


def init_chroma() -> None:
    """Initialise the embedding model."""
    global _embedder_client

    if not settings.nvidia_api_key:
        logger.warning("NVIDIA_API_KEY is not set. Ingestion/RAG will fail if called.")
    
    _embedder_client = OpenAI(
        api_key=settings.nvidia_api_key or "dummy",
        base_url="https://integrate.api.nvidia.com/v1",
    )
    logger.info(f"NVIDIA Embedding client ready (model: {settings.embedding_model}).")
    logger.info("In-memory Numpy vector store initialized.")


def _get_embedder_client() -> OpenAI:
    if _embedder_client is None:
        raise RuntimeError("Embedder not initialised — call init_chroma() first.")
    return _embedder_client


def embed_texts(texts: list[str], input_type: str = "passage") -> list[list[float]]:
    client = _get_embedder_client()
    response = client.embeddings.create(
        input=texts,
        model=settings.embedding_model,
        extra_body={"input_type": input_type},
    )
    return [data.embedding for data in response.data]


def upsert_chunks(chunks: list[dict[str, Any]]) -> None:
    if not chunks:
        return

    texts = [c["text"] for c in chunks]
    ids = [c.get("id") or str(uuid.uuid4()) for c in chunks]
    metadatas = [c.get("metadata", {}) for c in chunks]

    embeddings = embed_texts(texts)

    for i in range(len(chunks)):
        _documents.append({
            "id": ids[i],
            "text": texts[i],
            "metadata": metadatas[i],
            "embedding": np.array(embeddings[i], dtype=np.float32)
        })


def _parse_timestamp(ts: str | None) -> datetime | None:
    """Parse an ISO 8601 timestamp string, returning None on failure."""
    if not ts:
        return None
    try:
        return datetime.fromisoformat(ts)
    except (ValueError, TypeError):
        return None


_RECENCY_DECAY_HOURS = 6.0  # Chunks older than this get no recency bonus.


def query_chunks(
    query_text: str,
    top_k: int | None = None,
) -> list[dict[str, Any]]:
    if not _documents:
        logger.warning("Vector store is empty — no chunks to retrieve.")
        return []

    k = top_k or settings.rag_top_k
    now = datetime.now(timezone.utc)

    query_embedding = np.array(embed_texts([query_text], input_type="query")[0], dtype=np.float32)
    
    # Calculate cosine similarity using Numpy
    results = []
    query_norm = np.linalg.norm(query_embedding)
    
    for doc in _documents:
        doc_emb = doc["embedding"]
        doc_norm = np.linalg.norm(doc_emb)
        if query_norm == 0 or doc_norm == 0:
            sim = 0.0
        else:
            sim = np.dot(query_embedding, doc_emb) / (query_norm * doc_norm)
        
        # Distance = 1 - similarity (to match chromadb's distance metric)
        dist = 1.0 - float(sim)

        # Recency boost: reduce distance for newer chunks
        ts = _parse_timestamp(doc.get("metadata", {}).get("timestamp"))
        if ts:
            age_hours = (now - ts).total_seconds() / 3600.0
            # Linear decay: 0 hours → full recency bonus (dist -0.1), _RECENCY_DECAY_HOURS → no bonus
            recency_bonus = max(0.0, 1.0 - age_hours / _RECENCY_DECAY_HOURS) * 0.1
            dist -= recency_bonus

        results.append((dist, doc))
        
    # Sort by distance ascending (lowest distance = highest similarity)
    results.sort(key=lambda x: x[0])
    
    top_docs = results[:k]
    
    return [
        {"id": doc["id"], "text": doc["text"], "metadata": doc["metadata"], "distance": dist}
        for dist, doc in top_docs
    ]


def total_docs() -> int:
    return len(_documents)