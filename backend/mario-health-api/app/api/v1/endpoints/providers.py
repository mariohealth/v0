from fastapi import APIRouter, Depends, Path, Query, Request
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import ProviderDetail, ProviderProcedureDetail
from app.services.provider_service import ProviderService
from app.middleware.logging import log_structured
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/providers", tags=["providers"])


@router.get("/{provider_id}", response_model=ProviderDetail)
async def get_provider_detail(
    request: Request,
    provider_id: str = Path(
        ..., description="Provider ID (also accepts 'id' parameter)"
    ),
    supabase: Client = Depends(get_supabase),
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

    # Log view event for analytics
    log_structured(
        severity="INFO",
        message="Provider detail viewed",
        event_type="get_provider_detail",
        request_id=request.state.request_id,
        provider_id=provider_id,
    )

    return await service.get_provider_detail(provider_id)


@router.get(
    "/{provider_id}/procedures/{procedure_slug}", response_model=ProviderProcedureDetail
)
async def get_provider_procedure_detail(
    request: Request,
    provider_id: str = Path(..., description="Provider ID"),
    procedure_slug: str = Path(..., description="Procedure slug"),
    supabase: Client = Depends(get_supabase),
):
    """
    Get detailed provider-procedure information with cost breakdown.

    Returns:
    - Provider location and contact details
    - Cost breakdown (facility fee, professional fee, supplies fee, total)
    - Comparison vs area average
    - Accreditation and staff info
    - MarioPoints and booking information

    **Example:** `/api/v1/providers/prov_001/procedures/mri-scan-brain`
    """
    service = ProviderService(supabase)

    # Log view event for analytics
    log_structured(
        severity="INFO",
        message="Provider-procedure detail viewed",
        event_type="get_provider_procedure_detail",
        request_id=request.state.request_id,
        provider_id=provider_id,
        procedure_slug=procedure_slug,
    )

    return await service.get_provider_procedure_detail(provider_id, procedure_slug)


class TimeSlot(BaseModel):
    """Time slot model."""

    start_time: str
    end_time: str
    available: bool
    date: str


@router.get("/{provider_id}/time-slots", response_model=List[TimeSlot])
async def get_available_time_slots(
    provider_id: str = Path(
        ..., description="Provider ID (also accepts 'id' parameter)"
    ),
    date: Optional[str] = Query(
        None, description="Optional specific date (YYYY-MM-DD)"
    ),
    supabase: Client = Depends(get_supabase),
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
