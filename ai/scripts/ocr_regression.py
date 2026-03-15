import argparse
import json
import os
from pathlib import Path

import requests


def scan_file(file_path: Path, base_url: str):
    with file_path.open("rb") as file_handle:
        response = requests.post(
            f"{base_url.rstrip('/')}/ai/ocr/scan",
            files={"file": (file_path.name, file_handle)},
            timeout=60,
        )
    payload = {
        "file": str(file_path),
        "status": response.status_code,
    }
    try:
        payload["response"] = response.json()
    except Exception:
        payload["response"] = response.text
    return payload


def evaluate(payload):
    if payload["status"] != 200:
        return {"ok": False, "reason": "http_error"}

    data = payload["response"]
    if not isinstance(data, dict):
        return {"ok": False, "reason": "invalid_json"}

    items = data.get("items", [])
    restaurant = data.get("restaurant")
    confidence = data.get("confidence", 0)

    if not isinstance(items, list):
        return {"ok": False, "reason": "items_not_list"}

    invalid_items = [
        item for item in items
        if not isinstance(item, dict)
        or not str(item.get("name", "")).strip()
        or float(item.get("price", 0) or 0) < 0
    ]

    if invalid_items:
        return {"ok": False, "reason": "invalid_items"}

    return {
        "ok": True,
        "items_count": len(items),
        "has_restaurant": bool(restaurant),
        "confidence": confidence,
    }


def main():
    parser = argparse.ArgumentParser(description="Quick OCR regression harness")
    parser.add_argument("folder", help="Folder containing receipt images")
    parser.add_argument("--url", default="http://localhost:8000", help="AI service base URL")
    parser.add_argument("--out", default="ocr-regression-report.json", help="Output report file")
    args = parser.parse_args()

    folder = Path(args.folder)
    if not folder.exists():
        raise SystemExit(f"Folder not found: {folder}")

    supported = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".pdf"}
    files = [path for path in folder.rglob("*") if path.suffix.lower() in supported]

    if not files:
        raise SystemExit("No receipt files found in folder.")

    results = []
    for file_path in files:
        payload = scan_file(file_path, args.url)
        verdict = evaluate(payload)
        results.append({
            **payload,
            "verdict": verdict,
        })
        print(f"[{file_path.name}] status={payload['status']} ok={verdict['ok']}")

    ok_count = sum(1 for result in results if result["verdict"].get("ok"))
    summary = {
        "total": len(results),
        "passed": ok_count,
        "failed": len(results) - ok_count,
        "pass_rate": round((ok_count / len(results)) * 100, 2),
    }

    report = {
        "summary": summary,
        "results": results,
    }

    output_path = Path(args.out)
    output_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("\nSummary:")
    print(json.dumps(summary, indent=2))
    print(f"Report written to: {output_path.resolve()}")


if __name__ == "__main__":
    main()
