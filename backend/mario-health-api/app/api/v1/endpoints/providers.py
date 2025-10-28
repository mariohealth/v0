from fastapi import APIRouter, Depends, Path
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import ProviderDetail
from app.services.provider_service import ProviderService

router = APIRouter(prefix="/providers", tags=["providers"])


@router.get("/{provider_id}", response_model=ProviderDetail)
async def get_provider_detail(
        provider_id: str = Path(..., description="Provider ID"),
        supabase: Client = Depends(get_supabase)
):
    """
    Get detailed information about a healthcare provider.

    Returns provider information including:
    - Location and contact details
    - All procedures offered with pricing
    - Pricing statistics (min, max, average)

    **Example:** `/api/v1/providers/prov_001`
    """
    service = ProviderService(supabase)
    return await service.get_provider_detail(provider_id)
