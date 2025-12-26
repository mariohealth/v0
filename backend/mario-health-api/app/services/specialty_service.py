from fastapi import HTTPException
from supabase import Client
from app.models import NuccSpecialty, Specialty, SpecialtiesResponse, SpecialtyDetailsResponse


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

