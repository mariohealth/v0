"""Unit tests for search service."""
import pytest
from unittest.mock import Mock, AsyncMock
from app.services.search_service import SearchService
from app.models import SearchResult


class TestSearchService:
    """Test SearchService class."""

    @pytest.fixture
    def mock_supabase(self):
        """Mock Supabase client."""
        mock = Mock()
        mock.rpc = Mock()
        return mock

    @pytest.fixture
    def search_service(self, mock_supabase):
        """Create SearchService with mock."""
        return SearchService(mock_supabase)

    def test_search_without_location(self, search_service, mock_supabase):
        """Test search without location filtering."""
        # Arrange
        mock_response = Mock()
        mock_response.data = [
            {
                "procedure_id": "proc_001",
                "procedure_name": "Chest X-Ray",
                "procedure_slug": "chest-x-ray",
                "best_price": 100.50,
                "provider_count": 5
            }
        ]
        mock_supabase.rpc.return_value.execute.return_value = mock_response

        # Act
        result = search_service.search_procedures("chest")

        # Assert
        assert len(result.results) == 1
        assert result.results[0].procedure_name == "Chest X-Ray"
        assert result.query == "chest"
        mock_supabase.rpc.assert_called_once()
