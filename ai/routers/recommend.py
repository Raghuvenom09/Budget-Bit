"""
Recommend Router — POST /ai/recommend/dishes
Uses Gemini to generate personalised dish recommendations within the user's
budget, considering cuisine preferences and past orders.
Falls back to a curated static list if no API key is set.
"""

import os, json, re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
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


class RecommendRequest(BaseModel):
    budget:      float
    cuisines:    List[str] = []
    city:        str = "Bangalore"
    past_dishes: List[str] = []       # dishes user has ordered before
    dietary:     Optional[str] = None  # "vegetarian", "vegan", etc.


FALLBACK = [
    {"dish": "Masala Dosa",    "restaurant": "South Spice Kitchen", "price": 80,  "score": 95, "cuisine": "South Indian", "reason": "Iconic, filling, and unbeatable value"},
    {"dish": "Vada Pav",       "restaurant": "Mumbai Tiffin House", "price": 30,  "score": 97, "cuisine": "Street Food",  "reason": "Best street-food value in India"},
    {"dish": "Butter Chicken", "restaurant": "Spice Garden",        "price": 280, "score": 88, "cuisine": "North Indian", "reason": "Rich, satisfying, and widely loved"},
    {"dish": "Golgappa",       "restaurant": "Chaat Corner",        "price": 40,  "score": 98, "cuisine": "Chaat",        "reason": "Maximum flavour per rupee"},
    {"dish": "Chicken Biryani","restaurant": "The Biryani Co.",     "price": 350, "score": 85, "cuisine": "Hyderabadi",   "reason": "Complete meal with excellent portion size"},
    {"dish": "Filter Coffee",  "restaurant": "South Spice Kitchen", "price": 30,  "score": 96, "cuisine": "South Indian", "reason": "Authentic, aromatic, and unbeatable price"},
]


PROMPT_TPL = """
You are a smart food advisor for Indian restaurant-goers.

User profile:
- Budget per dish: ₹{budget}
- City: {city}
- Preferred cuisines: {cuisines}
- Past dishes ordered: {past_dishes}
- Dietary preference: {dietary}

Suggest exactly 6 dish recommendations that:
1. Cost ≤ ₹{budget} each
2. Are popular and widely available in {city}
3. Offer the best value for money (high Worth-It score)
4. Respect the dietary preference if specified
5. Introduce variety — avoid repeating past dishes unless truly best value

Respond ONLY with valid JSON, no markdown:
{{"recommendations": [
  {{"dish": "Name", "restaurant": "Type of restaurant", "price": 0, "score": 0, "cuisine": "Cuisine", "reason": "One sentence why it's worth it"}}
]}}

score is 0–100 where 100 = best value in India.
"""


@router.post("/dishes")
def recommend_dishes(req: RecommendRequest):
    if not _model:
        results = [d for d in FALLBACK if d["price"] <= req.budget
                   and (not req.cuisines or d["cuisine"] in req.cuisines)]
        return {"recommendations": sorted(results, key=lambda x: x["score"], reverse=True)[:6]}

    try:
        prompt = PROMPT_TPL.format(
            budget=req.budget,
            city=req.city,
            cuisines=", ".join(req.cuisines) if req.cuisines else "Any",
            past_dishes=", ".join(req.past_dishes) if req.past_dishes else "None",
            dietary=req.dietary or "None",
        )
        response = _model.generate_content(prompt)
        raw = re.sub(r"^```(?:json)?\s*", "", response.text.strip())
        raw = re.sub(r"\s*```$", "", raw)
        return json.loads(raw)
    except json.JSONDecodeError:
        results = [d for d in FALLBACK if d["price"] <= req.budget]
        return {"recommendations": results[:6]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
