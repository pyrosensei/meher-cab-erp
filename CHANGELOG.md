# CHANGELOG

## [1.0.0] — 2026-06-29

### Phase 1: Frontend Analysis
Read all frontend source files (pages, components, data, hooks, lib). Documented every route, every mock dataset with its TypeScript interface, confirmed zero real API calls exist anywhere in the codebase, identified the chatbot component and its state management. Findings written to `docs/frontend-analysis.md`.

### Phase 2: Frontend Wiring
Updated `next.config.ts` to add an `/api/v1/*` rewrite proxy pointing to `http://localhost:8000`. Created `.env.local` with `NEXT_PUBLIC_API_URL`. Rewrote `src/app/dashboard/ai-assistant/page.tsx` to call `POST /api/v1/chat/` instead of using hardcoded keyword-matched responses. Added backend status indicator, RAG source citation chips, animated loading dots, and graceful fallback when backend is offline.

### Phase 3-9: Backend Infrastructure
Created complete Python FastAPI backend at `backend/`. Implemented SQLAlchemy ORM models for Driver, Vehicle, Trip, and Notification. Repository pattern used for all DB queries. REST routers for `/api/v1/drivers/`, `/api/v1/vehicles/`, `/api/v1/trips/`, `/api/v1/notifications/`, `/api/v1/dashboard/stats`, and `/api/v1/chat/`. NVIDIA NIM client wraps LLaMA 3.1 8B for chat completions and nv-embedqa-e5-v5 for embeddings. RAG pipeline uses ChromaDB with cosine similarity search on JSON seed data converted to LangChain Documents. Seed data JSON files created for all entities. `scripts/seed_db.py` populates SQLite DB. `scripts/build_vectorstore.py` indexes seed data into ChromaDB. Unit and integration tests written with pytest-asyncio.
