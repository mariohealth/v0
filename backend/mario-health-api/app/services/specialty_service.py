from fastapi import HTTPException
from supabase import Client
from app.models import Specialty, SpecialtiesResponse


class SpecialtyService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_all_specialties(self) -> SpecialtiesResponse:
        """Fetch all specialties."""

        result = (
                self.supabase.table("specialty_individual")
                .select("*")
                .execute()
            )

        specialties = [
            Specialty(
                id=s.get("id"),
                grouping=s.get("grouping"),
                display_name=s.get("display_name"),
                definition=s.get("definition"),
            )
            for s in result.data
        ]

        return SpecialtiesResponse(specialties=specialties)

