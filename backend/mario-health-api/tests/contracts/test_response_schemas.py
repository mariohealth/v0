"""Contract tests for API response schemas."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestResponseSchemas:
    """Validate API response schemas."""

    def test_search_response_schema(self):
        """Validate search endpoint response schema."""
        response = client.get("/api/v1/search?q=chest")
        data = response.json()

        # Required fields
        assert "query" in data
        assert "results" in data
        assert "total_results" in data

        # Results structure
        if len(data["results"]) > 0:
            result = data["results"][0]
            required_fields = [
                "procedure_id",
                "procedure_name",
                "procedure_slug",
                "family_name",
                "category_name",
                "best_price"
            ]
            for field in required_fields:
                assert field in result, f"Missing field: {field}"

    def test_procedure_detail_schema(self):
        """Validate procedure detail response schema."""
        response = client.get("/api/v1/procedures/chest-x-ray-2-views")

        if response.status_code == 200:
            data = response.json()

            required_fields = [
                "procedure_id",
                "name",
                "slug",
                "family_name",
                "category_name",
                "carrier_prices"
            ]

            for field in required_fields:
                assert field in data
