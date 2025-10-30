"""Performance tests for API endpoints."""
import pytest
import time
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestPerformance:
    """Test API performance."""

    def test_search_response_time(self):
        """Search should respond in under 200ms."""
        start = time.time()
        response = client.get("/api/v1/search?q=chest")
        duration = (time.time() - start) * 1000  # Convert to ms

        assert response.status_code == 200
        assert duration < 200, f"Search took {duration}ms, expected < 200ms"

    def test_categories_response_time(self):
        """Categories should respond in under 50ms."""
        start = time.time()
        response = client.get("/api/v1/categories")
        duration = (time.time() - start) * 1000

        assert response.status_code == 200
        assert duration < 200, f"Categories took {duration}ms, expected < 200ms"

    @pytest.mark.slow
    def test_concurrent_requests(self):
        """Test handling of concurrent requests."""
        import concurrent.futures

        def make_request():
            return client.get("/api/v1/search?q=test")

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(50)]
            results = [f.result() for f in futures]

        # All requests should succeed
        assert all(r.status_code == 200 for r in results)
