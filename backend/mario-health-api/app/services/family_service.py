from fastapi import HTTPException
from supabase import Client
from app.models import Procedure, FamilyProceduresResponse
from decimal import Decimal


class FamilyService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_procedures_by_family(self, slug: str) -> FamilyProceduresResponse:
        """Fetch procedures for a family with pricing stats."""

        result = self.supabase.rpc(
            "get_procedures_with_pricing",
            {"family_slug_input": slug}
        ).execute()

        if not result.data:
            # Verify family exists
            family_check = self.supabase.table("procedure_family") \
                .select("id, name, slug") \
                .eq("slug", slug) \
                .limit(1) \
                .execute()

            if not family_check.data:
                raise HTTPException(
                    status_code=404,
                    detail=f"Family '{slug}' not found"
                )

            # Family exists but has no procedures
            return FamilyProceduresResponse(
                family_slug=slug,
                family_name=family_check.data[0]["name"],
                procedures=[]
            )

        # Get family info from first result
        family_name = result.data[0]["family_name"]
        family_slug = result.data[0]["family_slug"]

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
            family_slug=family_slug,
            family_name=family_name,
            procedures=procedures
        )
