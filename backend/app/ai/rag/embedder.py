"""
LangChain-compatible embedding class backed by NVIDIA NIM.
Batches requests in groups of 96 (NIM free tier limit per call).
"""
import asyncio
from langchain_core.embeddings import Embeddings
from app.ai.nim.client import nim_client

class NIMEmbeddings(Embeddings):
    async def aembed_documents(self, texts: list[str]) -> list[list[float]]:
        """Async batch embedding with NIM, 96 texts per request max."""
        results = []
        for i in range(0, len(texts), 96):
            batch = texts[i:i + 96]
            embeddings = await nim_client.embed(batch)
            results.extend(embeddings)
        return results

    async def aembed_query(self, text: str) -> list[float]:
        result = await nim_client.embed([text])
        return result[0]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        # Sync fallback — avoid calling this from async context
        return asyncio.run(self.aembed_documents(texts))

    def embed_query(self, text: str) -> list[float]:
        return asyncio.run(self.aembed_query(text))
