from fastapi import HTTPException
from supabase import Client
from app.models import Procedure, FamilyProceduresResponse
from decimal import Decimal


class FamilyService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_procedures_by_family(self, slug: str) -> FamilyProceduresResponse:
        """Fetch procedures for a family with pricing stats."""

        # First, get family info including description
        family_check = self.supabase.table("procedure_family") \
            .select("id, name, slug, description") \
            .eq("slug", slug) \
            .limit(1) \
            .execute()

        if not family_check.data:
            raise HTTPException(
                status_code=404,
                detail=f"Family '{slug}' not found"
            )

        family_info = family_check.data[0]

        # Get procedures with pricing
        result = self.supabase.rpc(
            "get_procedures_with_pricing",
            {"family_slug_input": slug}
        ).execute()

        procedures = []
        if result.data:
            procedures = [
                Procedure(
                    id=p["id"],
                    name=p["name"],
                    description=p.get("description"),
                    cpt_code=p.get("cpt_code"),
                    min_price=Decimal(str(p["min_price"])) if p.get("min_price") else None,
                    max_price=Decimal(str(p["max_price"])) if p.get("max_price") else None,
                    avg_price=Decimal(str(p["avg_price"])) if p.get("avg_price") else None,
                    price_count=p.get("price_count", 0)
                )
                for p in result.data
            ]

        return FamilyProceduresResponse(
            family_slug=family_info["slug"],
            family_name=family_info["name"],
            family_description=family_info.get("description"),
            procedures=procedures
        )
