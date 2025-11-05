from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import RedirectResponse
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import ProcedureDetail
from app.services.procedure_service import ProcedureService

router = APIRouter(prefix="/procedures", tags=["procedures"])


@router.get("")
async def search_procedures_alias(
    q: str = Query(..., description="Search query"),
    supabase: Client = Depends(get_supabase)
):
    """
    Alias route for procedure search.
    Redirects to /api/v1/search for compatibility with frontend calls to /procedures?q={query}
    """
    return RedirectResponse(url=f"/api/v1/search?q={q}", status_code=307)


@router.get("/{slug}", response_model=ProcedureDetail)
async def get_procedure_detail(
        slug: str,
        supabase: Client = Depends(get_supabase)
):
    """
    Get detailed information about a specific procedure.

    Args:
        slug: Procedure slug or ID (e.g., 'chest-x-ray-2-views', 'mri-brain-without-contrast')

    Returns:
        Detailed procedure information including all carrier pricing
        
    Note: This route accepts both `/procedures/{slug}` and `/procedures/{id}` patterns.
    FastAPI matches by path pattern, so both work.
    """
    service = ProcedureService(supabase)
    return await service.get_procedure_by_slug(slug)
