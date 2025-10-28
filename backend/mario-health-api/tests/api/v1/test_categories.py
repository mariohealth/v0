import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_category_families_success():
    response = client.get("/api/v1/categories/radiology/families")
    assert response.status_code == 200
    data = response.json()
    assert data["category_slug"] == "radiology"
    assert isinstance(data["families"], list)


def test_get_category_families_not_found():
    response = client.get("/api/v1/categories/invalid-slug/families")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_family_response_structure():
    response = client.get("/api/v1/categories/radiology/families")
    families = response.json()["families"]

    if families:  # If families exist
        family = families[0]
        assert "id" in family
        assert "name" in family
        assert "slug" in family
        assert "procedure_count" in family
        assert family["procedure_count"] >= 0