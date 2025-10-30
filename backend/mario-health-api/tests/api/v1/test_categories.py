import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# New test for GET /api/categories
def test_get_all_categories():
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert "categories" in data
    assert isinstance(data["categories"], list)


def test_category_response_structure():
    response = client.get("/api/v1/categories")
    categories = response.json()["categories"]

    if categories:  # If categories exist
        category = categories[0]
        assert "id" in category
        assert "name" in category
        assert "slug" in category
        assert "family_count" in category
        assert category["family_count"] >= 0


# Existing tests
def test_get_category_families_success():
    response = client.get("/api/v1/categories/imaging/families")
    assert response.status_code == 200
    data = response.json()
    assert data["category_slug"] == "imaging"
    assert isinstance(data["families"], list)


def test_get_category_families_not_found():
    response = client.get("/api/v1/categories/invalid-slug/families")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()