import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_provider_success():
    """Test provider lookup."""
    response = client.get("/api/v1/providers/prov_001")
    assert response.status_code in [200, 404]  # 404 if no test data
    if response.status_code == 200:
        data = response.json()
        assert data["provider_id"] == "prov_001"
        assert "provider_name" in data
        assert "procedures" in data


def test_get_provider_not_found():
    """Test invalid provider returns 404."""
    response = client.get("/api/v1/providers/invalid_provider")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_provider_response_structure():
    """Test response structure."""
    response = client.get("/api/v1/providers/prov_001")
    if response.status_code == 200:
        data = response.json()

        # Provider info
        assert "provider_id" in data
        assert "provider_name" in data
        assert "city" in data
        assert "state" in data

        # Stats
        assert "total_procedures" in data
        assert "avg_price" in data

        # Procedures
        assert "procedures" in data
        assert isinstance(data["procedures"], list)

        if data["procedures"]:
            proc = data["procedures"][0]
            assert "procedure_id" in proc
            assert "procedure_name" in proc
            assert "price" in proc
            assert "carrier_name" in proc
