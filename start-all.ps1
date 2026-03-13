# ╔══════════════════════════════════════════════════════╗
# ║        Budget Bit — Start All Services               ║
# ║  Run this from d:\Budget Bit  with:                  ║
# ║      .\start-all.ps1                                 ║
# ╚══════════════════════════════════════════════════════╝

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "Budget Bit - Start All Services" -ForegroundColor Cyan
Write-Host ""

# ── 1. Frontend (Vite React) ─────────────────────────────────────────────────
Write-Host "Starting Frontend  ->  http://localhost:5173" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command",
"cd '$root\client'; Write-Host 'FRONTEND - Vite Dev Server' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 1

# 2. Backend (Express / Node)
Write-Host "Starting Backend   ->  http://localhost:3001" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command",
"cd '$root\server'; Write-Host 'BACKEND - Express Server' -ForegroundColor Yellow; npm run dev"

Start-Sleep -Seconds 1

# 3. AI Microservice (FastAPI / Python)
Write-Host "Starting AI Server ->  http://localhost:8000" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command",
"cd '$root\ai'; Write-Host 'AI - FastAPI Gemini Service' -ForegroundColor Magenta; python -m uvicorn main:app --reload --port 8000"

Write-Host ""
Write-Host "All 3 services launched in separate windows." -ForegroundColor White
Write-Host ""
Write-Host "  Frontend   ->  http://localhost:5173" -ForegroundColor Green
Write-Host "  Backend    ->  http://localhost:3001" -ForegroundColor Yellow
Write-Host "  AI Service ->  http://localhost:8000" -ForegroundColor Magenta
Write-Host "  AI Docs    ->  http://localhost:8000/docs" -ForegroundColor Magenta
Write-Host ""
