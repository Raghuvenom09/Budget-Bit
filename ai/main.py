"""
Budget Bit — AI Microservice
Stack: FastAPI + Uvicorn
Responsibilities:
  1. Receipt OCR   — extract dishes & prices from bill image
  2. Score Engine  — predict worth-it score for a dish
  3. Recommender   — suggest dishes/restaurants for a user budget
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ocr, score, recommend

app = FastAPI(title="BudgetBit AI", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr.router,       prefix="/ai/ocr",       tags=["OCR"])
app.include_router(score.router,     prefix="/ai/score",     tags=["Score"])
app.include_router(recommend.router, prefix="/ai/recommend", tags=["Recommend"])


@app.get("/ai/health")
def health():
    return {"status": "ok", "service": "BudgetBit AI"}
