"""
Build the ChromaDB vector index from seed data.
Usage: cd backend && python scripts/build_vectorstore.py
Requires: NVIDIA_API_KEY in .env
"""
import asyncio
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from app.ai.rag.pipeline import rag_pipeline

async def main():
    print("Building ChromaDB vector store from seed data...")
    await rag_pipeline.index()
    print("Done! Vector store is ready.")

if __name__ == "__main__":
    asyncio.run(main())
