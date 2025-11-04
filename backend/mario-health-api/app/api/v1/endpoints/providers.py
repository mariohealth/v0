from fastapi import APIRouter, Depends, Path, Query
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import ProviderDetail
from app.services.provider_service import ProviderService
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/providers", tags=["providers"])


@router.get("/{provider_id}", response_model=ProviderDetail)
async def get_provider_detail(
        provider_id: str = Path(..., description="Provider ID (also accepts 'id' parameter)"),
        supabase: Client = Depends(get_supabase)
):
    """
    Get detailed information about a healthcare provider.

    Returns provider information including:
    - Location and contact details
    - All procedures offered with pricing
    - Pricing statistics (min, max, average)

    **Example:** `/api/v1/providers/prov_001`
    
    Note: This route accepts both `/providers/{provider_id}` and `/providers/{id}` patterns.
    FastAPI matches by path pattern, so both work.
    """
    service = ProviderService(supabase)
    return await service.get_provider_detail(provider_id)


class TimeSlot(BaseModel):
    """Time slot model."""
    start_time: str
    end_time: str
    available: bool
    date: str


@router.get("/{provider_id}/time-slots", response_model=List[TimeSlot])
async def get_available_time_slots(
    provider_id: str = Path(..., description="Provider ID (also accepts 'id' parameter)"),
    date: Optional[str] = Query(None, description="Optional specific date (YYYY-MM-DD)"),
    supabase: Client = Depends(get_supabase)
):
    """
    Get available time slots for a provider.
    
    TODO: Implement logic to match frontend requirements.
    
    Note: This route accepts both `/providers/{provider_id}/time-slots` and `/providers/{id}/time-slots` patterns.
    """
    # Stub response for now
    target_date = date or datetime.now().strftime("%Y-%m-%d")
    return [
        TimeSlot(
            start_time="09:00",
            end_time="09:30",
            available=True,
            date=target_date,
        ),
        TimeSlot(
            start_time="10:00",
            end_time="10:30",
            available=True,
            date=target_date,
        ),
        TimeSlot(
            start_time="14:00",
            end_time="14:30",
            available=False,
            date=target_date,
        ),
    ]
