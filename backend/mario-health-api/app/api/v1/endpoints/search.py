from fastapi import APIRouter, Query, Depends
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import SearchResponse
from app.services.search_service import SearchService

router = APIRouter(prefix="/search", tags=["search"])

@router.get("", response_model=SearchResponse)
async def search_procedures(
    q: str = Query(..., min_length=2, description="Search query (procedure name)"),
    zip: str | None = Query(None, pattern=r"^\d{5}$", description="5-digit ZIP code"),
    radius: int = Query(25, ge=1, le=100, description="Search radius in miles"),
    supabase: Client = Depends(get_supabase)
):
    """Search for procedures by name."""
    service = SearchService(supabase)
    return await service.search(query=q, zip_code=zip, radius_miles=radius)
