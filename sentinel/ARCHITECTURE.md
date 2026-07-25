# Sentinel — Architecture

> Plain-language end-to-end explanation of how data flows through the system.  
> Written to be used verbally during a demo or viva — no need to reverse-engineer the code.

---

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Next.js)                        │
│                                                                 │
│  ┌──────────────┐   ┌─────────────────┐   ┌─────────────────┐  │
│  │  /dashboard  │   │   /telemetry    │   │     /chat       │  │
│  │  KPI Cards   │◄──│   Log Feed      │   │   RAG Chatbot   │  │
│  │  CPU/Mem     │   │   (WebSocket)   │   │  (HTTP POST)    │  │
│  │  Chart       │   └────────┬────────┘   └────────┬────────┘  │
│  └──────┬───────┘            │                     │           │
└─────────┼────────────────────┼─────────────────────┼───────────┘
          │  WebSocket         │                     │ POST /api/v1/chat
          │  /ws/dashboard     │                     │
          └────────────────────┘                     │
                     │                               │
          ┌──────────▼─────────────────────────────────────────┐
          │               BACKEND  (FastAPI :8000)              │
          │                                                     │
          │  ┌─────────────────┐   ┌──────────────────────┐    │
          │  │  WebSocket hub  │   │   RAG Chat endpoint  │    │
          │  │  Pushes stats   │   │   POST /api/v1/chat/ │    │
          │  │  + logs every   │   │                      │    │
          │  │  5 seconds      │   │  1. Embed question   │    │
          │  └────────┬────────┘   │  2. Query ChromaDB   │    │
          │           │            │  3. Build prompt      │    │
          │  ┌────────▼────────┐   │  4. Call Groq LLM    │    │
          │  │ Rolling Stats   │   │  5. Return reply +   │    │
          │  │ (in-memory)     │   │     source citations │    │
          │  │ avg CPU/mem/    │   └──────────┬───────────┘    │
          │  │ latency, errors │              │                 │
          │  └────────┬────────┘              │                 │
          │           │                       │                 │
          │  ┌────────▼───────────────────────▼───────────┐    │
          │  │         Ingestion Scheduler (APScheduler)   │    │
          │  │         Ticks every 5 seconds               │    │
          │  │                                             │    │
          │  │  ① Poll GET /logs?since=<last_ts>          │    │
          │  │  ② Poll GET /metrics                       │    │
          │  │  ③ Chunk new data into text snippets        │    │
          │  │  ④ Embed with all-MiniLM-L6-v2 (local)    │    │
          │  │  ⑤ Upsert into ChromaDB with metadata      │    │
          │  │  ⑥ Update rolling stats                     │    │
          │  └──────────────────┬──────────────────────────┘    │
          │                     │                               │
          │           ┌─────────▼──────────┐                   │
          │           │      ChromaDB       │                   │
          │           │  Persistent vector  │                   │
          │           │  store with cosine  │                   │
          │           │  similarity search  │                   │
          │           └────────────────────┘                   │
          └─────────────────────────────────────────────────────┘
                     │
          ┌──────────▼──────────────┐
          │  MOCK CONTAINER (:8001) │
          │                         │
          │  Background thread      │
          │  generates every ~1.5s: │
          │  • Log line (INFO/WARN/ │
          │    ERROR + message)     │
          │  • Metric snapshot      │
          │    (CPU/mem/latency)    │
          │    with occasional      │
          │    injected spikes      │
          │                         │
          │  GET /logs?since=<ts>   │
          │  GET /metrics           │
          └─────────────────────────┘
```

---

## Data Flow 1 — Telemetry Ingestion (Every 5 Seconds)

This is the pipeline that keeps the vector store fresh.

```
Step 1 — POLL
  Backend ingestion scheduler wakes up every 5 s.
  It calls GET http://mock-container:8001/logs?since=<last_poll_unix_ts>
  and GET http://mock-container:8001/metrics.
  The mock container returns only the new log lines since the last poll.

Step 2 — CHUNK
  Each log line becomes its own text chunk:
    "[2024-01-15T10:23:11Z] [ERROR] Database connection timeout after 342ms"
  The metric snapshot becomes a summary chunk:
    "Metrics at 2024-01-15T10:23:11Z: CPU=78.2%, Memory=61.4%, Latency=142.0ms, RPS=8.3"

Step 3 — EMBED
  All chunks are passed to sentence-transformers/all-MiniLM-L6-v2 running locally.
  This produces a 384-dimensional vector for each chunk.
  No API key needed — the model runs entirely on CPU inside the backend container.

Step 4 — UPSERT
  Each (chunk, vector, metadata) triple is upserted into ChromaDB.
  Metadata includes: timestamp, log_level, type (log/metrics), service name.
  ChromaDB persists to disk so data survives backend restarts.

Step 5 — ROLLING STATS
  The ingestion service also maintains an in-memory ring of recent
  metric snapshots (last 5 minutes). It computes:
    • avg_cpu, avg_memory, avg_latency over the window
    • error_count (ERROR log lines in the window)
    • total_docs (total entries ever ingested)
  These are stored as a shared dict that the WebSocket hub reads.
```

---

## Data Flow 2 — Live Dashboard (WebSocket Push, Every 5 Seconds)

```
Step 1 — CLIENT CONNECTS
  Browser opens WebSocket to ws://localhost:8000/ws/dashboard?token=<jwt>
  Backend validates the JWT. On failure → closes socket with 4001 code.

Step 2 — PUSH LOOP
  Every 5 seconds the backend sends a JSON frame:
  {
    "stats": {
      "avg_cpu": 42.1,
      "avg_memory": 61.3,
      "avg_latency": 98.4,
      "error_count": 3,
      "total_docs": 847,
      "last_updated": "2024-01-15T10:23:11Z"
    },
    "recent_logs": [
      { "timestamp": "...", "level": "ERROR", "message": "..." },
      ...
    ],
    "cpu_history": [ { "t": "10:23", "cpu": 78.2, "mem": 61.4 }, ... ]
  }

Step 3 — REACT UPDATE
  The frontend Zustand store absorbs the payload.
  Recharts re-renders the CPU/memory line chart.
  New log lines fade in at the bottom of the Telemetry feed.
  KPI counters animate to their new values.
```

---

## Data Flow 3 — RAG Chat Query

```
Step 1 — USER SENDS MESSAGE
  Browser POST /api/v1/chat/
  Body: { message: "What errors happened in the last 5 minutes?", history: [...] }
  Header: Authorization: Bearer <jwt>

Step 2 — EMBED THE QUERY
  Backend embeds the user's question with the same all-MiniLM-L6-v2 model.
  This produces a 384-dim vector representing the semantic meaning of the question.

Step 3 — RETRIEVE FROM CHROMADB
  The embedded query vector is used to do a cosine similarity search
  in ChromaDB against all ingested telemetry chunks.
  Top-5 most relevant chunks are returned, along with their metadata
  (timestamp, log_level, etc.).
  Recency is favored by a small time-decay weight in the metadata filter.

Step 4 — BUILD THE PROMPT
  A system prompt is constructed:
  "You are Sentinel, an AI assistant for monitoring a containerized service.
   Answer questions based ONLY on the following retrieved telemetry context.
   Always cite which log entries you're drawing from.
   
   --- CONTEXT ---
   [2024-01-15T10:21:04Z] [ERROR] Database connection timeout after 342ms
   [2024-01-15T10:21:09Z] [ERROR] Circuit breaker OPEN for service 'payment-gateway'
   [2024-01-15T10:22:11Z] [WARNING] High memory usage detected: 78%
   ...
   --- END CONTEXT ---"
  
  The user's question and conversation history are appended.

Step 5 — CALL GROQ LLM
  The full prompt is sent to Groq's API using the llama3-8b-8192 model.
  Groq provides extremely fast inference (typically < 1 second).
  The model is grounded by the context — it cannot hallucinate events
  that didn't appear in the retrieved chunks.

Step 6 — RETURN RESPONSE
  Backend returns:
  { "reply": "In the last 5 minutes, I found 2 ERROR events: ...", 
    "sources": ["log_abc123", "log_def456"] }
  
  Frontend renders the reply as markdown.
  Source citations appear as small pill chips below the message,
  making the RAG retrieval visible and explainable.
```

---

## Auth Flow

```
Register:  POST /api/v1/auth/register  { email, password }
           → bcrypt hashes password → SQLite User row created
           → Returns { access_token, token_type }

Login:     POST /api/v1/auth/login     { email, password }
           → bcrypt.verify(password, hash)
           → Returns { access_token, token_type }

Token:     JWT signed with SECRET_KEY, contains { sub: user_email, exp: now+7d }
           Stored in browser localStorage.
           Attached as Authorization: Bearer <token> on protected HTTP calls.
           Attached as ?token=<token> on WebSocket connections.
           If any protected call returns 401 → clear token → redirect to /login.
```

---

## Technology Choices — Rationale

| Choice | Why |
|---|---|
| **sentence-transformers/all-MiniLM-L6-v2** | Tiny (80 MB), fast on CPU, produces quality 384-dim embeddings, no API key |
| **ChromaDB** | Zero-config persistent vector store, pip install, great Python API |
| **Groq + LLaMA 3** | Free tier, <1 s latency, no GPU needed on the backend side |
| **APScheduler** | Integrates cleanly with FastAPI's asyncio loop for the 5-second ingest tick |
| **Framer Motion** | First-class React animation library, spring physics feel natural |
| **Zustand** | Minimal boilerplate for sharing WebSocket state across dashboard pages |
| **Recharts** | Declarative SVG charts, easy integration with React + live data |
