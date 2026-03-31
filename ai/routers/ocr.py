"""
OCR Router — POST /ai/ocr/scan
Uses Gemini Vision (gemini-1.5-flash) to extract dish names & prices from a
receipt photo. Falls back to a structured mock if the API key isn't set yet.
"""

import os, json, re, io
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv
from pydantic import BaseModel, Field, ValidationError, field_validator

load_dotenv()
router = APIRouter()

API_KEY = os.getenv("GEMINI_API_KEY", "")
if API_KEY and API_KEY != "your_gemini_api_key_here":
    genai.configure(api_key=API_KEY)
    _model = genai.GenerativeModel("gemini-1.5-flash")
else:
    _model = None

PROMPT = """
You are a receipt scanner. Analyze this restaurant bill image and extract every food/drink line item.

Respond ONLY with valid JSON in this exact format — no markdown, no explanation:
{
  "restaurant": "Name or null",
  "date": "YYYY-MM-DD or null",
  "items": [
    {"name": "Dish Name", "qty": 1, "price": 0}
  ],
  "total": 0,
  "confidence": 0.0
}

Rules:
- price is always a number in INR (₹), no currency symbols
- qty defaults to 1 if not shown
- confidence is 0.0–1.0 based on image clarity
- If you cannot read the bill, return the format with empty items array
"""


class OCRItem(BaseModel):
    name: str = ""
    qty: int = 1
    price: float = 0

    @field_validator("name", mode="before")
    @classmethod
    def normalize_name(cls, value):
        return str(value or "").strip()

    @field_validator("qty", mode="before")
    @classmethod
    def normalize_qty(cls, value):
        try:
            qty = int(float(value))
        except (TypeError, ValueError):
            qty = 1
        return max(qty, 1)

    @field_validator("price", mode="before")
    @classmethod
    def normalize_price(cls, value):
        try:
            price = float(value)
        except (TypeError, ValueError):
            price = 0
        return max(price, 0)


class OCRScanResult(BaseModel):
    restaurant: Optional[str] = None
    date: Optional[str] = None
    items: List[OCRItem] = Field(default_factory=list)
    total: float = 0
    confidence: float = 0

    @field_validator("restaurant", mode="before")
    @classmethod
    def normalize_restaurant(cls, value):
        if value is None:
            return None
        text = str(value).strip()
        return text or None

    @field_validator("date", mode="before")
    @classmethod
    def normalize_date(cls, value):
        if value in (None, ""):
            return None
        text = str(value).strip()
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%m/%d/%Y"):
            try:
                return datetime.strptime(text, fmt).strftime("%Y-%m-%d")
            except ValueError:
                continue
        return None

    @field_validator("total", mode="before")
    @classmethod
    def normalize_total(cls, value):
        try:
            total = float(value)
        except (TypeError, ValueError):
            total = 0
        return max(total, 0)

    @field_validator("confidence", mode="before")
    @classmethod
    def normalize_confidence(cls, value):
        try:
            conf = float(value)
        except (TypeError, ValueError):
            conf = 0
        return min(max(conf, 0), 1)


def _safe_parse_model_output(raw_text: str) -> OCRScanResult:
    raw_text = raw_text.strip()
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)
    payload = json.loads(raw_text)
    result = OCRScanResult.model_validate(payload)

    if result.total <= 0 and result.items:
        result.total = round(sum(item.price * item.qty for item in result.items), 2)

    if result.restaurant:
        normalized = result.restaurant.casefold()
        if normalized in {"null", "none", "n/a", "na", "unknown"}:
            result.restaurant = None

    return result


@router.post("/scan")
async def scan_receipt(file: UploadFile = File(...)):
    # ── No API key → return demo mock ─────────────────────────────────────────
    if not _model:
        return {
            "restaurant": "Demo Restaurant",
            "date": "2026-03-12",
            "items": [
                {"name": "Butter Chicken", "qty": 1, "price": 280},
                {"name": "Garlic Naan",    "qty": 2, "price": 120},
                {"name": "Dal Makhani",    "qty": 1, "price": 180},
                {"name": "Lassi",          "qty": 1, "price": 80},
            ],
            "total": 660,
            "confidence": 0.99,
            "_demo": True,
        }

    # ── Real Gemini Vision scan ────────────────────────────────────────────────
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))

        last_error = None
        for _ in range(2):
            try:
                response = _model.generate_content([PROMPT, img])
                raw = response.text or ""
                parsed = _safe_parse_model_output(raw)
                return parsed.model_dump()
            except (json.JSONDecodeError, ValidationError) as error:
                last_error = error

        if last_error:
            raise last_error

        raise HTTPException(status_code=422, detail="AI scan failed to produce valid receipt JSON.")

    except (json.JSONDecodeError, ValidationError):
        raise HTTPException(
            status_code=422,
            detail="AI returned invalid JSON — try a clearer photo of the bill.",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
