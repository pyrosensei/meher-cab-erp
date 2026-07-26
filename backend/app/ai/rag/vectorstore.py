"""In-memory NumPy vector store for RAG (similar to Sentinel's chroma.py)."""

from __future__ import annotations

import uuid
from typing import Any

import numpy as np
from loguru import logger

from app.ai.rag.embedder import embed_texts


_documents: list[dict[str, Any]] = []
_initialized = False


def init_vectorstore() -> None:
    """Initialize the vector store."""
    global _initialized
    if _initialized:
        return
    logger.info("In-memory NumPy vector store initialized.")
    _initialized = True


def upsert_chunks(chunks: list[dict[str, Any]]) -> None:
    """Add chunks to the vector store with embeddings."""
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
    
    logger.info(f"Upserted {len(chunks)} chunks. Total documents: {len(_documents)}")


def query_chunks(query_text: str, top_k: int = 5) -> list[dict[str, Any]]:
    """Query the vector store for similar chunks."""
    if not _documents:
        logger.warning("Vector store is empty — no chunks to retrieve.")
        return []

    query_embedding = np.array(embed_texts([query_text])[0], dtype=np.float32)
    query_norm = np.linalg.norm(query_embedding)
    
    results = []
    for doc in _documents:
        doc_emb = doc["embedding"]
        doc_norm = np.linalg.norm(doc_emb)
        if query_norm == 0 or doc_norm == 0:
            sim = 0.0
        else:
            sim = np.dot(query_embedding, doc_emb) / (query_norm * doc_norm)
        
        dist = 1.0 - float(sim)
        results.append((dist, doc))
    
    results.sort(key=lambda x: x[0])
    top_docs = results[:top_k]
    
    return [
        {"id": doc["id"], "text": doc["text"], "metadata": doc["metadata"], "distance": dist}
        for dist, doc in top_docs
    ]


def total_docs() -> int:
    """Return total number of documents in the store."""
    return len(_documents)


def clear_vectorstore() -> None:
    """Clear all documents from the vector store."""
    global _documents
    _documents = []
    logger.info("Vector store cleared.")