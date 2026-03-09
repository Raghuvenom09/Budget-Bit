"""
Recommend Router — POST /ai/recommend/dishes
Given user budget + cuisine preference, returns dish suggestions.
Phase 1: filter-based stub.
Phase 2: collaborative filtering / embedding model.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()


class RecommendRequest(BaseModel):
    budget:      float
    cuisines:    List[str] = []
    city:        str = ""


MOCK_DISHES = [
    {"dish": "Masala Dosa",    "restaurant": "South Spice Kitchen", "price": 80,  "score": 95, "cuisine": "South Indian"},
    {"dish": "Vada Pav",       "restaurant": "Mumbai Tiffin House", "price": 30,  "score": 97, "cuisine": "Street Food"},
    {"dish": "Butter Chicken", "restaurant": "Spice Garden",        "price": 280, "score": 92, "cuisine": "North Indian"},
    {"dish": "Golgappa",       "restaurant": "Chaat Corner",        "price": 40,  "score": 98, "cuisine": "Chaat & Snacks"},
    {"dish": "Chicken Biryani","restaurant": "The Biryani Co.",     "price": 350, "score": 85, "cuisine": "Hyderabadi"},
    {"dish": "Filter Coffee",  "restaurant": "South Spice Kitchen", "price": 30,  "score": 96, "cuisine": "South Indian"},
]


@router.post("/dishes")
def recommend_dishes(req: RecommendRequest):
    results = [
        d for d in MOCK_DISHES
        if d["price"] <= req.budget
        and (not req.cuisines or d["cuisine"] in req.cuisines)
    ]
    results.sort(key=lambda x: x["score"], reverse=True)
    return {"recommendations": results[:6]}
