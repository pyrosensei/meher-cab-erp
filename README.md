
<h1 align="center">🚕 Meher Cab ERP</h1>
<p align="center">
  <em>A next‑generation fleet management & operations platform for Meher Cab Services, Delhi NCR</em>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square" alt="Next.js 16"></a>
  <a href="#"><img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square" alt="FastAPI"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square" alt="Python 3.12"></a>
  <a href="#"><img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square" alt="SQLite"></a>
  <a href="#"><img src="https://img.shields.io/badge/RAG-Powered-FF6F00?style=flat-square" alt="RAG"></a>
  <a href="#"><img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square" alt="Docker Compose"></a>
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square" alt="License"></a>
</p>

---

## ✨ Features

| Module | Highlights |
|---|---|
| **Live Fleet Tracking** | Real‑time GPS pings every 3 s, Leaflet heatmap, driver‑vehicle mapping |
| **Driver Management** | 30+ driver profiles, verification docs, earnings & completion analytics |
| **Vehicle Health** | Health scores, fuel levels, service scheduling, insurance & fitness tracking |
| **Trip Management** | 300+ historical trips, live trip simulation, status lifecycle |
| **AI Chatbot** | RAG‑powered assistant with NVIDIA NIM (LLaMA 3.1 8B + ChromaDB) |
| **Analytics Dashboard** | Revenue trends, fleet utilisation, driver performance charts (Recharts) |
| **Notifications** | Real‑time alert centre with priority and type filtering |
| **Sentinel Monitoring** | Synthetic telemetry generator + intelligent log ingestion pipeline |
| **Dark Mode** | Full theme switching with next‑themes |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (React 19), TypeScript, Tailwind CSS 4, Framer Motion |
| **State / Data** | TanStack React Query, Zustand, React Table |
| **Charts** | Recharts |
| **Maps** | Leaflet + react‑leaflet |
| **Forms** | react‑hook‑form, Zod |
| **Backend** | FastAPI (Python 3.12), Uvicorn |
| **Database** | SQLite (dev) / PostgreSQL (prod), SQLAlchemy (async) |
| **AI / RAG** | NVIDIA NIM (LLaMA 3.1 8B), ChromaDB, nv‑embedqa‑e5‑v5 |
| **Auth** | JWT (PyJWT + python‑jose) |
| **Infra** | Docker Compose, Next.js rewrite proxy |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────┐
│                   Browser                    │
│         localhost:3000 (Next.js)             │
└──────────────┬──────────────────────────────┘
               │  /api/v1/*  (rewrite proxy)
               ▼
┌──────────────────────────────────────────────┐
│        FastAPI Backend  :8000                 │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Routers  │  │ RAG      │  │ Sentinel   │ │
│  │ (CRUD)   │  │ Pipeline │  │ Ingestion  │ │
│  └────┬─────┘  └────┬─────┘  └─────┬──────┘ │
│       │              │              │         │
│  ┌────▼──────────────▼──────────────▼──────┐ │
│  │           SQLAlchemy ORM                 │ │
│  │  Drivers · Vehicles · Trips · Notes      │ │
│  └────────────────┬────────────────────────┘ │
└───────────────────┼──────────────────────────┘
                    │
          ┌─────────▼─────────┐
          │   SQLite / PG     │
          │   ChromaDB (vec)  │
          └───────────────────┘
                    ▲
          ┌─────────┴─────────┐
          │  Docker Compose   │
          │  (sentinel infra) │
          └───────────────────┘
```

### AI RAG Pipeline

```
User Query
    │
    ▼
[nv-embedqa-e5-v5] → [ChromaDB cosine search] → [Top‑5 chunks]
    │
    ▼
[LLaMA 3.1 8B via NVIDIA NIM] → [Response + citations]
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (or Bun)
- **Python** 3.12+
- **Docker Desktop** (for Sentinel services)

### Local Development (no Docker)

```bash
# 1. Frontend
npm install
npm run dev            # → http://localhost:3000

# 2. Backend (separate terminal)
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000   # → http://localhost:8000
```

### Full Stack with Docker

```bash
# Start Sentinel services (mock telemetry + FastAPI backend + ChromaDB)
docker compose -f sentinel/docker-compose.yml up --build

# In another terminal, run the frontend
npm run dev
```

### Seed the Database

```bash
cd backend
python scripts/seed_db.py
```

---

## 📁 Project Structure

```
meher-cab-erp/
├── src/                          # Next.js frontend
│   ├── app/                      # App Router pages
│   │   ├── dashboard/
│   │   │   ├── analytics/        # Charts, KPIs
│   │   │   ├── drivers/          # Driver management
│   │   │   ├── tracking/         # Live GPS map
│   │   │   ├── trips/            # Trip history
│   │   │   ├── vehicles/         # Vehicle fleet
│   │   │   ├── notifications/    # Alert centre
│   │   │   ├── ai-assistant/     # RAG chatbot
│   │   │   ├── reports/          # Exportable reports
│   │   │   ├── profile/          # User settings
│   │   │   └── settings/         # Admin config
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/               # Shared UI components
│   │   ├── ui/                   # Radix-based design system
│   │   ├── layout/               # Sidebar, navbar, shell
│   │   ├── shared/               # Reusable app components
│   │   └── auth/                 # Login, signup
│   ├── data/                     # Static seed data
│   │   ├── drivers.ts
│   │   ├── vehicles.ts
│   │   ├── trips.ts
│   │   ├── notifications.ts
│   │   ├── analytics.ts
│   │   └── ai-responses.ts
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-utils.ts
│   │   ├── useLiveTracking.ts
│   │   ├── useLiveKPIs.ts
│   │   └── useLiveTrips.ts
│   └── lib/                      # Utilities & store
│       ├── utils.ts
│       ├── store.ts              # Zustand global store
│       ├── animations.ts
│       └── login-content.ts
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── core/                 # Config, database, security
│   │   ├── models/               # SQLAlchemy ORM models
│   │   ├── schemas/              # Pydantic request/response
│   │   ├── repositories/         # Async CRUD layer
│   │   └── routers/              # REST endpoints
│   ├── scripts/                  # seed_db.py, etc.
│   ├── tests/
│   └── requirements.txt
├── sentinel/                     # Monitoring infrastructure
│   ├── docker-compose.yml        # Orchestrates mock + backend
│   ├── mock-container/           # Synthetic log/metric generator
│   └── backend/                  # Sentinel-specific FastAPI code
├── docs/
│   ├── architecture.md
│   └── frontend-analysis.md
├── brain/                        # ChromaDB persist (gitignored)
├── public/                       # Static assets
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📊 Dashboards at a Glance

| Route | Description |
|---|---|
| `/dashboard` | KPI cards, revenue chart, fleet map, recent trips |
| `/dashboard/analytics` | Deep revenue & utilisation trends |
| `/dashboard/tracking` | Live GPS fleet map with vehicle popups |
| `/dashboard/drivers` | Driver table, ratings, earnings |
| `/dashboard/vehicles` | Fleet health, service status |
| `/dashboard/trips` | Trip history with filters |
| `/dashboard/ai-assistant` | Natural‑language ERP query bot |

---

## 🔧 Configuration

| Variable | Default | Required |
|---|---|---|
| `NVIDIA_API_KEY` | — | Yes (for AI assistant) |
| `NVIDIA_MODEL` | `meta/llama-3.1-8b-instruct` | No |
| `DATABASE_URL` | `sqlite+aiosqlite:///./meher_erp.db` | No |
| `SECRET_KEY` | `dev-secret` | Change in production |
| `JWT_ALGORITHM` | `HS256` | No |

Copy `.env.example` → `.env` in both the root and `backend/` directories.

---

## 🧪 Running Tests

```bash
# Backend
cd backend && pytest

# Frontend (when configured)
cd .. && npm run lint
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit with conventional commits (`feat:`, `fix:`, `chore:`)
4. Open a Pull Request

---

<p align="center">
  Built with ❤️ for Meher Cab Services · Delhi NCR<br>
  <sub>Powered by Next.js 16 · FastAPI · NVIDIA NIM · Docker</sub>
</p>
