"""RAG pipeline for MeharBot - orchestrates loading, chunking, embedding, and querying."""

from __future__ import annotations

import numpy as np
from loguru import logger
from typing import Any

from app.ai.rag.loader import load_all_seed_data
from app.ai.rag.chunker import chunk_driver, chunk_vehicle, chunk_trip, chunk_notification
from app.ai.nim.client import nim_client
from app.core.config import settings


# Module-level singletons
_documents: list[dict[str, Any]] = []
_initialized = False


def initialize_rag() -> None:
    """Initialize the RAG pipeline: load data, chunk, embed, and store."""
    global _initialized, _documents
    
    if _initialized:
        logger.info("RAG already initialized, skipping.")
        return
    
    logger.info("Initializing RAG pipeline...")
    
    # Load seed data
    seed_data = load_all_seed_data()
    
    # Chunk all data
    all_chunks: list[dict[str, Any]] = []
    
    for driver in seed_data.get("drivers", []):
        all_chunks.extend(chunk_driver(driver))
    
    for vehicle in seed_data.get("vehicles", []):
        all_chunks.extend(chunk_vehicle(vehicle))
    
    for trip in seed_data.get("trips", []):
        all_chunks.extend(chunk_trip(trip))
    
    for notification in seed_data.get("notifications", []):
        all_chunks.extend(chunk_notification(notification))
    
    logger.info(f"Created {len(all_chunks)} chunks from seed data.")
    
    # Generate embeddings
    texts = [chunk["text"] for chunk in all_chunks]
    embeddings = nim_client.embed_texts(texts)
    
    # Store in memory
    for i, chunk in enumerate(all_chunks):
        _documents.append({
            "id": chunk.get("id", f"chunk-{i}"),
            "text": chunk["text"],
            "metadata": chunk.get("metadata", {}),
            "embedding": np.array(embeddings[i], dtype=np.float32),
        })
    
    _initialized = True
    logger.info(f"RAG pipeline initialized with {len(_documents)} documents.")


def total_docs() -> int:
    """Return total number of documents in the vector store."""
    return len(_documents)


def query_chunks(query_text: str, top_k: int = 5) -> list[dict[str, Any]]:
    """Query the vector store for relevant chunks."""
    if not _documents:
        logger.warning("Vector store is empty — no chunks to retrieve.")
        return []
    
    # Embed query
    query_embedding = np.array(nim_client.embed_texts([query_text])[0], dtype=np.float32)
    query_norm = np.linalg.norm(query_embedding)
    
    if query_norm == 0:
        logger.warning("Query embedding has zero norm.")
        return []
    
    # Calculate cosine similarity
    results = []
    for doc in _documents:
        doc_emb = doc["embedding"]
        doc_norm = np.linalg.norm(doc_emb)
        if doc_norm == 0:
            sim = 0.0
        else:
            sim = float(np.dot(query_embedding, doc_emb) / (query_norm * doc_norm))
        dist = 1.0 - sim
        results.append((dist, doc))
    
    # Sort by distance (ascending = most similar first)
    results.sort(key=lambda x: x[0])
    
    top_docs = results[:top_k]
    
    return [
        {
            "id": doc["id"],
            "text": doc["text"],
            "metadata": doc["metadata"],
            "distance": dist,
        }
        for dist, doc in top_docs
    ]


async def query_rag(
    query: str,
    top_k: int = 5,
    history: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    """Run the full RAG pipeline for a query."""
    if not _initialized:
        initialize_rag()
    
    # Retrieve relevant chunks
    chunks = query_chunks(query, top_k=top_k)
    
    # Build context and sources
    sources: list[str] = []
    context_parts: list[str] = []
    
    for i, chunk in enumerate(chunks, start=1):
        meta = chunk.get("metadata", {})
        chunk_type = meta.get("type", "unknown")
        
        if chunk_type == "driver":
            label = f"Driver: {meta.get('name', 'Unknown')} ({meta.get('driver_id', 'N/A')})"
        elif chunk_type == "vehicle":
            label = f"Vehicle: {meta.get('registration', 'Unknown')} ({meta.get('vehicle_id', 'N/A')})"
        elif chunk_type == "trip":
            label = f"Trip: {meta.get('trip_id', 'Unknown')} (Driver: {meta.get('driver_id', 'N/A')})"
        elif chunk_type == "notification":
            label = f"Notification: {meta.get('notification_id', 'Unknown')} ({meta.get('type', 'system')})"
        else:
            label = f"Chunk {i} ({chunk_type})"
        
        sources.append(label)
        context_parts.append(f"[{i}] {chunk['text']}")
    
    used_rag = bool(chunks)
    
    # Build system prompt
    if used_rag:
        context_text = "\n\n".join(context_parts)
        system_prompt = f"""You are MeharBot, an AI assistant for the Mehar Cab ERP system.
You help fleet operators answer questions about drivers, vehicles, trips, and notifications.

IMPORTANT RULES:
- Base your answers ONLY on the fleet data context provided below.
- If the context doesn't contain enough information to answer, say so honestly.
- Be concise and precise. Fleet operators need actionable information.
- When citing specific data, reference the source (driver name, vehicle ID, trip ID, etc.).
- For numerical questions, quote the exact numbers from the context.

--- FLEET DATA CONTEXT ---
{context_text}
--- END CONTEXT ---
"""
    else:
        system_prompt = """You are MeharBot, an AI assistant for the Mehar Cab ERP system.
No fleet data has been indexed yet, or no relevant data was found for the query.
Tell the user that you're waiting for data to be indexed, or that you couldn't find relevant information.
Suggest they wait a moment and try again, or rephrase their question."""
    
    # Build messages for LLM
    messages = [{"role": "system", "content": system_prompt}]
    
    if history:
        for turn in history[-6:]:
            messages.append({"role": turn["role"], "content": turn["content"]})
    
    messages.append({"role": "user", "content": query})
    
    # Call NVIDIA NIM LLM
    reply = await nim_client.chat_completion(messages)
    
    return {
        "reply": reply,
        "sources": sources,
        "used_rag": used_rag,
    }


def get_stats() -> dict[str, Any]:
    """Get RAG pipeline statistics."""
    return {
        "initialized": _initialized,
        "total_chunks": total_docs(),
    }