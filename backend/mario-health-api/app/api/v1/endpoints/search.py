from fastapi import APIRouter, Query, Depends, Request
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import SearchResponse
from app.services.search_service import SearchService
from app.middleware.logging import log_structured

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=SearchResponse)
async def search_procedures(
        request: Request,
        q: str = Query(..., min_length=2, description="Search query (procedure name)"),
        zip_code: str | None = Query(None, pattern=r"^\d{5}$", description="5-digit ZIP code"),
        zip: str | None = Query(None, pattern=r"^\d{5}$", description="5-digit ZIP code (alias)"),
        radius: int = Query(25, ge=1, le=100, description="Search radius in miles"),
        supabase: Client = Depends(get_supabase)
):
    """Search for procedures by name with intelligent matching.

    Features:
    - Full-text search (handles multi-word queries)
    - Fuzzy matching (handles typos)
    - Relevance ranking (match_score)
    - Location filtering (ZIP + radius)
    
    Supports both `zip_code` and `zip` query parameters for compatibility.
    """
    # Use zip_code if provided, otherwise fall back to zip alias
    effective_zip = zip_code or zip
    service = SearchService(supabase)

    # Log search event for analytics (business logic, not error)
    log_structured(
        severity="INFO",
        message="Search performed",
        event_type="search",
        request_id=request.state.request_id,
        search_query=q,
        zip_code=effective_zip,
        radius_miles=radius,
    )

    return await service.search(query=q, zip_code=effective_zip, radius_miles=radius)
