from fastapi import HTTPException
from supabase import Client
from app.models import Specialty, SpecialtiesResponse


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

