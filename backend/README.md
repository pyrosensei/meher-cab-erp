# Mehar Cab ERP — Backend

FastAPI + SQLAlchemy + NVIDIA NIM + ChromaDB RAG backend for the Mehar Cab Services ERP.

## Quick Start

```powershell
# 1. Install dependencies
pip install -r requirements.txt

# 2. Copy and fill in environment variables
copy .env.example .env
# Edit .env — add your NVIDIA_API_KEY

# 3. Seed the database
python scripts/seed_db.py

# 4. (Optional) Build the RAG vector store — requires NVIDIA_API_KEY
python scripts/build_vectorstore.py

# 5. Start the server
uvicorn app.main:app --reload --port 8000
```

## API Docs
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
- Health check: http://localhost:8000/health

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/dashboard/stats | KPI aggregates |
| GET/POST/PATCH/DELETE | /api/v1/drivers/ | Driver CRUD |
| GET/POST/PATCH/DELETE | /api/v1/vehicles/ | Vehicle CRUD |
| GET/POST/PATCH/DELETE | /api/v1/trips/ | Trip CRUD |
| GET/PATCH | /api/v1/notifications/ | Notifications |
| POST | /api/v1/chat/ | AI Chatbot with RAG |

## Chatbot Request

```json
POST /api/v1/chat/
{
  "message": "Which drivers have the lowest ratings?",
  "history": []
}
```

Response:
```json
{
  "reply": "Based on your fleet data...",
  "sources": ["drivers.json"]
}
```

## Tests

```powershell
pip install -r requirements-dev.txt
pytest
```
