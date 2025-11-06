from fastapi import HTTPException
from supabase import Client
from decimal import Decimal
from postgrest.exceptions import APIError

from app.models import SearchResponse, SearchResult
from app.middleware.logging import log_structured


class SearchService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def search(
            self,
            query: str,
            zip_code: str | None = None,
            radius_miles: int = 25
    ) -> SearchResponse:
        """Search procedures with optional location filtering.

        Uses PostgreSQL full-text search + fuzzy matching for intelligent results.
        Results are ranked by relevance score (match_score).
        """

        try:

            # Prepare RPC parameters
            rpc_params = {"search_query": query}

            if zip_code:
                rpc_params["zip_code_input"] = zip_code
                rpc_params["radius_miles"] = radius_miles

            # Call the database function
            result = self.supabase.rpc("search_procedures_v2", rpc_params).execute()

            # Transform results
            results = [
                SearchResult(
                    procedure_id=r["procedure_id"],
                    procedure_name=r["procedure_name"],
                    procedure_slug=r["procedure_slug"],
                    family_name=r["family_name"],
                    family_slug=r["family_slug"],
                    category_name=r["category_name"],
                    category_slug=r["category_slug"],
                    best_price=Decimal(str(r["best_price"])),
                    avg_price=Decimal(str(r["avg_price"])),
                    price_range=f"${r['best_price']} - ${r['max_price']}",
                    provider_count=r["provider_count"],
                    nearest_provider=r.get("nearest_provider"),
                    nearest_distance_miles=(
                        float(r["nearest_distance_miles"])
                        if r.get("nearest_distance_miles")
                        else None
                    ),
                    match_score=float(r["match_score"])  # NEW: Include relevance score
                )
                for r in result.data
            ]

            # Log search analytics
            log_structured(
                severity="INFO",
                message="Search completed",
                query=query,
                zip_code=zip_code,
                radius_miles=radius_miles,
                results_count=len(results),
                has_results=len(results) > 0,
            )

            return SearchResponse(
                query=query,
                location=zip_code,
                radius_miles=radius_miles,
                results_count=len(results),
                results=results
            )

        except HTTPException:
            # Re-raise validation errors as-is
            raise

        except APIError as e:
            log_structured(
                severity="ERROR",
                message="Database error during search",
                query=query,
                zip_code=zip_code,
                radius_miles=radius_miles,
                error_code=getattr(e, 'code', 'unknown'),
                error_details=str(e),
            )
            raise HTTPException(
                status_code=503,
                detail="Search temporarily unavailable"
            )

        except Exception as e:
            log_structured(
                severity="ERROR",
                message="Unexpected search error",
                query=query,
                zip_code=zip_code,
                radius_miles=radius_miles,
                error_type=type(e).__name__,
                error_message=str(e),
            )
            raise
