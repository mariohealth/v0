import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_family_procedures_success():
    response = client.get("/api/v1/families/x-ray/procedures")
    assert response.status_code == 200
    data = response.json()
    assert data["family_slug"] == "x-ray"
    assert "family_name" in data
    assert isinstance(data["procedures"], list)


def test_get_family_procedures_not_found():
    response = client.get("/api/v1/families/invalid-slug/procedures")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_procedure_response_structure():
    response = client.get("/api/v1/families/x-ray/procedures")
    procedures = response.json()["procedures"]

    if procedures:
        procedure = procedures[0]
        assert "id" in procedure
        assert "name" in procedure
        assert "price_count" in procedure
        # Optional fields
        if procedure.get("min_price"):
            assert procedure.get("max_price")
            assert procedure.get("avg_price")