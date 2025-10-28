from fastapi import HTTPException
from supabase import Client
from app.models import ProcedureDetail, CarrierPrice
from decimal import Decimal


class ProcedureService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_procedure_by_slug(self, slug: str) -> ProcedureDetail:
        """Fetch detailed procedure information with all carrier pricing."""

        # Get procedure details
        result = self.supabase.rpc(
            "get_procedure_detail",
            {"procedure_slug_input": slug}
        ).execute()

        if not result.data or len(result.data) == 0:
            raise HTTPException(
                status_code=404,
                detail=f"Procedure '{slug}' not found"
            )

        proc = result.data[0]

        # Get carrier prices (if you have pricing table)
        carrier_prices = []
        try:
            prices_result = self.supabase.rpc(
                "get_procedure_carrier_prices",
                {"procedure_id_input": proc["id"]}
            ).execute()

            carrier_prices = [
                CarrierPrice(
                    carrier_id=cp["carrier_id"],
                    carrier_name=cp["carrier_name"],
                    price=Decimal(str(cp["price"])),
                    currency=cp.get("currency", "USD"),
                    plan_type=cp.get("plan_type"),
                    network_status=cp.get("network_status"),
                    last_updated=cp.get("last_updated").isoformat() if cp.get("last_updated") else None
                )
                for cp in prices_result.data
            ]
        except Exception as e:
            # If pricing function doesn't exist or fails, continue without prices
            print(f"Warning: Could not fetch carrier prices: {e}")

        return ProcedureDetail(
            id=proc["id"],
            name=proc["name"],
            slug=proc["slug"],
            description=proc.get("description"),
            family_id=proc["family_id"],
            family_name=proc["family_name"],
            family_slug=proc["family_slug"],
            category_id=proc["category_id"],
            category_name=proc["category_name"],
            category_slug=proc["category_slug"],
            min_price=Decimal(str(proc["min_price"])) if proc.get("min_price") else None,
            max_price=Decimal(str(proc["max_price"])) if proc.get("max_price") else None,
            avg_price=Decimal(str(proc["avg_price"])) if proc.get("avg_price") else None,
            median_price=Decimal(str(proc["median_price"])) if proc.get("median_price") else None,
            carrier_prices=carrier_prices
        )
