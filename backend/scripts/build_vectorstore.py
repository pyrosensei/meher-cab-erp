"""
Build the in-memory RAG index from seed data.

Usage: cd backend && python scripts/build_vectorstore.py
Requires: NVIDIA_API_KEY in .env
"""
from __future__ import annotations

import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from app.ai.rag.pipeline import get_stats, initialize_rag


def main() -> None:
    print("Building RAG index from seed data...")
    initialize_rag()
    stats = get_stats()
    print(f"Done! Indexed {stats['total_chunks']} chunks.")


if __name__ == "__main__":
    main()
