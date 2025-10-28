from fastapi import APIRouter, HTTPException, Depends
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import ProcedureDetail
from app.services.procedure_service import ProcedureService

router = APIRouter(prefix="/procedures", tags=["procedures"])


@router.get("/{slug}", response_model=ProcedureDetail)
async def get_procedure_detail(
        slug: str,
        supabase: Client = Depends(get_supabase)
):
    """
    Get detailed information about a specific procedure.

    Args:
        slug: Procedure slug (e.g., 'chest-x-ray-2-views', 'mri-brain-without-contrast')

    Returns:
        Detailed procedure information including all carrier pricing
    """
    service = ProcedureService(supabase)
    return await service.get_procedure_by_slug(slug)
