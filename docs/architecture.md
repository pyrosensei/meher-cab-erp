# Architecture — Mehar Cab ERP

## 1. Frontend-Backend Split & Proxy

The Next.js frontend and FastAPI backend run as separate processes on different ports:

- **Frontend:** `http://localhost:3000` (Next.js dev server)
- **Backend:** `http://localhost:8000` (Uvicorn/FastAPI)

To avoid CORS issues in development, `next.config.ts` registers a rewrite rule that transparently forwards all `/api/v1/*` requests from the browser to the backend:

```
Browser → localhost:3000/api/v1/drivers/ → [Next.js proxy] → localhost:8000/api/v1/drivers/
```

This means the frontend code always calls `/api/v1/...` without ever knowing the backend port.

## 2. RAG Pipeline Flow

```
User Query
    │
    ▼
[Embed with NIM nvidia/nv-embedqa-e5-v5]
    │
    ▼
[ChromaDB cosine similarity search]
    │    ← Searches indexed ERP seed data (drivers, vehicles, trips, notifications)
    ▼
[Top-5 relevant document chunks retrieved]
    │
    ▼
[Injected into system prompt as context]
    │
    ▼
[LLaMA 3.1 8B via NVIDIA NIM]
    │
    ▼
[Response + source citations returned to frontend]
```

If the NIM API is unavailable, the chatbot gracefully degrades: RAG context is skipped (empty string), and the LLM call still proceeds. If both fail, a friendly error message is returned rather than crashing the server.

## 3. Database Schema

SQLite (local) / PostgreSQL-compatible (production). One table per domain entity:

| Table | Key Fields |
|---|---|
| `drivers` | `driver_id`, `name`, `phone`, `status`, `rating`, `total_trips` |
| `vehicles` | `vehicle_id`, `registration_number`, `make`, `model`, `status`, `health_score` |
| `trips` | `trip_id`, `driver_id`, `vehicle_id`, `status`, `fare`, `distance`, `duration` |
| `notifications` | `notification_id`, `title`, `type`, `priority`, `read` |

Tables are created on startup via `Base.metadata.create_all` in `app/core/database.py`.

## 4. Adding a New Domain Entity (4-File Pattern)

To add a new entity (e.g., `Customer`):

1. **`app/models/customer.py`** — SQLAlchemy ORM model, inherits `Base`
2. **`app/schemas/customer.py`** — Pydantic `CustomerBase`, `CustomerCreate`, `CustomerUpdate`, `CustomerOut`
3. **`app/repositories/customer_repo.py`** — `CustomerRepository` class with async CRUD methods
4. **`app/routers/customers.py`** — FastAPI `APIRouter` with GET/POST/PATCH/DELETE endpoints

Then:
- Import the model in `app/models/__init__.py`
- Register the router in `app/main.py`
- Add seed data in `data/seed/customers.json`
- Update `scripts/seed_db.py` to seed customers
