"""Shared pytest fixtures and configuration."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="session")
def test_client():
    """Create test client for the entire test session."""
    return TestClient(app)

@pytest.fixture
def sample_search_query():
    """Sample search query for tests."""
    return "chest x-ray"

@pytest.fixture
def sample_procedure_slug():
    """Sample procedure slug for tests."""
    return "chest-x-ray-2-views"

@pytest.fixture
def sample_zip_code():
    """Sample ZIP code for location tests."""
    return "02138"
