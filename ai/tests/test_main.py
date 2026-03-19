"""
Tests for main app configuration
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


class TestMainApp:
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        # Should return 404 since we only have /ai/* routes
        assert response.status_code == 404

    def test_cors_headers(self):
        """Test CORS headers are set"""
        response = client.options(
            "/ai/health",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET",
            }
        )
        # FastAPI handles OPTIONS automatically with CORSMiddleware

    def test_invalid_json(self):
        """Test handling of invalid JSON"""
        response = client.post(
            "/ai/score/predict",
            content="not valid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422
