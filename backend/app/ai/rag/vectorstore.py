import chromadb
from chromadb.config import Settings as ChromaSettings
from app.core.config import settings

def get_chroma_client() -> chromadb.PersistentClient:
    """Return a persistent ChromaDB client from the configured directory."""
    return chromadb.PersistentClient(
        path=settings.CHROMA_PERSIST_DIR,
        settings=ChromaSettings(anonymized_telemetry=False),
    )

def get_or_create_collection(client: chromadb.PersistentClient, name: str = "mehar_erp"):
    """Get or create the main ERP collection with cosine similarity."""
    return client.get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"},
    )
