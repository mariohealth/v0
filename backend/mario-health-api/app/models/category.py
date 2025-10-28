from pydantic import BaseModel, Field
from typing import List
from decimal import Decimal

class Category(BaseModel):
    id: str
    name: str
    slug: str
    emoji: str
    description: str | None = None
    family_count: int = Field(default=0, ge=0)


class CategoriesResponse(BaseModel):
    categories: List[Category]

    class Config:
        json_schema_extra = {
            "example": {
                "categories": [
                    {
                        "id": "cat_001",
                        "name": "Radiology",
                        "slug": "radiology",
                        "emoji": "",
                        "description": "Medical imaging procedures",
                        "family_count": 5
                    },
                    {
                        "id": "cat_002",
                        "name": "Laboratory",
                        "slug": "laboratory",
                        "emoji": "",
                        "description": "Lab tests and diagnostics",
                        "family_count": 12
                    }
                ]
            }
        }


class Family(BaseModel):
    id: str
    name: str
    slug: str
    description: str | None = None
    procedure_count: int = Field(default=0, ge=0)


class CategoryFamiliesResponse(BaseModel):
    category_slug: str
    families: List[Family]


class ProcedurePrice(BaseModel):
    carrier_id: str
    carrier_name: str
    price: Decimal
    currency: str = "USD"
    last_updated: str | None = None


class Procedure(BaseModel):
    id: str
    name: str
    description: str | None = None
    cpt_code: str | None = None
    # Add pricing info if you have it in your schema
    min_price: Decimal | None = None
    max_price: Decimal | None = None
    avg_price: Decimal | None = None
    price_count: int = Field(default=0, ge=0)  # Number of carrier prices available


class FamilyProceduresResponse(BaseModel):
    family_slug: str
    family_name: str
    procedures: List[Procedure]

    class Config:
        json_schema_extra = {
            "example": {
                "family_slug": "x-ray",
                "family_name": "X-Ray",
                "procedures": [
                    {
                        "id": "proc_001",
                        "name": "Chest X-Ray",
                        "description": "Two-view chest radiograph",
                        "cpt_code": "71046",
                        "min_price": "45.00",
                        "max_price": "250.00",
                        "avg_price": "120.50",
                        "price_count": 5
                    }
                ]
            }
        }

 # Detailed carrier pricing
class CarrierPrice(BaseModel):
    carrier_id: str
    carrier_name: str
    price: Decimal
    currency: str = "USD"
    plan_type: str | None = None  # e.g., "PPO", "HMO", "EPO"
    network_status: str | None = None  # e.g., "in-network", "out-of-network"
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
                "last_updated": "2025-10-15"
            }
        }


class ProcedureDetail(BaseModel):
    id: str
    name: str
    slug: str
    description: str | None = None
    cpt_code: str | None = None

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
                "description": "Two-view chest radiograph for diagnostic purposes",
                "cpt_code": "71046",
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
                "carrier_prices": [
                    {
                        "carrier_id": "carrier_001",
                        "carrier_name": "Aetna",
                        "price": "120.50",
                        "currency": "USD",
                        "plan_type": "PPO",
                        "network_status": "in-network"
                    }
                ]
            }
        }