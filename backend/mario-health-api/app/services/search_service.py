from supabase import Client
from app.models import SearchResponse, SearchResult
from decimal import Decimal


class SearchService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def search(
            self,
            query: str,
            zip_code: str | None = None,
            radius_miles: int = 25
    ) -> SearchResponse:
        """Search procedures with optional location filtering."""

        if zip_code:
            result = self.supabase.rpc(
                "search_procedures",
                {
                    "search_query": query,
                    "zip_code_input": zip_code,
                    "radius_miles": radius_miles
                }
            ).execute()
        else:
            result = self.supabase.rpc(
                "search_procedures",
                {"search_query": query}
            ).execute()

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
                nearest_distance_miles=float(r["nearest_distance_miles"]) if r.get("nearest_distance_miles") else None
            )
            for r in result.data
        ]

        return SearchResponse(
            query=query,
            location=zip_code,
            radius_miles=radius_miles,
            results_count=len(results),
            results=results
        )
