from fastapi import APIRouter, HTTPException, Depends, Request
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import SpecialtiesResponse
from app.services.specialty_service import SpecialtyService
from app.middleware.logging import log_structured

router = APIRouter(prefix="/specialties", tags=["specialties"])

@router.get("", response_model=SpecialtiesResponse)
async def get_specialties(
    request: Request,  # Add this to access request context
    supabase: Client = Depends(get_supabase)
):
    """Get all procedure categories with family counts."""
    service = SpecialtyService(supabase)

    # Log view event for analytics
    log_structured(
        severity="INFO",
        message="List of all specialties viewed",
        event_type="get_specialties",
        request_id=request.state.request_id,
    )

    return await service.get_all_specialties()
