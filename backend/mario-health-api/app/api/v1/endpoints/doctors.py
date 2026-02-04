from fastapi import APIRouter, Depends, Query, Request
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import DoctorSearchResult
from app.services.provider_service import ProviderService
from app.middleware.logging import log_structured
from typing import List

router = APIRouter(prefix="/doctors", tags=["doctors"])


@router.get("/search", response_model=List[DoctorSearchResult])
async def search_doctors(
    request: Request,
    q: str = Query(..., description="Provider name query (first + last)"),
    limit: int = Query(8, ge=1, le=50, description="Maximum number of results"),
    supabase: Client = Depends(get_supabase),
):
    """Search providers by name and return location-disambiguated results."""
    service = ProviderService(supabase)

    log_structured(
        severity="INFO",
        message="Doctor search",
        event_type="search_doctors",
        request_id=request.state.request_id,
        query=q,
        limit=limit,
    )

    return await service.search_doctors(q, limit)