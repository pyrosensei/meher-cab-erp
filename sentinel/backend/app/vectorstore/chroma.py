"""
backend/app/vectorstore/chroma.py
==================================
Pure Python/NumPy in-memory vector store.

(Replaced ChromaDB because it requires C++ build tools on Windows for Python 3.14)
"""

from __future__ import annotations

import uuid
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


def embed_texts(texts: list[str]) -> list[list[float]]:
    client = _get_embedder_client()
    response = client.embeddings.create(
        input=texts,
        model=settings.embedding_model,
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


def query_chunks(
    query_text: str,
    top_k: int | None = None,
) -> list[dict[str, Any]]:
    if not _documents:
        logger.warning("Vector store is empty — no chunks to retrieve.")
        return []

    k = top_k or settings.rag_top_k

    query_embedding = np.array(embed_texts([query_text])[0], dtype=np.float32)
    
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
