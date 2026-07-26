# Sentinel — Real-Time RAG Assistant

> A demo-ready full-stack system that ingests live telemetry from a running container and lets you ask natural-language questions about it through a RAG-powered chatbot, with a live WebSocket dashboard alongside.

---

## What It Does

| Layer | Role |
|---|---|
| **Mock Container** | Emits synthetic logs (INFO / WARNING / ERROR) + metrics (CPU, memory, latency) every ~1.5 s |
| **Ingestion Service** | Polls the container every 5 s, chunks + embeds new data with `sentence-transformers`, upserts into ChromaDB |
| **RAG Chat** | On each user message: embeds the query → retrieves top-5 chunks → builds a grounded prompt → calls **NVIDIA NIM LLM** → returns answer + source citations |
| **WebSocket Dashboard** | Pushes the latest stats + log feed to the browser every 5 s |
| **Next.js Frontend** | Live KPI cards, auto-scrolling log feed, and the chat interface — all with Framer Motion animations |

---

## Quick Start

### Prerequisites

| Tool | Min version |
|---|---|
| Docker + Docker Compose | 24+ |
| Node.js | 18+ |
| Python | 3.11+ (for local backend dev only) |

### 1 — Get a free NVIDIA API key

1. Go to **<https://build.nvidia.com>** and sign up (free)
2. Click **API Keys → Create API Key**
3. Copy the key — you'll need it in step 2

### 2 — Configure environment

```bash
# In the project root
cp .env.example .env
```

Open `.env` and set:

```
NVIDIA_API_KEY=nvapi_your_key_here
```

### 3 — Start mock container + backend

```bash
docker compose up --build
```

Wait for both health checks to pass (you'll see `sentinel-backend | INFO: Application startup complete`).

### 4 — Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **<http://localhost:3000>**

### 5 — Register & explore

1. Go to `/login` → click **Create account** → register with any email + password
2. You're redirected to `/dashboard` — KPI cards start populating within ~10 s
3. Go to **Telemetry** to see the live log feed scrolling in real time
4. Go to **Chat** and try one of the suggested prompts:
   - *"What errors happened in the last 5 minutes?"*
   - *"Summarize recent system activity"*
   - *"What is the average CPU usage?"*
   - *"Are there any warnings I should know about?"*

---

## Without Docker (local dev)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env          # fill in NVIDIA_API_KEY
uvicorn app.main:app --reload --port 8000
```

### Mock Container

```bash
cd mock-container
pip install -r requirements.txt
uvicorn main:app --port 8001 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
sentinel/
├── docker-compose.yml
├── .env.example
├── README.md
├── ARCHITECTURE.md
│
├── mock-container/          # Synthetic telemetry generator
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── backend/                 # FastAPI — auth, ingestion, RAG, WebSocket
│   ├── app/
│   │   ├── main.py          # App factory + scheduler startup
│   │   ├── core/            # Config, DB, JWT/bcrypt security
│   │   ├── models/          # SQLAlchemy ORM (User)
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── routers/         # auth, chat, health, websocket
│   │   ├── services/        # ingestion, rag, telemetry_client
│   │   └── vectorstore/     # ChromaDB wrapper
│   ├── requirements.txt
│   └── Dockerfile
│
└── frontend/                # Next.js 15 + TypeScript + Tailwind v4
    └── src/
        ├── app/             # App Router pages
        ├── components/      # UI, layout, dashboard, telemetry, chat
        ├── lib/             # Zustand store, auth utilities, cn()
        └── hooks/           # useWebSocket, useAnimatedCounter
```

---

## Environment Variables

| Variable | Service | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | backend | *(required)* | Groq LLM key |
| `SECRET_KEY` | backend | dev placeholder | JWT signing secret |
| `MOCK_CONTAINER_URL` | backend | `http://localhost:8001` | Telemetry service URL |
| `DATABASE_URL` | backend | SQLite local | SQLAlchemy DB URL |
| `CHROMA_PATH` | backend | `./chroma_db` | ChromaDB persist directory |
| `INGEST_INTERVAL_SECONDS` | backend | `5` | Ingestion cadence |
| `RAG_TOP_K` | backend | `5` | Retrieved chunks per query |
| `GROQ_MODEL` | backend | `llama3-8b-8192` | Groq model ID |
| `LOG_INTERVAL_SECONDS` | mock-container | `1.5` | Log generation cadence |

---

## Architecture

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the full end-to-end data flow diagram and plain-language explanation — useful for demos and interviews.
