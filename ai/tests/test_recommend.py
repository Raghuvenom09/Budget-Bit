"""
Tests for Recommend router
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


class TestRecommendHealth:
    def test_health_endpoint(self):
        """Test that health check works"""
        response = client.get("/ai/health")
        assert response.status_code == 200


class TestRecommendDishes:
    def test_recommend_basic(self):
        """Test basic recommendations"""
        response = client.post("/ai/recommend/dishes", json={
            "budget": 200,
            "city": "Bangalore"
        })
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data
        assert len(data["recommendations"]) <= 6

    def test_recommend_with_cuisines(self):
        """Test recommendations with cuisine preference"""
        response = client.post("/ai/recommend/dishes", json={
            "budget": 300,
            "cuisines": ["Indian", "Chinese"],
            "city": "Bangalore"
        })
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data

    def test_recommend_with_past_dishes(self):
        """Test recommendations avoiding past dishes"""
        response = client.post("/ai/recommend/dishes", json={
            "budget": 200,
            "past_dishes": ["Butter Chicken", "Biryani"],
            "city": "Bangalore"
        })
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data

    def test_recommend_with_dietary(self):
        """Test recommendations with dietary restriction"""
        response = client.post("/ai/recommend/dishes", json={
            "budget": 200,
            "dietary": "vegetarian",
            "city": "Bangalore"
        })
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data

    def test_recommend_validation_error(self):
        """Test validation with missing required fields"""
        response = client.post("/ai/recommend/dishes", json={
            # Missing budget
        })
        assert response.status_code == 422

    def test_recommend_empty_budget(self):
        """Test with zero budget returns empty or filtered list"""
        response = client.post("/ai/recommend/dishes", json={
            "budget": 0,
            "city": "Bangalore"
        })
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data
