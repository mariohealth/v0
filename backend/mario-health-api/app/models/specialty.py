"""Specialty-related models."""
from pydantic import BaseModel, Field
from typing import List


class Specialty(BaseModel):
    """Single specialty."""
    id: str
    grouping: str | None = None
    display_name: str
    definition: str | None = None


class SpecialtiesResponse(BaseModel):
    """Response for GET /api/v1/specialties."""
    specialties: List[Specialty]

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "specialties": [
                    {
                        "id": "bla",
                        "grouping": "Bla",
                        "display_name": "bla",
                        "definition": "bla",
                    }
                ]
            }
        }
