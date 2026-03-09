"""
Score Router — POST /ai/score/predict
Given dish name + price + cuisine, returns a predicted worth-it score.
Phase 1: rule-based heuristic.
Phase 2: trained ML model.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ScoreRequest(BaseModel):
    dish_name:   str
    price:       float
    cuisine:     str
    city:        str = ""


@router.post("/predict")
def predict_score(req: ScoreRequest):
    # TODO Phase 2: load trained model and predict
    # Phase 1: simple price-tier heuristic
    if req.price <= 80:
        score = 92
    elif req.price <= 200:
        score = 84
    elif req.price <= 400:
        score = 76
    else:
        score = 68

    return {
        "dish":  req.dish_name,
        "score": score,
        "label": "Excellent" if score >= 90 else "Good" if score >= 75 else "Fair",
    }
