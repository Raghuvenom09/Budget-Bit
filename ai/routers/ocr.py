"""
OCR Router — POST /ai/ocr/scan
Accepts a receipt image (multipart), returns extracted line items.
Phase 1: stub returning mock data.
Phase 2: swap in Tesseract / Google Vision.
"""

from fastapi import APIRouter, UploadFile, File

router = APIRouter()


@router.post("/scan")
async def scan_receipt(file: UploadFile = File(...)):
    # TODO Phase 2: pass image bytes to Tesseract / Google Vision API
    # For now return structured mock so the frontend can be wired up
    return {
        "restaurant": "Detected Restaurant Name",
        "date": "2026-03-03",
        "items": [
            {"name": "Butter Chicken", "qty": 1, "price": 280},
            {"name": "Garlic Naan",    "qty": 2, "price": 120},
            {"name": "Dal Makhani",    "qty": 1, "price": 180},
        ],
        "total": 580,
        "confidence": 0.91,
    }
