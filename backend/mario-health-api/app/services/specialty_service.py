from fastapi import HTTPException
from supabase import Client
from decimal import Decimal
from typing import Optional
import os
from app.models import (
    NuccSpecialty,
    Specialty,
    SpecialtiesResponse,
    SpecialtyDetailsResponse,
    SpecialtyProvidersResponse,
    SpecialtyProvider,
    SpecialtyInfo,
    SpecialtyProvidersMetadata,
    ProviderLocation,
    ProviderPricing,
)

USE_PROVIDER_SEARCH_MV = os.getenv("USE_PROVIDER_SEARCH_MV", "false").lower() in (
    "1",
    "true",
    "yes",
    "on",
)


class SpecialtyService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_all_specialties(self) -> SpecialtiesResponse:
        """Fetch all specialties."""

        result = self.supabase.table("specialty").select("*").execute()

        specialties = [
            Specialty(
                id=s.get("id"),
                name=s.get("name"),
                slug=s.get("slug"),
                is_used=s.get("is_used"),
                description=s.get("description"),
            )
            for s in result.data
        ]

        return SpecialtiesResponse(specialties=specialties)

    async def get_specialties_details(
        self, specialty_slug: str
    ) -> SpecialtyDetailsResponse:
        """Fetch all NUCC specialities mapped to a given specialty."""

        # Call the RPC function
        result = self.supabase.rpc(
            "get_specialty_details",
            {"specialty_slug_input": specialty_slug},
        ).execute()

        if not result.data:
            # Verify specialty exists
            specialty_check = (
                self.supabase.table("specialty")
                .select("id")
                .eq("slug", specialty_slug)
                .limit(1)
                .execute()
            )

            if not specialty_check.data:
                raise HTTPException(
                    status_code=404,
                    detail=f"Specialty '{specialty_slug}' not found",
                )

            # Specialty exists but has no NUCC specialties mapped to it
            return SpecialtyDetailsResponse(
                specialty_slug=specialty_slug, nucc_specialties=[]
            )

        nucc_specialties = [
            NuccSpecialty(
                id=s.get("taxonomy_id"),
                grouping=s.get("taxonomy_grouping"),
                display_name=s.get("taxonomy_name"),
                definition=s.get("taxonomy_description"),
            )
            for s in result.data
        ]

        return SpecialtyDetailsResponse(
            specialty_slug=specialty_slug, nucc_specialties=nucc_specialties
        )

    async def get_specialty_providers(
        self,
        specialty_slug: str,
        zip_code: str,
        radius_miles: int = 25,
        limit: int = 20,
    ) -> SpecialtyProvidersResponse:
        """Fetch providers for a specialty with location filtering and pricing.

        Query flow:
        1. Validate specialty exists
        2. Resolve zip code to coordinates
        3. Find providers via specialty → specialty_map → taxonomy → provider
        4. Apply bounding-box prefilter on provider_location (performance)
        5. Calculate haversine distance and filter by radius
        6. Sort by distance, limit to top N
        7. Join pricing data via organization (org_id)
        8. Optional: if USE_PROVIDER_SEARCH_MV is enabled, read from provider_search_mv

        Pricing model:
        - Pricing is stored at ORGANIZATION/FACILITY level (procedure_pricing.org_id)
        - Providers work at organizations (provider_location.org_id)
        - Multiple providers at same facility share same pricing
        - Pricing may be null if no data exists for that organization

        Edge cases handled:
        - Providers with no location data (skipped)
        - All providers outside search radius (empty results)
        - Organizations with no pricing data (pricing=null)

        Args:
            specialty_slug: Specialty identifier (e.g., 'cardiologist')
            zip_code: Search center ZIP code (required)
            radius_miles: Search radius in miles (default: 25, max: 100)
            limit: Max providers to return (default: 20, max: 100)

        Returns:
            SpecialtyProvidersResponse with providers sorted by distance
        """

        # Step 1: Verify specialty exists and get specialty info
        specialty_result = (
            self.supabase.table("specialty")
            .select("id, name, slug")
            .eq("slug", specialty_slug)
            .limit(1)
            .execute()
        )

        if not specialty_result.data:
            raise HTTPException(
                status_code=404, detail=f"Specialty '{specialty_slug}' not found"
            )

        specialty_data = specialty_result.data[0]
        specialty_id = specialty_data["id"]

        # Step 2: Validate zip code exists
        zip_result = (
            self.supabase.table("zip_codes")
            .select("zip_code, latitude, longitude, location")
            .eq("zip_code", zip_code)
            .limit(1)
            .execute()
        )

        if not zip_result.data:
            raise HTTPException(
                status_code=400, detail=f"ZIP code '{zip_code}' not found"
            )

        zip_data = zip_result.data[0]
        search_lat = float(zip_data["latitude"])
        search_lon = float(zip_data["longitude"])

        # Step 3: Query providers with pricing
        # Uses multiple efficient queries to avoid N+1:
        # 1. Get taxonomy codes for specialty (1 query)
        # 2. Get nearby provider locations (1 query)
        # 3. Get pricing for representative procedure (1 query)
        # 4. Aggregate and filter in Python
        providers, total_providers_found = await self._get_specialty_providers_query(
            specialty_id=specialty_id,
            search_lat=search_lat,
            search_lon=search_lon,
            radius_miles=radius_miles,
            limit=limit,
        )

        # Calculate pricing coverage for metadata
        providers_returned = len(providers)
        providers_with_pricing = sum(1 for p in providers if p.pricing is not None)
        pricing_coverage_pct = (
            round(providers_with_pricing / providers_returned * 100, 1)
            if providers_returned > 0
            else 0.0
        )

        return SpecialtyProvidersResponse(
            specialty=SpecialtyInfo(
                id=specialty_data["id"],
                name=specialty_data["name"],
                slug=specialty_data["slug"],
            ),
            providers=providers,
            metadata=SpecialtyProvidersMetadata(
                total_providers_found=total_providers_found,
                providers_returned=providers_returned,
                search_radius=radius_miles,
                providers_with_pricing=providers_with_pricing,
                pricing_coverage_pct=pricing_coverage_pct,
            ),
        )

    async def _get_specialty_providers_query(
        self,
        specialty_id: str,
        search_lat: float,
        search_lon: float,
        radius_miles: int,
        limit: int,
    ) -> tuple[list[SpecialtyProvider], int]:
        """Query providers using efficient PostgREST queries.

        This still avoids N+1 queries by:
        1. Getting all taxonomy codes for specialty (1 query)
        2. Getting all providers with matching specialty_id (1 query)
        3. Getting all locations for those providers (1 query)
        4. Getting all pricing for representative procedure (1 query)
        5. Aggregating and filtering in Python

        Returns:
            Tuple of (providers_list, total_found_within_radius)
        """

        # Get taxonomy codes for this specialty
        taxonomy_result = (
            self.supabase.table("specialty_map")
            .select("taxonomy_id")
            .eq("specialty_id", specialty_id)
            .execute()
        )

        taxonomy_codes = [row["taxonomy_id"] for row in taxonomy_result.data]

        if not taxonomy_codes:
            return [], 0

        # Get representative procedure for this specialty
        proc_map_result = (
            self.supabase.table("specialty_procedure_map")
            .select("procedure_id")
            .eq("specialty_id", specialty_id)
            .eq("is_representative", True)
            .eq("visit_type", "standard")
            .limit(1)
            .execute()
        )

        representative_procedure_id = None
        if proc_map_result.data:
            representative_procedure_id = proc_map_result.data[0]["procedure_id"]

        # Get providers with matching specialty_id (which corresponds to taxonomy_id)
        # Fetch more than needed to account for distance filtering
        if USE_PROVIDER_SEARCH_MV:
            provider_result = (
                self.supabase.table("provider_search_mv")
                .select(
                    "provider_id, first_name, last_name, credential, specialty_id, "
                    "org_id, provider_name, address, city, state, zip_code, latitude, longitude"
                )
                .in_("specialty_id", taxonomy_codes)
                .order("provider_id")
                .limit(limit * 10)  # align with non-MV path
                .execute()
            )
        else:
            provider_result = (
                self.supabase.table("provider")
                .select("provider_id, first_name, last_name, credential, specialty_id")
                .in_("specialty_id", taxonomy_codes)
                .order("provider_id")
                .limit(limit * 10)  # Fetch more to account for distance filtering
                .execute()
            )

        if not provider_result.data:
            # Log when no providers found for specialty
            from app.middleware.logging import log_structured

            log_structured(
                severity="INFO",
                message="No providers found for specialty",
                specialty_id=specialty_id,
                taxonomy_codes=taxonomy_codes,
                use_provider_search_mv=USE_PROVIDER_SEARCH_MV,
            )
            return [], 0

        candidate_provider_count = len(provider_result.data)
        provider_ids = [p["provider_id"] for p in provider_result.data]

        # Build provider name map (first_name + last_name + credential)
        provider_name_map = {}
        for p in provider_result.data:
            name_parts = [p.get("first_name", ""), p.get("last_name", "")]
            if p.get("credential"):
                name_parts.append(p["credential"])
            provider_name_map[p["provider_id"]] = (
                " ".join(filter(None, name_parts)).strip() or "Unknown Provider"
            )

        if not provider_ids:
            return [], 0

        # Calculate bounding box for performance optimization
        # Approximate: 1 degree latitude ≈ 69 miles, 1 degree longitude ≈ 69 * cos(lat) miles
        from math import cos, radians

        lat_delta = radius_miles / 69.0
        lng_delta = radius_miles / (69.0 * abs(cos(radians(search_lat))))

        min_lat = search_lat - lat_delta
        max_lat = search_lat + lat_delta
        min_lng = search_lon - lng_delta
        max_lng = search_lon + lng_delta

        # Debug logging for bbox and zip resolution (helps diagnose radius anomalies)
        from app.middleware.logging import log_structured
        log_structured(
            severity="INFO",
            message="Specialty provider bbox debug",
            specialty_id=specialty_id,
            search_lat=search_lat,
            search_lon=search_lon,
            radius_miles=radius_miles,
            min_lat=min_lat,
            max_lat=max_lat,
            min_lng=min_lng,
            max_lng=max_lng,
        )

        # Get provider locations (including org_id for pricing join)
        # Apply bounding box prefilter for performance
        if USE_PROVIDER_SEARCH_MV:
            # Data already includes location/org info; apply bbox in-memory
            location_rows = [
                row
                for row in provider_result.data
                if row.get("latitude") is not None
                and row.get("longitude") is not None
                and min_lat <= float(row["latitude"]) <= max_lat
                and min_lng <= float(row["longitude"]) <= max_lng
            ]
        else:
            location_result = (
                self.supabase.table("provider_location")
                .select(
                    "provider_id, provider_name, org_id, address, city, state, zip_code, latitude, longitude"
                )
                .in_("provider_id", provider_ids)
                .gte("latitude", min_lat)
                .lte("latitude", max_lat)
                .gte("longitude", min_lng)
                .lte("longitude", max_lng)
                .execute()
            )
            location_rows = location_result.data

        bbox_filtered_count = len(location_rows)

        # Log if providers have no location data (graceful degradation)
        providers_without_location = candidate_provider_count - bbox_filtered_count
        if providers_without_location > 0:
            from app.middleware.logging import log_structured

            log_structured(
                severity="WARNING",
                message="Providers without location data",
                specialty_id=specialty_id,
                providers_without_location=providers_without_location,
                candidate_providers=candidate_provider_count,
                use_provider_search_mv=USE_PROVIDER_SEARCH_MV,
            )

        # Calculate distances and filter by radius
        from math import radians, sin, cos, sqrt, atan2

        def haversine_distance(
            lat1: float, lon1: float, lat2: float, lon2: float
        ) -> float:
            """Calculate distance between two points using Haversine formula (in miles)."""
            R = 3958.8  # Earth radius in miles

            lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
            dlat = lat2 - lat1
            dlon = lon2 - lon1

            a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
            c = 2 * atan2(sqrt(a), sqrt(1 - a))

            return R * c

        nearby_locations = []
        for loc in location_rows:
            if loc.get("latitude") and loc.get("longitude"):
                distance = haversine_distance(
                    search_lat,
                    search_lon,
                    float(loc["latitude"]),
                    float(loc["longitude"]),
                )
                if distance <= radius_miles:
                    nearby_locations.append(
                        {
                            "provider_id": loc["provider_id"],
                            "org_id": loc.get(
                                "org_id"
                            ),  # Include org_id for pricing join
                            "provider_name": loc.get("provider_name")
                            or provider_name_map.get(
                                loc["provider_id"], "Unknown Provider"
                            ),
                            "address": loc.get("address"),
                            "city": loc.get("city"),
                            "state": loc.get("state"),
                            "zip_code": loc.get("zip_code"),
                            "distance": distance,
                        }
                    )

        # Sort by distance and limit
        nearby_locations.sort(key=lambda x: x["distance"])
        total_within_radius = len(nearby_locations)
        nearby_locations = nearby_locations[:limit]

        # Log search funnel metrics (counts should be monotonic w.r.t radius)
        from app.middleware.logging import log_structured

        log_structured(
            severity="INFO",
            message="Specialty provider search funnel",
            specialty_id=specialty_id,
            candidate_providers=candidate_provider_count,
            bbox_filtered=bbox_filtered_count,
            within_radius=total_within_radius,
            returned_after_limit=len(nearby_locations),
            search_radius_miles=radius_miles,
            limit=limit,
            use_provider_search_mv=USE_PROVIDER_SEARCH_MV,
        )

        # Collect org_ids (not provider_ids) for pricing join
        org_ids_with_location = {}  # Map org_id -> location data
        for loc in nearby_locations:
            if loc.get("org_id"):
                org_ids_with_location[loc["org_id"]] = loc

        if not nearby_locations:
            return [], 0

        # Get pricing for these organizations (single query)
        # Pricing is associated with org_id in procedure_pricing, not provider_id
        pricing_map = {}  # Map org_id -> pricing data
        if representative_procedure_id and org_ids_with_location:
            org_ids_list = list(org_ids_with_location.keys())
            pricing_result = (
                self.supabase.table("procedure_pricing")
                .select("org_id, price")
                .eq("procedure_id", representative_procedure_id)
                .in_("org_id", org_ids_list)
                .execute()
            )

            # Aggregate pricing per organization
            from collections import defaultdict

            org_prices = defaultdict(list)
            for p in pricing_result.data:
                if p.get("org_id"):
                    org_prices[p["org_id"]].append(float(p["price"]))

            for org_id, prices in org_prices.items():
                pricing_map[org_id] = {
                    "min_price": min(prices),
                    "max_price": max(prices),
                    "avg_price": sum(prices) / len(prices),
                }

        # Build final provider list
        providers = []
        providers_with_pricing = 0

        for loc in nearby_locations:
            provider_id = loc["provider_id"]
            org_id = loc.get("org_id")

            location = ProviderLocation(
                address=loc.get("address"),
                city=loc.get("city"),
                state=loc.get("state"),
                zip_code=loc.get("zip_code"),
                distance_miles=round(loc["distance"], 1),
            )

            # Join pricing by org_id (pricing is at organization level)
            pricing = None
            if org_id and org_id in pricing_map:
                p = pricing_map[org_id]
                pricing = ProviderPricing(
                    min_price=Decimal(str(p["min_price"])),
                    max_price=Decimal(str(p["max_price"])),
                    avg_price=Decimal(str(p["avg_price"])),
                )
                providers_with_pricing += 1

            providers.append(
                SpecialtyProvider(
                    provider_id=provider_id,
                    provider_name=loc["provider_name"],
                    location=location,
                    pricing=pricing,
                )
            )

        # Debug logging for pricing coverage
        from app.middleware.logging import log_structured

        log_structured(
            severity="INFO",
            message="Specialty provider pricing aggregation",
            specialty_id=specialty_id,
            total_providers=len(providers),
            providers_with_pricing=providers_with_pricing,
            pricing_coverage_pct=(
                round(providers_with_pricing / len(providers) * 100, 1)
                if providers
                else 0
            ),
        )

        return providers, total_within_radius
