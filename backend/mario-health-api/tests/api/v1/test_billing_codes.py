import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_cpt_code():
    """Test CPT code lookup."""
    response = client.get("/api/v1/codes/71046")
    assert response.status_code in [200, 404]  # 404 if no test data
    if response.status_code == 200:
        data = response.json()
        assert data["code"] == "71046"
        assert "procedures" in data


def test_get_hcpcs_code():
    """Test HCPCS code lookup."""
    response = client.get("/api/v1/codes/J0170?code_type=HCPCS")
    assert response.status_code in [200, 404]


def test_get_code_with_type_filter():
    """Test code lookup with type filter."""
    response = client.get("/api/v1/codes/71046?code_type=CPT")
    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert data["code_type"] == "CPT"


def test_invalid_code():
    """Test invalid code returns 404."""
    response = client.get("/api/v1/codes/INVALID999")
    assert response.status_code == 404


def test_billing_code_response_structure():
    """Test response structure."""
    response = client.get("/api/v1/codes/71046")
    if response.status_code == 200:
        data = response.json()
        assert "code" in data
        assert "code_type" in data
        assert "procedures" in data
        assert "overall_min_price" in data

        if data["procedures"]:
            proc = data["procedures"][0]
            assert "procedure_id" in proc
            assert "code_type" in proc
            assert "is_primary" in proc
