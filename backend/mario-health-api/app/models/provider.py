"""Provider-related models."""
from pydantic import BaseModel, Field
from typing import List
from decimal import Decimal


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

    class Config:
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
                        "last_updated": "2025-10-15"
                    }
                ]
            }
        }
