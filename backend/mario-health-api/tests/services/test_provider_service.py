import pytest
from unittest.mock import MagicMock, Mock
from app.services.provider_service import ProviderService
from fastapi import HTTPException

class TestProviderService:
    @pytest.fixture
    def mock_supabase(self):
        return MagicMock()

    @pytest.fixture
    def service(self, mock_supabase):
        return ProviderService(mock_supabase)

    @pytest.mark.asyncio
    async def test_get_provider_detail_fallback_success(self, service, mock_supabase):
        """Test that missing RPC data triggers fallback and returns 'basic' completeness."""
        provider_id = "1234567890"
        
        # 1. RPC returns empty list
        mock_rpc = mock_supabase.rpc.return_value
        mock_rpc.execute.return_value.data = []

        # 2. Table fallback returns valid provider
        mock_table = mock_supabase.table.return_value
        mock_query = mock_table.select.return_value.eq.return_value.maybe_single.return_value
        mock_query.execute.return_value.data = {
            "provider_id": provider_id,
            "first_name": "Test",
            "last_name": "Doc",
            "specialty_name": "General",
        }

        # Act
        result = await service.get_provider_detail(provider_id)

        # Assert
        assert result.provider_id == provider_id
        assert result.provider_name == "Test Doc"
        assert result.data_completeness == "basic"
        
        # Verify calls
        mock_supabase.rpc.assert_called_with("get_provider_detail", {"provider_id_input": provider_id})
        mock_supabase.table.assert_called_with("provider")

    @pytest.mark.asyncio
    async def test_get_provider_detail_not_found(self, service, mock_supabase):
        """Test that if both RPC and Fallback fail, we get a 404."""
        provider_id = "9999999999"

        # 1. RPC returns empty
        mock_supabase.rpc.return_value.execute.return_value.data = []

        # 2. Table fallback returns None (empty)
        mock_supabase.table.return_value.select.return_value.eq.return_value.maybe_single.return_value.execute.return_value.data = None

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            await service.get_provider_detail(provider_id)
        
        assert exc.value.status_code == 404
        assert "not found" in exc.value.detail

    @pytest.mark.asyncio
    async def test_get_provider_detail_rpc_error_propagates(self, service, mock_supabase):
        """Test that critical RPC errors (like Auth/503) are NOT masked as 404s."""
        provider_id = "error_case"

        # 1. RPC raises a critical exception (simulating connection or auth error)
        mock_supabase.rpc.side_effect = Exception("Connection failed (503)")

        # Act & Assert
        with pytest.raises(HTTPException) as exc:
            await service.get_provider_detail(provider_id)
        
        assert exc.value.status_code == 503
        assert "Service unavailable" in exc.value.detail
