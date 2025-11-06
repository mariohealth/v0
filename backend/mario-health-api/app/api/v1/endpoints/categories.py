from fastapi import APIRouter, HTTPException, Depends, Request
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import CategoriesResponse, CategoryFamiliesResponse
from app.services.category_service import CategoryService
from app.middleware.logging import log_structured

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("", response_model=CategoriesResponse)
async def get_categories(
    request: Request,  # Add this to access request context
    supabase: Client = Depends(get_supabase)
):
    """Get all procedure categories with family counts."""
    service = CategoryService(supabase)

    # Log view event for analytics
    log_structured(
        severity="INFO",
        message="List of all categories viewed",
        event_type="get_categories",
        request_id=request.state.request_id,
    )

    return await service.get_all_categories()

@router.get("/{slug}/families", response_model=CategoryFamiliesResponse)
async def get_category_families(
    request: Request,  # Add this to access request context
    slug: str,
    supabase: Client = Depends(get_supabase)
):
    """Get all procedure families within a category."""
    service = CategoryService(supabase)

    # Log view event for analytics
    log_structured(
        severity="INFO",
        message="List of families for a given category viewed",
        event_type="get_category_families",
        request_id=request.state.request_id,
        slug=slug,
    )

    return await service.get_families_by_category(slug)