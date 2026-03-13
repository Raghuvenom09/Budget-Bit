"""
OCR Router — POST /ai/ocr/scan
Uses Gemini Vision (gemini-1.5-flash) to extract dish names & prices from a
receipt photo. Falls back to a structured mock if the API key isn't set yet.
"""

import os, json, re, io
from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
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

        response = _model.generate_content([PROMPT, img])
        raw = response.text.strip()

        # Strip markdown code fences if Gemini wraps the JSON
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        data = json.loads(raw)

        # Auto-fill total if missing
        if not data.get("total") and data.get("items"):
            data["total"] = sum(
                i.get("price", 0) * i.get("qty", 1) for i in data["items"]
            )

        return data

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=422,
            detail="AI returned invalid JSON — try a clearer photo of the bill.",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
