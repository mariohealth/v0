import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_procedure_detail_success():
    response = client.get("/api/v1/procedures/chest-x-ray-2-views")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "chest-x-ray-2-views"
    assert "name" in data
    assert "family_slug" in data
    assert "category_slug" in data


def test_get_procedure_detail_not_found():
    response = client.get("/api/v1/procedures/invalid-procedure-slug")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_procedure_detail_structure():
    response = client.get("/api/v1/procedures/chest-x-ray-2-views")
    data = response.json()

    # Required fields
    assert "id" in data
    assert "name" in data
    assert "slug" in data
    assert "family_id" in data
    assert "family_name" in data
    assert "category_id" in data
    assert "category_name" in data

    # Pricing fields (may be null)
    assert "min_price" in data
    assert "carrier_prices" in data
    assert isinstance(data["carrier_prices"], list)


def test_carrier_prices_structure():
    response = client.get("/api/v1/procedures/chest-x-ray-2-views")
    prices = response.json()["carrier_prices"]

    if prices:  # If carrier prices exist
        price = prices[0]
        assert "carrier_id" in price
        assert "carrier_name" in price
        assert "price" in price
        assert "currency" in price
