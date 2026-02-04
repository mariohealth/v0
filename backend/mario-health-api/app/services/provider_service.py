from fastapi import HTTPException
from supabase import Client
from app.models import (
    Provider,
    ProviderDetail,
    ProviderProcedurePricing,
    ProviderProcedureDetail,
    DoctorSearchResult,
)
from decimal import Decimal
from typing import List


class ProviderService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_provider(self, provider_id: str) -> ProviderDetail:
        """Fetch detailed provider information with all procedures."""

        # Get provider basic info and stats
        try:
            provider_result = (
                self.supabase.table("provider")
                .select(
                    "provider_id",
                    "name_prefix",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "name_suffix",
                    "credential",
                    "specialty_id",
                    "license_number",
                    "license_state_code",
                    "specialty_name",
                )
                .eq("provider_id", provider_id)
                .single()
                .execute()
            )
        except Exception as e:
            # Handle Supabase 204 "Missing response" as 404
            error_str = str(e)
            code = getattr(e, "code", None)
            if (code and str(code) == "204") or (
                "204" in error_str and "Missing response" in error_str
            ):
                raise HTTPException(
                    status_code=404, detail=f"Provider '{provider_id}' not found"
                )
            raise

        if not provider_result.data:
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
            specialty_id=provider.get("specialty_id"),
            license_number=provider.get("license_number"),
            license_state_code=provider.get("license_state_code"),
            specialty_name=provider.get("specialty_name"),
        )

    async def get_provider_detail(self, provider_id: str) -> ProviderDetail:
        """Fetch detailed provider information with all procedures."""

        # Helper: Check if input looks like an NPI (10 digits)
        if provider_id.isdigit() and len(provider_id) == 10:
            print(
                f"[provider_service] Using NPI {provider_id} as provider_id directly (no resolution needed)"
            )

        # Get provider basic info and stats
        try:
            provider_result = self.supabase.rpc(
                "get_provider_detail", {"provider_id_input": provider_id}
            ).execute()
        except Exception as e:
            # Check for critical errors that should NOT trigger fallback
            error_str = str(e).lower()
            if "auth" in error_str or "connection" in error_str or "503" in error_str:
                print(f"[provider_service] CRITICAL RPC Error: {e}")
                raise HTTPException(
                    status_code=503, detail="Service unavailable due to upstream error"
                )

            # For other errors (potentially logic/missing data), log and attempt fallback
            print(
                f"[provider_service] RPC get_provider_detail failed (non-critical): {e}"
            )
            provider_result = None

        if (
            not provider_result
            or not provider_result.data
            or len(provider_result.data) == 0
        ):
            print(
                f"[provider_service] Provider {provider_id} not found via RPC, trying fallback to table"
            )
            # Fallback: Try to get raw provider data
            try:
                raw_provider = (
                    self.supabase.table("provider")
                    .select("*")
                    .eq("provider_id", provider_id)
                    .maybe_single()
                    .execute()
                )

                if raw_provider.data:
                    p = raw_provider.data
                    print(
                        f"[provider_service] WARN: Provider {provider_id} found via fallback (missing joined data). Returning basic profile."
                    )
                    # Construct ProviderDetail from raw data
                    # Note: We miss address, stats, etc.
                    full_name = (
                        f"{p.get('first_name', '')} {p.get('last_name', '')}".strip()
                    )
                    return ProviderDetail(
                        provider_id=p["provider_id"],
                        provider_name=full_name,
                        first_name=p.get("first_name"),
                        last_name=p.get("last_name"),
                        specialty_name=p.get("specialty_name"),
                        phone=None,
                        address=None,
                        city=None,
                        state=None,
                        zip_code=None,
                        total_procedures=0,
                        procedures=[],
                        data_completeness="basic",
                    )
            except Exception as fallback_error:
                print(
                    f"[provider_service] ERROR: Fallback table lookup failed: {fallback_error}"
                )

            # If fallback also failed, raise 404
            print(
                f"[provider_service] Provider {provider_id} not found in RPC or raw table. Returning 404."
            )
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
                .limit(
                    1
                )  # TODO a provider can work at multiple places for a given procedure so that query can
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

    async def search_doctors(self, query: str, limit: int = 8) -> List[DoctorSearchResult]:
        """Search providers by first + last name (or last + first) with location disambiguation."""
        tokens = [token for token in query.replace(",", " ").split() if token]
        if len(tokens) < 2:
            return []

        def escape_ilike_token(token: str) -> str:
            # Escape wildcard characters for PostgREST ilike filters to avoid unintended matches.
            return (
                token.replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_")
            )

        first_token = escape_ilike_token(tokens[0])
        last_token = escape_ilike_token(tokens[1])

        provider_result = (
            self.supabase.table("provider")
            .select("provider_id, first_name, last_name, credential, specialty_name")
            .or_(
                f"and(first_name.ilike.{first_token}%,last_name.ilike.{last_token}%),"
                f"and(first_name.ilike.{last_token}%,last_name.ilike.{first_token}%)"
            )
            .order("last_name")
            .order("first_name")
            .limit(limit)
            .execute()
        )

        provider_rows = provider_result.data or []
        if not provider_rows:
            return []

        provider_ids = [p.get("provider_id") for p in provider_rows if p.get("provider_id")]
        if not provider_ids:
            return []

        provider_map = {
            p["provider_id"]: p
            for p in provider_rows
            if p.get("provider_id")
        }

        # Intentional: only providers with locations are returned for org/city disambiguation.
        location_result = (
            self.supabase.table("provider_location")
            .select("provider_id, org_name, city, state, zip_code")
            .in_("provider_id", provider_ids)
            .execute()
        )

        locations = location_result.data or []
        results: List[DoctorSearchResult] = []

        for loc in locations:
            provider_id = loc.get("provider_id")
            if not provider_id or provider_id not in provider_map:
                continue

            provider = provider_map[provider_id]
            results.append(
                DoctorSearchResult(
                    provider_id=provider_id,
                    first_name=provider.get("first_name"),
                    last_name=provider.get("last_name"),
                    credential=provider.get("credential"),
                    specialty_name=provider.get("specialty_name"),
                    org_name=loc.get("org_name"),
                    city=loc.get("city"),
                    state=loc.get("state"),
                    zip_code=loc.get("zip_code"),
                )
            )

        results.sort(
            key=lambda item: (
                (item.last_name or "").lower(),
                (item.first_name or "").lower(),
                (item.org_name or "").lower(),
                (item.city or "").lower(),
            )
        )

        return results[:limit]
