"""Specialty-related models."""
from pydantic import BaseModel, Field
from typing import List

class Specialty(BaseModel):
    """Specialty-related model."""
    id: str
    name: str
    slug: str
    is_used: bool
    description: str

class SpecialtiesResponse(BaseModel):
    """Response for GET /api/v1/specialties."""
    specialties: List[Specialty]

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "specialties": [
                    {
                        "id": "1",
                        "name": "Cardiologist",
                        "slug": "cardiologist",
                        "is_used": True,
                        "description": "Cardiologist bla bla",
                    }
                ]
            }
        }

class NuccSpecialty(BaseModel):
    """Single NUCC specialty."""
    id: str
    grouping: str | None = None
    display_name: str
    definition: str | None = None


class NuccSpecialtiesResponse(BaseModel):
    """Response for GET /api/v1/nucc_specialties."""
    specialties: List[NuccSpecialty]

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

class SpecialtyDetailsResponse(BaseModel):
    """Response for GET /api/v1/specialty/{slug}."""
    specialty_slug: str
    nucc_specialties: List[NuccSpecialty]

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "specialty_slug": 'cardiologist',
                "nucc_specialties": [
                    {
                        "id": "bla",
                        "grouping": "Bla",
                        "display_name": "bla",
                        "definition": "Cardiologist bla bla",
                    }
                ]
            }
        }
