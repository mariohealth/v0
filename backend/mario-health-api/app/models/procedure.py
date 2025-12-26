"""Procedure-related models."""

from pydantic import BaseModel, Field
from typing import List
from decimal import Decimal


class CarrierPrice(BaseModel):
    """Individual carrier pricing."""

    carrier_id: str
    carrier_name: str
    price: Decimal
    currency: str = "USD"
    plan_type: str | None = None
    network_status: str | None = None
    last_updated: str | None = None

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "carrier_id": "carrier_001",
                "carrier_name": "Aetna",
                "price": "120.50",
                "currency": "USD",
                "plan_type": "PPO",
                "network_status": "in-network",
                "last_updated": "2025-10-15",
            }
        }


class Procedure(BaseModel):
    """Procedure summary (used in family listings)."""

    id: str
    name: str
    description: str | None = None
    min_price: Decimal | None = None
    max_price: Decimal | None = None
    avg_price: Decimal | None = None
    price_count: int = Field(default=0, ge=0)


class ProcedureDetail(BaseModel):
    """Detailed procedure information with all pricing."""

    id: str
    name: str
    slug: str
    description: str | None = None

    # Family context
    family_id: str
    family_name: str
    family_slug: str

    # Category context
    category_id: str
    category_name: str
    category_slug: str

    # Pricing summary
    min_price: Decimal | None = None
    max_price: Decimal | None = None
    avg_price: Decimal | None = None
    median_price: Decimal | None = None

    # All carrier prices
    carrier_prices: List[CarrierPrice] = []

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "id": "proc_001",
                "name": "Chest X-Ray (2 views)",
                "slug": "chest-x-ray-2-views",
                "description": "Two-view chest radiograph",
                "family_id": "fam_001",
                "family_name": "X-Ray",
                "family_slug": "x-ray",
                "category_id": "cat_001",
                "category_name": "Radiology",
                "category_slug": "radiology",
                "min_price": "45.00",
                "max_price": "250.00",
                "avg_price": "120.50",
                "median_price": "115.00",
                "carrier_prices": [],
            }
        }


class FamilyProceduresResponse(BaseModel):
    """Response for GET /api/v1/families/{slug}/procedures."""

    family_slug: str
    family_name: str
    family_description: str | None = None
    procedures: List[Procedure]

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "family_slug": "x-ray",
                "family_name": "X-Ray",
                "family_description": "Diagnostic X-ray imaging procedures",
                "procedures": [
                    {
                        "id": "proc_001",
                        "name": "Chest X-Ray (2 views)",
                        "description": "Two-view chest radiograph",
                        "min_price": "45.00",
                        "max_price": "250.00",
                        "avg_price": "120.50",
                        "price_count": 5,
                    }
                ],
            }
        }


class ProcedureProvider(BaseModel):
    """Provider offering a specific procedure."""

    provider_id: str
    provider_name: str
    in_network: bool = False
    rating: float | None = None
    reviews: int = 0
    distance: float | None = None  # Distance in miles
    price_estimate: Decimal
    price_average: Decimal | None = None
    price_relative_to_average: str | None = None  # e.g., "15% below average"
    mario_points: int = 0
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None


class ProcedureProvidersResponse(BaseModel):
    """Response for GET /api/v1/procedures/{slug}/providers."""

    procedure_name: str
    procedure_slug: str
    providers: List[ProcedureProvider]

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "procedure_name": "MRI Scan (Brain)",
                "procedure_slug": "mri-scan-brain",
                "providers": [
                    {
                        "provider_id": "prov_001",
                        "provider_name": "City Medical Imaging",
                        "in_network": True,
                        "rating": 4.8,
                        "reviews": 142,
                        "distance": 1.4,
                        "price_estimate": "850.00",
                        "price_average": "1400.00",
                        "price_relative_to_average": "39% below average",
                        "mario_points": 100,
                        "address": "123 Main St",
                        "city": "Boston",
                        "state": "MA",
                        "zip_code": "02138",
                    }
                ],
            }
        }

class ProcedureOrg(BaseModel):
    """Orgs offering a specific procedure."""

    procedure_id: str
    org_id: str
    carrier_id: str
    carrier_name: str
    count_provider: int
    min_price: Decimal
    max_price: Decimal
    avg_price: Decimal
    org_name: str
    org_type: str
    address: str
    city: str
    state: str
    zip_code: str
    latitude: float
    longitude: float
    phone: str


class ProcedureOrgsResponse(BaseModel):
    """Response for GET /api/v1/procedures/{slug}/orgs."""

    procedure_name: str
    procedure_slug: str
    orgs: List[ProcedureOrg]

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "procedure_name": "MRI Scan (Brain)",
                "procedure_slug": "mri-scan-brain",
                "orgs": [
                    {
                    "procedure_id": "proc_brain_mri",
                    "org_id": "nyc_001",
                    "carrier_id": "cigna_national_oap",
                    "carrier_name": "Cigna",
                    "count_provider": 12,
                    "min_price": 45,
                    "max_price": 145,
                    "avg_price": 112,
                    "org_name": "bla",
                    "org_type": "bla",
                    "address": "bla",
                    "city": "bla",
                    "state": "bla",
                    "zip_code": "bla",
                    "latitude": 40.7648658,
                    "longitude": -73.9539836,
                    "phone": "bla",
                    }
                ],
            }
        }
