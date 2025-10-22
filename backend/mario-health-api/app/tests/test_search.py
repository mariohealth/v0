from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_search_endpoint():
    response = client.get("/search?q=test")
    assert response.status_code == 200
    assert "results" in response.json()
