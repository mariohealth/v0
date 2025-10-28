from fastapi import APIRouter, HTTPException, Depends
from supabase import Client
from app.core.dependencies import get_supabase
from app.models.category import CategoryFamiliesResponse
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/{slug}/families", response_model=CategoryFamiliesResponse)
async def get_category_families(
    slug: str,
    supabase: Client = Depends(get_supabase)
):
    """Get all procedure families within a category."""
    service = CategoryService(supabase)
    return await service.get_families_by_category(slug)