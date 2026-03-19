"""
Tests for OCR router
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


class TestOCRHealth:
    def test_health_endpoint(self):
        """Test that health check works"""
        response = client.get("/ai/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "service" in data


class TestOCRScan:
    def test_scan_without_file(self):
        """Test scan endpoint without file returns 422"""
        response = client.post("/ai/ocr/scan")
        assert response.status_code == 422

    def test_scan_demo_mode(self):
        """Test scan in demo mode (no API key) returns mock data"""
        with patch("routers.ocr._model", None):
            with open("tests/fixtures/sample_receipt.jpg", "rb") as f:
                response = client.post(
                    "/ai/ocr/scan",
                    files={"file": ("test.jpg", f, "image/jpeg")}
                )
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert data.get("_demo") == True


class TestOCRValidation:
    def test_empty_file(self):
        """Test with empty file"""
        response = client.post(
            "/ai/ocr/scan",
            files={"file": ("empty.jpg", b"", "image/jpeg")}
        )
        # Should handle gracefully (either 422 or return demo data)
        assert response.status_code in [200, 422]
