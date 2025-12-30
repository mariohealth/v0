"""Specialty-related models."""
from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal

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


class ProviderLocation(BaseModel):
    """Provider location information."""
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    distance_miles: Optional[float] = None


class ProviderPricing(BaseModel):
    """Provider pricing information."""
    min_price: Decimal
    max_price: Decimal
    avg_price: Decimal


class SpecialtyProvider(BaseModel):
    """Provider offering a specialty service."""
    provider_id: str
    provider_name: str
    location: ProviderLocation
    pricing: Optional[ProviderPricing] = None


class SpecialtyInfo(BaseModel):
    """Basic specialty information."""
    id: str
    name: str
    slug: str


class SpecialtyProvidersMetadata(BaseModel):
    """Metadata for specialty providers search."""
    total_results: int
    search_radius: int


class SpecialtyProvidersResponse(BaseModel):
    """Response for GET /api/v1/specialties/{slug}/providers."""
    specialty: SpecialtyInfo
    providers: List[SpecialtyProvider]
    metadata: SpecialtyProvidersMetadata

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "specialty": {
                    "id": "4",
                    "name": "Cardiologist",
                    "slug": "cardiologist"
                },
                "providers": [
                    {
                        "provider_id": "1234567890",
                        "provider_name": "Dr. John Smith",
                        "location": {
                            "address": "123 Main St",
                            "city": "New York",
                            "state": "NY",
                            "zip_code": "10001",
                            "distance_miles": 2.5
                        },
                        "pricing": {
                            "min_price": 150.00,
                            "max_price": 300.00,
                            "avg_price": 225.00
                        }
                    }
                ],
                "metadata": {
                    "total_results": 15,
                    "search_radius": 25
                }
            }
        }
