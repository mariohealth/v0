from fastapi import HTTPException
from supabase import Client
from app.models import Provider, ProviderDetail, ProviderProcedurePricing, ProviderProcedureDetail
from decimal import Decimal


class ProviderService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_provider(self, provider_id: str) -> ProviderDetail:
        """Fetch detailed provider information with all procedures."""

        # Get provider basic info and stats
        provider_result = (
            self.supabase.table("provider")
            .select(
                "provider_id",
                "name_prefix",
                "first_name",
                "middle_name",
                "last_name",
                "name_suffix",
                "credential"
            )
            .eq("provider_id", provider_id)
            .single()
            .execute()
        )

        if not provider_result.data or len(provider_result.data) == 0:
            raise HTTPException(
                status_code=404, detail=f"Provider '{provider_id}' not found"
            )

        provider = provider_result.data

        return Provider(
            provider_id=provider.get("provider_id"),
            name_prefix=provider.get("name_prefix"),
            first_name=provider.get("first_name"),
            middle_name=provider.get("middle_name"),
            last_name=provider.get("last_name"),
            name_suffix=provider.get("name_suffix"),
            credential=provider.get("credential"),

        )

    async def get_provider_detail(self, provider_id: str) -> ProviderDetail:
        """Fetch detailed provider information with all procedures."""

        # Get provider basic info and stats
        provider_result = self.supabase.rpc(
            "get_provider_detail", {"provider_id_input": provider_id}
        ).execute()

        if not provider_result.data or len(provider_result.data) == 0:
            raise HTTPException(
                status_code=404, detail=f"Provider '{provider_id}' not found"
            )

        provider = provider_result.data[0]

        # Get all procedures offered by this provider
        procedures_result = self.supabase.rpc(
            "get_provider_procedures", {"provider_id_input": provider_id}
        ).execute()

        procedures = [
            ProviderProcedurePricing(
                procedure_id=proc["procedure_id"],
                procedure_name=proc["procedure_name"],
                procedure_slug=proc["procedure_slug"],
                family_name=proc["family_name"],
                family_slug=proc["family_slug"],
                category_name=proc["category_name"],
                category_slug=proc["category_slug"],
                price=Decimal(str(proc["price"])),
                carrier_id=proc["carrier_id"],
                carrier_name=proc["carrier_name"],
                last_updated=(
                    proc["last_updated"].isoformat()
                    if proc.get("last_updated")
                    else None
                ),
            )
            for proc in procedures_result.data
        ]

        return ProviderDetail(
            provider_id=provider["provider_id"],
            provider_name=provider["provider_name"],
            address=provider.get("address"),
            city=provider.get("city"),
            state=provider.get("state"),
            zip_code=provider.get("zip_code"),
            latitude=float(provider["latitude"]) if provider.get("latitude") else None,
            longitude=(
                float(provider["longitude"]) if provider.get("longitude") else None
            ),
            phone=provider.get("phone"),
            total_procedures=provider["total_procedures"],
            avg_price=(
                Decimal(str(provider["avg_price"]))
                if provider.get("avg_price")
                else None
            ),
            min_price=(
                Decimal(str(provider["min_price"]))
                if provider.get("min_price")
                else None
            ),
            max_price=(
                Decimal(str(provider["max_price"]))
                if provider.get("max_price")
                else None
            ),
            procedures=procedures,
        )

    async def get_provider_procedure_detail(
        self, provider_id: str, procedure_slug: str
    ) -> ProviderProcedureDetail:
        """Fetch detailed provider-procedure information with cost breakdown."""

        # First get the procedure to verify it exists
        proc_result = self.supabase.rpc(
            "get_procedure_detail", {"procedure_slug_input": procedure_slug}
        ).execute()

        if not proc_result.data or len(proc_result.data) == 0:
            raise HTTPException(
                status_code=404, detail=f"Procedure '{procedure_slug}' not found"
            )

        proc = proc_result.data[0]
        procedure_id = proc["id"]
        procedure_name = proc["name"]
        avg_price = Decimal(str(proc["avg_price"])) if proc.get("avg_price") else None

        # Get provider-procedure pricing record
        try:
            pricing_result = (
                self.supabase.table("procedure_pricing")
                .select(
                    "provider_id, provider_name, price"

                    # removing all these columns as they do not yet exist in the procedure_pricing table
                # , in_network, rating, reviews, address, city, state, zip_code, phone, website, hours, accreditation, staff, mario_points, facility_fee, professional_fee, supplies_fee
                )
                .eq("procedure_id", procedure_id)
                .eq("provider_id", provider_id)
                .limit(1) # TODO a provider can work at multiple places for a given procedure so that query can
                # return multiple rows and the logic below doesn't handle that
                .single()
                .execute()
            )

            if not pricing_result.data:
                raise HTTPException(
                    status_code=404,
                    detail=f"Provider '{provider_id}' does not offer procedure '{procedure_slug}'",
                )

            p = pricing_result.data
            price = Decimal(str(p["price"]))

            # Calculate savings vs average
            savings_pct = None
            if avg_price and avg_price > 0:
                savings_pct = round(float((avg_price - price) / avg_price * 100), 1)

            # Build estimated costs breakdown
            # estimated_costs = {"total": float(price)}
            # if p.get("facility_fee"):
            #     estimated_costs["facility_fee"] = float(p["facility_fee"])
            # if p.get("professional_fee"):
            #     estimated_costs["professional_fee"] = float(p["professional_fee"])
            # if p.get("supplies_fee"):
            #     estimated_costs["supplies_fee"] = float(p["supplies_fee"])

            return ProviderProcedureDetail(
                provider_id=p.get("provider_id", provider_id),
                provider_name=p.get("provider_name", "Unknown Provider"),
                procedure_id=procedure_id,
                procedure_name=procedure_name,
                procedure_slug=procedure_slug,
                address=p.get("address"),
                # city=p.get("city"),
                # state=p.get("state"),
                # zip_code=p.get("zip_code"),
                # phone=p.get("phone"),
                # website=p.get("website"),
                # hours=p.get("hours"),
                # estimated_costs=estimated_costs,
                average_price=avg_price,
                savings_vs_average=savings_pct,
                # in_network=p.get("in_network", False),
                # rating=float(p["rating"]) if p.get("rating") else None,
                # reviews=int(p["reviews"]) if p.get("reviews") else 0,
                # accreditation=p.get("accreditation"),
                # staff=p.get("staff"),
                # mario_points=int(p.get("mario_points", 0)),
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch provider-procedure detail: {str(e)}",
            )
