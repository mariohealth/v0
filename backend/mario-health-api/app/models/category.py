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
