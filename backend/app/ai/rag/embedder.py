"""Embedding utilities for RAG pipeline."""

from __future__ import annotations

import numpy as np

from app.ai.nim.client import nim_client


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for a list of texts using NVIDIA NIM."""
    return nim_client.embed_texts(texts)


def embed_text(text: str) -> list[float]:
    """Generate embedding for a single text."""
    return embed_texts([text])[0]


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    a_arr = np.array(a, dtype=np.float32)
    b_arr = np.array(b, dtype=np.float32)
    norm_a = np.linalg.norm(a_arr)
    norm_b = np.linalg.norm(b_arr)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a_arr, b_arr) / (norm_a * norm_b))