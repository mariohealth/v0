from fastapi import APIRouter, HTTPException, Depends
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import FamilyProceduresResponse
from app.services.family_service import FamilyService

router = APIRouter(prefix="/families", tags=["families"])


@router.get("/{slug}/procedures", response_model=FamilyProceduresResponse)
async def get_family_procedures(
        slug: str,
        supabase: Client = Depends(get_supabase)
):
    """
    Get all procedures within a family with pricing information.

    Args:
        slug: Family slug (e.g., 'x-ray', 'mri', 'blood-tests')

    Returns:
        List of procedures with min/max/avg pricing
    """
    service = FamilyService(supabase)
    return await service.get_procedures_by_family(slug)
