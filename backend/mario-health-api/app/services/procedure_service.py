from fastapi import HTTPException
from supabase import Client
from app.models import (
    ProcedureDetail,
    CarrierPrice,
    ProcedureProvider,
    ProcedureProvidersResponse,
    ProcedureOrg,
    ProcedureOrgsResponse,
)
from decimal import Decimal
from typing import List


class ProcedureService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_procedure_by_slug(self, slug: str) -> ProcedureDetail:
        """Fetch detailed procedure information with all carrier pricing."""

        # Get procedure details
        result = self.supabase.rpc(
            "get_procedure_detail", {"procedure_slug_input": slug}
        ).execute()

        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=404, detail=f"Procedure '{slug}' not found")

        proc = result.data[0]

        # Get carrier prices (if you have pricing table)
        carrier_prices = []
        try:
            prices_result = self.supabase.rpc(
                "get_procedure_carrier_prices", {"procedure_id_input": proc["id"]}
            ).execute()

            carrier_prices = [
                CarrierPrice(
                    carrier_id=cp["carrier_id"],
                    carrier_name=cp["carrier_name"],
                    price=Decimal(str(cp["price"])),
                    currency=cp.get("currency", "USD"),
                    plan_type=cp.get("plan_type"),
                    network_status=cp.get("network_status"),
                    last_updated=(
                        cp.get("last_updated").isoformat()
                        if cp.get("last_updated")
                        else None
                    ),
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
            min_price=(
                Decimal(str(proc["min_price"])) if proc.get("min_price") else None
            ),
            max_price=(
                Decimal(str(proc["max_price"])) if proc.get("max_price") else None
            ),
            avg_price=(
                Decimal(str(proc["avg_price"])) if proc.get("avg_price") else None
            ),
            median_price=(
                Decimal(str(proc["median_price"])) if proc.get("median_price") else None
            ),
            carrier_prices=carrier_prices,
        )

    async def get_procedure_providers(self, slug: str) -> ProcedureProvidersResponse:
        """Fetch all providers offering a specific procedure with pricing."""

        # First get the procedure to verify it exists
        proc_result = self.supabase.rpc(
            "get_procedure_detail", {"procedure_slug_input": slug}
        ).execute()

        if not proc_result.data or len(proc_result.data) == 0:
            raise HTTPException(status_code=404, detail=f"Procedure '{slug}' not found")

        proc = proc_result.data[0]
        procedure_id = proc["id"]
        procedure_name = proc["name"]
        procedure_slug = proc["slug"]
        avg_price = Decimal(str(proc["avg_price"])) if proc.get("avg_price") else None

        # Get providers offering this procedure
        # Query procedure_pricing table joined with provider info
        try:
            # Use a query to get providers with pricing for this procedure
            providers_result = (
                self.supabase.table("procedure_pricing")
                .select(
                    "provider_id, price, provider_name"
                    
                # removing all these columns as they do not yet exist in the procedure_pricing table
                # in_network, rating, reviews, distance, address, city, state, zip_code, mario_points
                )
                .eq("procedure_id", procedure_id)
                .execute()
            )

            providers: List[ProcedureProvider] = []

            for p in providers_result.data:
                price = Decimal(str(p["price"]))
                price_avg = avg_price or price

                # Calculate percentage below average
                if price_avg and price_avg > 0:
                    savings_pct = round(float((price_avg - price) / price_avg * 100), 1)
                    price_relative = (
                        f"{savings_pct}% below average"
                        if savings_pct > 0
                        else "at average"
                    )
                else:
                    price_relative = None

                providers.append(
                    ProcedureProvider(
                        provider_id=p.get("provider_id", ""),
                        provider_name=p.get("provider_name", "Unknown Provider"),
                        in_network=p.get("in_network", False),
                        rating=float(p["rating"]) if p.get("rating") else None,
                        reviews=int(p["reviews"]) if p.get("reviews") else 0,
                        distance=float(p["distance"]) if p.get("distance") else None,
                        price_estimate=price,
                        price_average=price_avg,
                        price_relative_to_average=price_relative,
                        mario_points=int(p.get("mario_points", 0)),
                        address=p.get("address"),
                        city=p.get("city"),
                        state=p.get("state"),
                        zip_code=p.get("zip_code"),
                    )
                )

            # Sort by price (lowest first)
            providers.sort(key=lambda x: x.price_estimate)

            return ProcedureProvidersResponse(
                procedure_name=procedure_name,
                procedure_slug=procedure_slug,
                providers=providers,
            )
        except Exception as e:
            # If query fails, return empty list
            print(f"Warning: Could not fetch providers: {e}")
            return ProcedureProvidersResponse(
                procedure_name=procedure_name,
                procedure_slug=procedure_slug,
                providers=[],
            )


    async def get_procedure_orgs(self, slug: str) -> ProcedureOrgsResponse:
        """Fetch all orgs offering a specific procedure with pricing."""

        # First get the procedure to verify it exists
        proc_result = self.supabase.rpc(
            "get_procedure_detail", {"procedure_slug_input": slug}
        ).execute()

        if not proc_result.data or len(proc_result.data) == 0:
            raise HTTPException(status_code=404, detail=f"Procedure '{slug}' not found")

        proc = proc_result.data[0]
        procedure_id = proc["id"]
        procedure_name = proc["name"]
        procedure_slug = proc["slug"]

        # Get orgs offering this procedure
        # Query procedure_org_pricing table
        try:
            # Use a query to get orgs with pricing for this procedure
            orgs_result = (
                self.supabase.table("procedure_org_pricing")
                .select(
                    "procedure_id", "org_id", "carrier_id", "carrier_name", "count_provider", "min_price", "max_price", "avg_price"
                )
                .eq("procedure_id", procedure_id)
                .execute()
            )

            orgs: List[ProcedureOrg] = []
            for p in orgs_result.data:

                orgs.append(
                    ProcedureOrg(
                        procedure_id=p.get("procedure_id"),
                        org_id= p.get("org_id"),
                        carrier_id= p.get("carrier_id"),
                        carrier_name= p.get("carrier_name"),
                        count_provider= p.get("count_provider"),
                        min_price= p.get("min_price"),
                        max_price= p.get("max_price"),
                        avg_price= p.get("avg_price"),
                    )
                )

            # Sort by price (lowest first)
            orgs.sort(key=lambda x: x.avg_price)

            return ProcedureOrgsResponse(
                procedure_name=procedure_name,
                procedure_slug=procedure_slug,
                orgs=orgs,
            )
        except Exception as e:
            # If query fails, return empty list
            print(f"Warning: Could not fetch orgs: {e}")
            return ProcedureOrgsResponse(
                procedure_name=procedure_name,
                procedure_slug=procedure_slug,
                orgs=[],
            )
