"""
RAG pipeline: indexing (run once via build_vectorstore.py) + retrieval (per query).
"""
from loguru import logger
from app.ai.rag.loader import load_all_documents
from app.ai.rag.chunker import chunk_documents
from app.ai.rag.embedder import NIMEmbeddings
from app.ai.rag.vectorstore import get_chroma_client, get_or_create_collection

class RAGPipeline:
    def __init__(self):
        self.embedder = NIMEmbeddings()
        self.client = get_chroma_client()
        self.collection = get_or_create_collection(self.client)

    async def index(self):
        """Build vector index from seed data. Run once via build_vectorstore.py."""
        docs = load_all_documents()
        chunks = chunk_documents(docs)
        logger.info(f"Indexing {len(chunks)} chunks into ChromaDB...")

        texts = [c.page_content for c in chunks]
        metas = [c.metadata for c in chunks]
        ids = [f"chunk_{i}" for i in range(len(chunks))]

        embeddings = await self.embedder.aembed_documents(texts)
        self.collection.upsert(documents=texts, embeddings=embeddings, metadatas=metas, ids=ids)
        logger.info("ChromaDB indexing complete.")

    async def retrieve(self, query: str, n_results: int = 5) -> tuple[str, list[str]]:
        """Embed query, search ChromaDB, return (context string, source file list)."""
        query_embedding = await self.embedder.aembed_query(query)
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            include=["documents", "metadatas"],
        )

        documents = results["documents"][0] if results["documents"] else []
        metadatas = results["metadatas"][0] if results["metadatas"] else []

        if not documents:
            return "", []

        context = "\n\n".join(documents)
        sources = list({m.get("source", "unknown") for m in metadatas})
        return context, sources

# Module-level singleton — shared across all requests
rag_pipeline = RAGPipeline()
