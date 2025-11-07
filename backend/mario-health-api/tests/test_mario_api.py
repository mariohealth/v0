"""
Pytest tests for Mario Health API endpoints.

Tests the three key endpoints:
1. /api/v1/search - Search autocomplete
2. /api/v1/procedures/{slug}/providers - Provider list per procedure
3. /api/v1/providers/{id}/procedures/{slug} - Provider-procedure detail
"""

import pytest
import requests
import os
from typing import Dict, Any

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000/api/v1")


@pytest.fixture(scope="session")
def session():
    """Create a requests session for API calls."""
    s = requests.Session()
    s.headers.update({"Accept": "application/json"})
    return s


def test_search_autocomplete(session):
    """Test live autocomplete for 'mri' returns procedures with valid fields."""
    resp = session.get(f"{BASE_URL}/search", params={"q": "mri"})
    
    assert resp.status_code == 200, f"Unexpected {resp.status_code}: {resp.text}"
    
    data = resp.json()
    assert "results" in data, "Missing 'results' key in response"
    assert isinstance(data["results"], list), "Results should be a list"
    
    if data["results"]:
        first = data["results"][0]
        required_keys = ["procedure_id", "procedure_name", "procedure_slug"]
        for key in required_keys:
            assert key in first, f"Missing key {key} in search result"


@pytest.mark.dependency(depends=["test_search_autocomplete"])
def test_procedure_providers(session):
    """Test that procedures return provider listings with pricing and MarioPoints."""
    # Step 1: Find a procedure slug from search
    search_resp = session.get(f"{BASE_URL}/search", params={"q": "mri"})
    assert search_resp.status_code == 200
    
    search_data = search_resp.json()
    if not search_data.get("results"):
        pytest.skip("No search results found for 'mri'")
    
    slug = search_data["results"][0]["procedure_slug"]
    
    # Step 2: Call providers endpoint
    resp = session.get(f"{BASE_URL}/procedures/{slug}/providers")
    assert resp.status_code == 200, f"Unexpected {resp.status_code}: {resp.text}"
    
    data = resp.json()
    assert "providers" in data, "Missing 'providers' key in response"
    assert "procedure_name" in data, "Missing 'procedure_name' key in response"
    assert "procedure_slug" in data, "Missing 'procedure_slug' key in response"
    
    providers = data["providers"]
    assert isinstance(providers, list), "Providers should be a list"
    
    if providers:
        p = providers[0]
        required_keys = ["provider_id", "provider_name", "price_estimate", "mario_points"]
        for key in required_keys:
            assert key in p, f"Missing key {key} in provider record"


@pytest.mark.dependency(depends=["test_procedure_providers"])
def test_provider_procedure_detail(session):
    """Test detailed provider-procedure endpoint returns expected fields."""
    # Get first slug and provider
    search_resp = session.get(f"{BASE_URL}/search", params={"q": "mri"})
    assert search_resp.status_code == 200
    
    search_data = search_resp.json()
    if not search_data.get("results"):
        pytest.skip("No search results found for 'mri'")
    
    slug = search_data["results"][0]["procedure_slug"]
    
    providers_resp = session.get(f"{BASE_URL}/procedures/{slug}/providers")
    assert providers_resp.status_code == 200
    
    providers_data = providers_resp.json()
    if not providers_data.get("providers"):
        pytest.skip("No providers available for given procedure")
    
    provider_id = providers_data["providers"][0]["provider_id"]
    
    # Call provider detail endpoint
    resp = session.get(f"{BASE_URL}/providers/{provider_id}/procedures/{slug}")
    assert resp.status_code == 200, f"Unexpected {resp.status_code}: {resp.text}"
    
    data = resp.json()
    required_keys = [
        "provider_id",
        "provider_name",
        "procedure_id",
        "procedure_name",
        "procedure_slug",
        "estimated_costs",
        "mario_points",
    ]
    
    for key in required_keys:
        assert key in data, f"Missing key {key} in provider detail"
    
    assert isinstance(data["estimated_costs"], dict), "estimated_costs should be a dict"
    assert "total" in data["estimated_costs"], "Missing 'total' in estimated_costs"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

