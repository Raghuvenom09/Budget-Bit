"""
Tests for Score router
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


class TestScoreHealth:
    def test_health_endpoint(self):
        """Test that health check works"""
        response = client.get("/ai/health")
        assert response.status_code == 200


class TestScorePredict:
    def test_predict_basic(self):
        """Test basic score prediction"""
        response = client.post("/ai/score/predict", json={
            "dish_name": "Butter Chicken",
            "price": 280,
            "cuisine": "Indian",
            "city": "Bangalore"
        })
        assert response.status_code == 200
        data = response.json()
        assert "score" in data
        assert "label" in data
        assert 0 <= data["score"] <= 100
        assert data["label"] in ["Excellent", "Good", "Fair", "Poor"]

    def test_predict_with_ratings(self):
        """Test score prediction with user ratings"""
        response = client.post("/ai/score/predict", json={
            "dish_name": "Masala Dosa",
            "price": 80,
            "cuisine": "South Indian",
            "taste": 5,
            "value": 5,
            "portion": 4
        })
        assert response.status_code == 200
        data = response.json()
        assert "score" in data

    def test_predict_validation_error(self):
        """Test validation with missing required fields"""
        response = client.post("/ai/score/predict", json={
            "dish_name": "Test"
            # Missing price and cuisine
        })
        assert response.status_code == 422

    def test_predict_negative_price(self):
        """Test that negative prices are handled"""
        response = client.post("/ai/score/predict", json={
            "dish_name": "Free Food",
            "price": -50,
            "cuisine": "Any"
        })
        assert response.status_code == 200
        data = response.json()
        assert "score" in data
