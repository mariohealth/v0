from fastapi import APIRouter, HTTPException, Depends, Request, Query
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import SpecialtiesResponse, SpecialtyDetailsResponse, SpecialtyProvidersResponse
from app.services.specialty_service import SpecialtyService
from app.middleware.logging import log_structured

router = APIRouter(prefix="/specialties", tags=["specialties"])

@router.get("", response_model=SpecialtiesResponse)
async def get_specialties(
    request: Request,  # Add this to access request context
    supabase: Client = Depends(get_supabase)
):
    """Get all medical specialties."""
    service = SpecialtyService(supabase)

    # Log view event for analytics
    log_structured(
        severity="INFO",
        message="List of all specialties viewed",
        event_type="get_specialties",
        request_id=request.state.request_id,
    )

    return await service.get_all_specialties()

@router.get("/{specialty_slug}", response_model=SpecialtyDetailsResponse)
async def get_specialty_details(
        request: Request,
        specialty_slug: str,
        supabase: Client = Depends(get_supabase),
):
    """Get all NUCC specialties for a specific specialty."""
    service = SpecialtyService(supabase)

    # Log view event for analytics
    log_structured(
        severity="INFO",
        message="List of all NUCC specialties for a given specialty viewed",
        event_type="get_specialty_details",
        request_id=request.state.request_id,
        specialty_slug=specialty_slug,
    )

    return await service.get_specialties_details(specialty_slug)


@router.get("/{specialty_slug}/providers", response_model=SpecialtyProvidersResponse)
async def get_specialty_providers(
        request: Request,
        specialty_slug: str,
        zip_code: str = Query(..., description="ZIP code for location-based search"),
        radius_miles: int = Query(25, ge=1, le=100, description="Search radius in miles"),
        limit: int = Query(20, ge=1, le=100, description="Maximum number of providers to return"),
        supabase: Client = Depends(get_supabase),
):
    """Get providers offering services in a specific specialty with pricing.
    
    Args:
        specialty_slug: Specialty slug (e.g., 'cardiologist', 'dermatologist')
        zip_code: ZIP code for location-based search (required)
        radius_miles: Search radius in miles (default: 25, max: 100)
        limit: Maximum number of providers (default: 20, max: 100)
    
    Returns:
        List of providers with location, distance, and representative pricing
    """
    service = SpecialtyService(supabase)

    # Log view event for analytics
    log_structured(
        severity="INFO",
        message="Specialty providers viewed",
        event_type="get_specialty_providers",
        request_id=request.state.request_id,
        specialty_slug=specialty_slug,
        zip_code=zip_code,
        radius_miles=radius_miles,
        limit=limit,
    )

    return await service.get_specialty_providers(
        specialty_slug=specialty_slug,
        zip_code=zip_code,
        radius_miles=radius_miles,
        limit=limit
    )

