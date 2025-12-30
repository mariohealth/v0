from fastapi import HTTPException
from supabase import Client
from decimal import Decimal
from typing import Optional
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
    ProviderPricing
)


class SpecialtyService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_all_specialties(self) -> SpecialtiesResponse:
        """Fetch all specialties."""

        result = (
                self.supabase.table("specialty")
                .select("*")
                .execute()
            )

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

    async def get_specialties_details(self, specialty_slug: str) -> SpecialtyDetailsResponse:
        """Fetch all NUCC specialities mapped to a given specialty."""

        # Call the RPC function
        result = self.supabase.rpc(
            "get_specialty_details",
            {"specialty_slug_input": specialty_slug},
        ).execute()

        if not result.data:
            # Verify specialty exists
            specialty_check = self.supabase.table("specialty") \
                .select("id") \
                .eq("slug", specialty_slug) \
                .limit(1) \
                .execute()

            if not specialty_check.data:
                raise HTTPException(
                    status_code=404,
                    detail=f"Specialty '{specialty_slug}' not found",
                )

            # Specialty exists but has no NUCC specialties mapped to it
            return SpecialtyDetailsResponse(
                specialty_slug=specialty_slug,
                nucc_specialties=[]
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
            specialty_slug=specialty_slug,
            nucc_specialties=nucc_specialties
        )

    async def get_specialty_providers(
        self,
        specialty_slug: str,
        zip_code: str,
        radius_miles: int = 25,
        limit: int = 20
    ) -> SpecialtyProvidersResponse:
        """Fetch providers for a specialty with location filtering and pricing.
        
        Uses a single SQL query to:
        - Validate specialty exists
        - Resolve zip code to coordinates
        - Find providers via specialty → specialty_map → taxonomy → provider
        - Calculate distance in SQL (haversine via PostGIS)
        - Aggregate pricing from specialty_procedure_map + procedure_pricing
        - Return sorted by distance, limited to top N
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
                status_code=404,
                detail=f"Specialty '{specialty_slug}' not found"
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
                status_code=400,
                detail=f"ZIP code '{zip_code}' not found"
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
        providers = await self._get_specialty_providers_query(
            specialty_id=specialty_id,
            search_lat=search_lat,
            search_lon=search_lon,
            radius_miles=radius_miles,
            limit=limit
        )
        
        return SpecialtyProvidersResponse(
            specialty=SpecialtyInfo(
                id=specialty_data["id"],
                name=specialty_data["name"],
                slug=specialty_data["slug"]
            ),
            providers=providers,
            metadata=SpecialtyProvidersMetadata(
                total_results=len(providers),
                search_radius=radius_miles
            )
        )
    
    async def _get_specialty_providers_query(
        self,
        specialty_id: str,
        search_lat: float,
        search_lon: float,
        radius_miles: int,
        limit: int
    ) -> list[SpecialtyProvider]:
        """Query providers using efficient PostgREST queries.
        
        This still avoids N+1 queries by:
        1. Getting all taxonomy codes for specialty (1 query)
        2. Getting all nearby providers (1 query with geography filter)
        3. Getting all pricing for representative procedure (1 query)
        4. Aggregating in Python
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
            return []
        
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
        
        # Note: PostgREST doesn't support ST_Distance directly in filters
        # We'll need to fetch more providers and filter/sort in Python
        # This is a limitation of the fallback approach
        
        # Get providers with matching taxonomy
        # We'll fetch more than needed and filter by distance in Python
        provider_result = (
            self.supabase.table("provider")
            .select("npi, name, taxonomy_code")
            .in_("taxonomy_code", taxonomy_codes)
            .limit(limit * 10)  # Fetch more to account for distance filtering
            .execute()
        )
        
        provider_npis = [p["npi"] for p in provider_result.data]
        provider_map = {p["npi"]: p["name"] for p in provider_result.data}
        
        if not provider_npis:
            return []
        
        # Get provider locations
        location_result = (
            self.supabase.table("provider_location")
            .select("npi, address_line_1, city, state, zip_code, latitude, longitude")
            .in_("npi", provider_npis)
            .execute()
        )
        
        # Calculate distances and filter by radius
        from math import radians, sin, cos, sqrt, atan2
        
        def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
            """Calculate distance between two points using Haversine formula (in miles)."""
            R = 3958.8  # Earth radius in miles
            
            lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            
            a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
            c = 2 * atan2(sqrt(a), sqrt(1-a))
            
            return R * c
        
        nearby_locations = []
        for loc in location_result.data:
            if loc.get("latitude") and loc.get("longitude"):
                distance = haversine_distance(
                    search_lat, search_lon,
                    float(loc["latitude"]), float(loc["longitude"])
                )
                if distance <= radius_miles:
                    nearby_locations.append({
                        "npi": loc["npi"],
                        "address": loc.get("address_line_1"),
                        "city": loc.get("city"),
                        "state": loc.get("state"),
                        "zip_code": loc.get("zip_code"),
                        "distance": distance
                    })
        
        # Sort by distance and limit
        nearby_locations.sort(key=lambda x: x["distance"])
        nearby_locations = nearby_locations[:limit]
        
        final_npis = [loc["npi"] for loc in nearby_locations]
        
        if not final_npis:
            return []
        
        # Get pricing for these providers (single query)
        pricing_map = {}
        if representative_procedure_id:
            pricing_result = (
                self.supabase.table("procedure_pricing")
                .select("provider_id, price")
                .eq("procedure_id", representative_procedure_id)
                .in_("provider_id", final_npis)
                .execute()
            )
            
            # Aggregate pricing per provider
            from collections import defaultdict
            provider_prices = defaultdict(list)
            for p in pricing_result.data:
                provider_prices[p["provider_id"]].append(float(p["price"]))
            
            for provider_id, prices in provider_prices.items():
                pricing_map[provider_id] = {
                    "min_price": min(prices),
                    "max_price": max(prices),
                    "avg_price": sum(prices) / len(prices)
                }
        
        # Build final provider list
        providers = []
        for loc in nearby_locations:
            npi = loc["npi"]
            
            location = ProviderLocation(
                address=loc.get("address"),
                city=loc.get("city"),
                state=loc.get("state"),
                zip_code=loc.get("zip_code"),
                distance_miles=round(loc["distance"], 1)
            )
            
            pricing = None
            if npi in pricing_map:
                p = pricing_map[npi]
                pricing = ProviderPricing(
                    min_price=Decimal(str(p["min_price"])),
                    max_price=Decimal(str(p["max_price"])),
                    avg_price=Decimal(str(p["avg_price"]))
                )
            
            providers.append(SpecialtyProvider(
                provider_id=npi,
                provider_name=provider_map.get(npi, "Unknown Provider"),
                location=location,
                pricing=pricing
            ))
        
        return providers

