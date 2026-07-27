# Sentinel — Setup & Run Guide

## Prerequisites

- **Docker Desktop** installed and running (you just installed it)
- **Node.js v20+** (for the frontend)
- **NVIDIA API key** — free at https://build.nvidia.com (click "Get API Key", sign up, copy the key)

---

## Step 1: Set your NVIDIA API key

Create `sentinel/.env` (or edit `sentinel/backend/.env`):

```bash
# From the sentinel/ directory
echo "NVIDIA_API_KEY=nvapi-your-actual-key-here" > .env
```

> Replace `nvapi-your-actual-key-here` with the key you copied from build.nvidia.com.
> The `docker-compose.yml` reads `NVIDIA_API_KEY` from this `.env` file automatically.

---

## Step 2: Start the backend services

```bash
cd sentinel
docker compose up --build
```

This starts two containers:
| Container | Port | Purpose |
|---|---|---|
| `sentinel-mock` | 8001 | Emits synthetic logs & metrics every 1.5s |
| `sentinel-backend` | 8000 | FastAPI with auth, RAG, WebSocket, ingestion |

**Wait ~30 seconds** for both healthchecks to pass. Watch the logs — you should see:
- `sentinel-mock` → `GET /health 200` every 10s
- `sentinel-backend` → `Application startup complete` and then `GET /health 200`

---

## Step 3: Verify the backend is healthy

Open a **new terminal** (keep Docker running) and run:

```bash
# Health endpoint
curl http://localhost:8000/health
```

Expected response:
```json
{"status":"healthy","timestamp":"..."}
```

---

## Step 4: Wait for data ingestion

The backend polls the mock container every 5s and stores telemetry in ChromaDB. Wait **~30 seconds** after startup so there's data to query.

Check how many documents are ingested:

```bash
curl http://localhost:8000/api/v1/debug/stats
```

Expected:
```json
{"total_docs":12,"rolling_stats":{"cpu_usage":45.2,"memory_percent":62.8,...}}
```

> If `total_docs` is 0, wait a bit longer and try again.

---

## Step 5: Register a user

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

Expected:
```json
{"id":1,"username":"admin","created_at":"..."}
```

---

## Step 6: Login to get a JWT token

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

Save the token from the response:
```json
{"access_token":"eyJ...","token_type":"bearer"}
```

Set it as a variable for the next steps (copy your actual token):

```bash
set TOKEN=eyJ...   # Windows CMD
# OR
$TOKEN="eyJ..."    # PowerShell
```

---

## Step 7: Chat with the AI assistant

```powershell
curl -X POST http://localhost:8000/api/v1/chat/ `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d '{\"message\": \"Summarize recent system activity\"}'
```

Tweak the quotes for your shell as needed. If the NVIDIA key is valid and Chroma has data, you'll get a grounded answer with `sources`.

Try other questions:
- "What errors happened in the last 5 minutes?"
- "What is the average CPU usage?"
- "Are there any warnings I should know about?"

---

## Step 8: Start the frontend (separate terminal)

```bash
cd sentinel/frontend
npm install   # if you haven't already
npm run dev
```

Open **http://localhost:3000** in your browser.

1. Login with `admin` / `password123`
2. You should see the **Overview** dashboard with live KPIs
3. Click **Telemetry** — live logs streaming via WebSocket
4. Click **Intelligence** — chat with the RAG assistant

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `docker compose` not found | Open Docker Desktop, wait for it to start, then retry |
| `NVIDIA_API_KEY` not set | Create `sentinel/.env` with the key, then `docker compose down && docker compose up --build` |
| Backend healthcheck failing | Check `docker logs sentinel-mock` — is it running on 8001? |
| `total_docs` stays 0 | Wait 30s+; ingestion runs every 5s. Check `docker logs sentinel-backend` for errors |
| Chat returns "no context" | Wait for more ingestion ticks, or ask a more specific question |
| Frontend can't connect | Backend must be on localhost:8000. Check `docker ps` |
| Port 8000 already in use | Stop whatever is on :8000, or change the port mapping in docker-compose.yml |

---

## Shutting down

```bash
# Stop containers (keep data volumes)
docker compose down

# Stop + delete volumes (wipes ChromaDB and SQLite)
docker compose down -v
```
