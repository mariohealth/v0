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

    class Config:
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

    class Config:
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

    class Config:
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
