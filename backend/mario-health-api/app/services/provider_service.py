from fastapi import HTTPException
from supabase import Client
from app.models import ProviderDetail, ProviderProcedurePricing
from decimal import Decimal


class ProviderService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_provider_detail(self, provider_id: str) -> ProviderDetail:
        """Fetch detailed provider information with all procedures."""

        # Get provider basic info and stats
        provider_result = self.supabase.rpc(
            "get_provider_detail",
            {"provider_id_input": provider_id}
        ).execute()

        if not provider_result.data or len(provider_result.data) == 0:
            raise HTTPException(
                status_code=404,
                detail=f"Provider '{provider_id}' not found"
            )

        provider = provider_result.data[0]

        # Get all procedures offered by this provider
        procedures_result = self.supabase.rpc(
            "get_provider_procedures",
            {"provider_id_input": provider_id}
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
                last_updated=proc["last_updated"].isoformat() if proc.get("last_updated") else None
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
            longitude=float(provider["longitude"]) if provider.get("longitude") else None,
            phone=provider.get("phone"),
            total_procedures=provider["total_procedures"],
            avg_price=Decimal(str(provider["avg_price"])) if provider.get("avg_price") else None,
            min_price=Decimal(str(provider["min_price"])) if provider.get("min_price") else None,
            max_price=Decimal(str(provider["max_price"])) if provider.get("max_price") else None,
            procedures=procedures
        )
