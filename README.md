# Budget Bit

Budget Bit is an AI-powered food review platform where users upload restaurant bills, auto-extract dishes using OCR, rate meals, and get value-focused recommendations.

## Tech Stack

- Frontend: React + Vite + Tailwind + Supabase Auth/DB
- AI Service: FastAPI + Gemini (`gemini-2.5-flash`)
- Optional Legacy API: Express + MongoDB (kept for compatibility)

## Monorepo Structure

```text
Budget Bit/
├─ client/          # React app (port 5173)
├─ ai/              # FastAPI AI microservice (port 8000)
├─ server/          # Express API (port 5000 by default)
├─ supabase/        # SQL / migration assets
└─ start-all.ps1    # Launches frontend + server + ai together (Windows)
```

## Prerequisites

- Node.js 20+
- Python 3.11+ (3.12 works)
- PowerShell (Windows)
- Supabase project
- Gemini API key

## Environment Setup

### 1) Frontend env

Create `client/.env`:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 2) AI env

Create/verify `ai/.env`:

```dotenv
PORT=8000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```

### 3) Optional Express env

Create/verify `server/.env`:

```dotenv
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/budgetbit
JWT_SECRET=replace_with_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## Install Dependencies

### Frontend

```powershell
cd "d:\Budget Bit\client"
npm install
```

### Server

```powershell
cd "d:\Budget Bit\server"
npm install
```

### AI (recommended: isolated venv)

```powershell
cd "d:\Budget Bit\ai"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

## Run the Project

### One command (Windows)

```powershell
cd "d:\Budget Bit"
.\start-all.ps1
```

This opens separate terminal windows for:

- Frontend: `http://localhost:5173`
- Express API: `http://localhost:3001` (from launcher)
- AI API: `http://localhost:8000`
- AI Docs: `http://localhost:8000/docs`

### Manual run (if needed)

```powershell
# Terminal 1
cd "d:\Budget Bit\client"
npm run dev

# Terminal 2
cd "d:\Budget Bit\server"
npm run dev

# Terminal 3
cd "d:\Budget Bit\ai"
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --port 8000
```

## AI Endpoints

- `POST /ai/ocr/scan` — receipt OCR (items, restaurant, total, confidence)
- `POST /ai/score/predict` — worth-it score prediction
- `POST /ai/recommend/dishes` — personalized recommendations
- `GET /ai/health` — health check

## OCR Regression Harness

A quick batch test script is available at `ai/scripts/ocr_regression.py`.

1. Put sample receipts into a folder (jpg/png/pdf).
2. Run:

```powershell
cd "d:\Budget Bit\ai"
.\.venv\Scripts\Activate.ps1
python scripts\ocr_regression.py "d:\Budget Bit\ai\sample-receipts" --url "http://localhost:8000" --out "ocr-regression-report.json"
```

The output report includes pass/fail summary and per-file response snapshots.

## Build / Sanity Commands

### Frontend production build

```powershell
cd "d:\Budget Bit\client"
npx vite build
```

### AI compile check

```powershell
cd "d:\Budget Bit\ai"
python -m py_compile main.py routers\ocr.py routers\score.py routers\recommend.py scripts\ocr_regression.py
```

## Troubleshooting

- `Folder not found` during OCR regression: use a real local folder path, not a placeholder.
- `Scripts not on PATH` warnings: safe to ignore if using `.venv\Scripts\Activate.ps1`.
- Dependency conflicts in global Python: use the project venv to isolate packages.
- Missing Supabase vars: verify `client/.env` has both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Security Notes

- Do not commit secrets in `.env` files.
- If any API key was exposed previously, rotate it immediately.
- Keep service-role keys server-side only (never in frontend code).

---

## Production Deployment

### Quick Start with Docker

```powershell
# Clone and configure
cp client/.env.example client/.env
cp ai/.env.example ai/.env
# Edit .env files with your production values

# Build and run
docker-compose up --build
```

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| Client | 80 | React frontend (nginx) |
| AI | 8000 | FastAPI OCR/scoring service |

### Production Docker Compose

```powershell
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```powershell
kubectl apply -f k8s/deployment.yaml
```

### GitHub Actions CI/CD

The project includes automated CI/CD:

- **CI Pipeline** (`.github/workflows/ci.yml`):
  - Runs on every push/PR
  - Lints code
  - Runs tests (Vitest for React, pytest for AI)
  - Builds Docker images

- **CD Pipeline** (`.github/workflows/cd.yml`):
  - Runs on push to `main` branch
  - Builds and pushes Docker images to GitHub Container Registry
  - Configure secrets in GitHub: Settings → Secrets

### Required Secrets for Production

| Secret | Description |
|--------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `SUPABASE_ANON_KEY` | Supabase anon key (public) |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (private) |

### Running Tests

```powershell
# React client tests
cd client
npm run test

# AI service tests
cd ai
pip install -r requirements-test.txt
pytest tests/ -v
```

### Build for Production

```powershell
# Client production build
cd client
npm run build

# AI service
cd ai
pip install -r requirements.txt
gunicorn --bind 0.0.0.0:8000 --workers 2 --threads 4 main:app
```

---

## Project Structure

```
Budget Bit/
├─ client/          # React app (Vite, Tailwind, Supabase)
│   ├─ src/
│   │   ├─ components/   # UI components
│   │   ├─ context/      # React context (Auth)
│   │   ├─ lib/           # Utilities (Supabase client)
│   │   ├─ pages/         # Page components
│   │   └─ test/          # Test files
│   ├─ Dockerfile
│   └─ vitest.config.js
├─ ai/              # FastAPI AI microservice
│   ├─ routers/          # API routes (OCR, Score, Recommend)
│   ├─ tests/            # Test files
│   ├─ Dockerfile
│   └─ requirements.txt
├─ server/          # Express API (optional, legacy)
├─ supabase/        # SQL / migration assets
├─ k8s/             # Kubernetes manifests
├─ .github/         # GitHub Actions workflows
├─ docker-compose.yml
└─ README.md
```
