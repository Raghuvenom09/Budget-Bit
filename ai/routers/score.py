"""
Score Router — POST /ai/score/predict
Uses Gemini to reason about whether a dish price is fair for the Indian
market, returning a Worth-It score (0-100) with an explanation.
Falls back to a rule-based heuristic if no API key is set.
"""

import os, json, re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

API_KEY = os.getenv("GEMINI_API_KEY", "")
if API_KEY and API_KEY != "your_gemini_api_key_here":
    genai.configure(api_key=API_KEY)
    _model = genai.GenerativeModel("gemini-2.5-flash")
else:
    _model = None


class ScoreRequest(BaseModel):
    dish_name:  str
    price:      float
    cuisine:    str
    city:       str = "India"
    taste:      int = 3   # 1-5 user rating
    value:      int = 3
    portion:    int = 3


def _heuristic(req: ScoreRequest) -> dict:
    """Rule-based fallback when no API key is configured."""
    base = 92 if req.price <= 80 else 84 if req.price <= 200 else 76 if req.price <= 400 else 62
    boost = ((req.taste + req.value + req.portion) / 15 - 0.5) * 20
    score = max(0, min(100, round(base + boost)))
    label = "Excellent" if score >= 88 else "Good" if score >= 72 else "Fair" if score >= 55 else "Poor"
    return {"dish": req.dish_name, "score": score, "label": label,
            "reason": "Scored based on price tier and your ratings."}


PROMPT_TPL = """
You are a food-value analyst for the Indian restaurant market.

Dish: {dish}
Price: ₹{price}
Cuisine: {cuisine}
City: {city}
User ratings (1–5 scale): Taste={taste}, Value={value}, Portion={portion}

Give a 'Worth-It Score' from 0 to 100 considering:
- How fair the price is vs typical Indian market rates for this dish/cuisine
- The user's taste, value, and portion ratings
- Popularity and desirability of the dish

Respond ONLY with valid JSON, no markdown:
{{"score": <integer 0-100>, "label": "Excellent|Good|Fair|Poor", "reason": "<one sentence>"}}
"""


@router.post("/predict")
def predict_score(req: ScoreRequest):
    if not _model:
        return _heuristic(req)

    try:
        prompt = PROMPT_TPL.format(
            dish=req.dish_name, price=req.price, cuisine=req.cuisine,
            city=req.city, taste=req.taste, value=req.value, portion=req.portion,
        )
        response = _model.generate_content(prompt)
        raw = re.sub(r"^```(?:json)?\s*", "", response.text.strip())
        raw = re.sub(r"\s*```$", "", raw)
        data = json.loads(raw)
        data["dish"] = req.dish_name
        return data
    except json.JSONDecodeError:
        return _heuristic(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
