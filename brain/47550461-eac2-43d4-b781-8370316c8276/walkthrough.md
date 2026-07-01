# Walkthrough — Mehar Cab ERP Backend + AI

## Summary of Changes

### Phase 1 — Frontend Analysis
Documented all 12 routes, 11 mock datasets with TypeScript interfaces, confirmed zero real API calls in frontend, and identified the AI chatbot component. Written to [`docs/frontend-analysis.md`](file:///C:/Users/sweta/Desktop/meher-cab-erp/docs/frontend-analysis.md).

### Phase 2 — Frontend Wiring
- **`next.config.ts`**: Added `/api/v1/*` rewrite proxy → `http://localhost:8000`
- **`.env.local`**: Added `NEXT_PUBLIC_API_URL=http://localhost:8000`
- **AI Assistant page**: Rewired from mock responses to real `POST /api/v1/chat/` calls. Added: backend status indicator (green/amber), RAG source citation chips, animated loading dots, graceful fallback when backend is offline.

### Phase 3-9 — Python FastAPI Backend

**Location:** `C:\Users\sweta\Desktop\meher-cab-erp\backend\`

**Technology Stack:**
- FastAPI 0.115+ with async SQLAlchemy + SQLite
- NVIDIA NIM client (LLaMA 3.1 8B + nv-embedqa-e5-v5)
- ChromaDB for vector storage
- Pure Python RAG chunker (no PyTorch dependency)
- pytest + pytest-asyncio for testing

**Files Created:**
```
backend/
├── app/
│   ├── main.py                    ← FastAPI app + lifespan
│   ├── core/config.py             ← pydantic-settings
│   ├── core/database.py           ← SQLAlchemy engine
│   ├── core/security.py           ← bcrypt helpers
│   ├── models/                    ← ORM: Driver, Vehicle, Trip, Notification
│   ├── schemas/                   ← Pydantic: Create/Update/Out
│   ├── repositories/              ← Async DB queries (CRUD)
│   ├── routers/                   ← REST endpoints
│   │   ├── drivers.py
│   │   ├── vehicles.py
│   │   ├── trips.py
│   │   ├── notifications.py
│   │   ├── dashboard.py           ← /stats aggregation
│   │   └── chatbot.py             ← POST /chat/
│   └── ai/
│       ├── nim/client.py          ← NVIDIA NIM async wrapper
│       ├── chatbot/service.py     ← LLM call with context
│       ├── chatbot/prompts.py     ← MeharBot system prompt
│       └── rag/
│           ├── loader.py          ← JSON → Documents
│           ├── chunker.py         ← Pure Python chunker
│           ├── embedder.py        ← NIM embedding adapter
│           ├── vectorstore.py     ← ChromaDB client
│           └── pipeline.py        ← RAG orchestrator
├── data/seed/                     ← 10 drivers, 10 vehicles, 15 trips, 10 notifications
├── scripts/
│   ├── seed_db.py                 ← Populate SQLite DB
│   └── build_vectorstore.py       ← Index ChromaDB
├── tests/
│   ├── unit/test_chatbot_prompt.py ← 3 tests — all PASS
│   └── integration/test_drivers.py
├── requirements.txt
├── pytest.ini
└── README.md
```

## Verification Results

| Check | Result |
|---|---|
| `python -c "from app.main import app"` | ✅ OK |
| `python scripts/seed_db.py` | ✅ 10 drivers, 10 vehicles, 15 trips, 10 notifications |
| `GET /health` | ✅ `{"status":"ok","env":"development"}` |
| `GET /api/v1/dashboard/stats` | ✅ Returns live DB aggregates |
| `GET /api/v1/drivers/?limit=2` | ✅ Returns Amit Kumar, Rahul Singh |
| `pytest tests/unit/` | ✅ 3/3 passed |

## How to Start the Backend

```powershell
cd C:\Users\sweta\Desktop\meher-cab-erp\backend
uvicorn app.main:app --reload --port 8000
```

Swagger UI: http://localhost:8000/api/docs

## How to Enable Real AI (requires NVIDIA API key)

1. Get free API key from [build.nvidia.com](https://build.nvidia.com)
2. Edit `backend/.env` → set `NVIDIA_API_KEY=nvapi-your-key`
3. Run `python scripts/build_vectorstore.py` to index fleet data
4. The chatbot will automatically use RAG context in all responses
