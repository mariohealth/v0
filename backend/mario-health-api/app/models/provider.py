"""Provider-related models."""

from pydantic import BaseModel, Field
from typing import List
from decimal import Decimal

class Provider(BaseModel):
    provider_id: str
    name_prefix: str
    first_name: str
    middle_name: str
    last_name: str
    name_suffix: str
    credential: str
    specialty_id: str
    license_number: str | None = None
    license_state_code: str | None = None
    specialty_name: str

class ProviderProcedurePricing(BaseModel):
    """Procedure pricing offered by a provider."""

    procedure_id: str
    procedure_name: str
    procedure_slug: str

    family_name: str
    family_slug: str
    category_name: str
    category_slug: str

    # Pricing info
    price: Decimal
    carrier_id: str
    carrier_name: str
    last_updated: str | None = None


class ProviderDetail(BaseModel):
    """Detailed information about a healthcare provider."""

    provider_id: str
    provider_name: str

    # Location info
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    latitude: float | None = None
    longitude: float | None = None

    # Contact info
    phone: str | None = None

    # Statistics
    total_procedures: int = 0
    avg_price: Decimal | None = None
    min_price: Decimal | None = None
    max_price: Decimal | None = None

    # All procedures offered by this provider
    procedures: List[ProviderProcedurePricing] = []

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "provider_id": "prov_001",
                "provider_name": "Mass General Hospital",
                "address": "55 Fruit St",
                "city": "Boston",
                "state": "MA",
                "zip_code": "02114",
                "latitude": 42.3631,
                "longitude": -71.0686,
                "phone": "(617) 726-2000",
                "total_procedures": 150,
                "avg_price": "450.00",
                "min_price": "45.00",
                "max_price": "2500.00",
                "procedures": [
                    {
                        "procedure_id": "proc_001",
                        "procedure_name": "Chest X-Ray (2 views)",
                        "procedure_slug": "chest-x-ray-2-views",
                        "family_name": "X-Ray",
                        "family_slug": "x-ray",
                        "category_name": "Radiology",
                        "category_slug": "radiology",
                        "price": "120.50",
                        "carrier_id": "carrier_001",
                        "carrier_name": "Aetna",
                        "last_updated": "2025-10-15",
                    }
                ],
            }
        }


class ProviderProcedureDetail(BaseModel):
    """Detailed provider-procedure information."""

    provider_id: str
    provider_name: str
    procedure_id: str
    procedure_name: str
    procedure_slug: str

    # Location info
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    phone: str | None = None
    website: str | None = None
    hours: str | None = None

    # Pricing
    estimated_costs: dict = Field(
        default_factory=dict
    )  # {facility_fee, professional_fee, supplies_fee, total}
    average_price: Decimal | None = None
    savings_vs_average: float | None = None  # Percentage

    # Provider info
    in_network: bool = False
    rating: float | None = None
    reviews: int = 0
    accreditation: str | None = None
    staff: str | None = None

    # MarioPoints
    mario_points: int = 0

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "provider_id": "prov_001",
                "provider_name": "LabFast Diagnostics",
                "procedure_id": "proc_001",
                "procedure_name": "MRI Scan (Brain)",
                "procedure_slug": "mri-scan-brain",
                "address": "123 Main St",
                "city": "Boston",
                "state": "MA",
                "zip_code": "02138",
                "phone": "(617) 555-1234",
                "website": "https://labfast.com",
                "hours": "Mon-Fri 8am-6pm",
                "estimated_costs": {
                    "facility_fee": "600.00",
                    "professional_fee": "250.00",
                    "supplies_fee": "0.00",
                    "total": "850.00",
                },
                "average_price": "1400.00",
                "savings_vs_average": 39.3,
                "in_network": True,
                "rating": 4.8,
                "reviews": 142,
                "accreditation": "ACR Accredited",
                "staff": "Board-certified radiologists",
                "mario_points": 100,
            }
        }
