"""Billing code-related models (CPT, HCPCS, G-codes, ICD-10-PCS, etc.)."""
from pydantic import BaseModel, Field
from typing import List, Literal
from decimal import Decimal
from enum import Enum


class CodeType(str, Enum):
    """Supported medical billing code types."""
    CPT = "CPT"
    HCPCS = "HCPCS"
    G_CODE = "G-CODE"
    ICD_10_PCS = "ICD-10-PCS"
    ICD_10_CM = "ICD-10-CM"
    CDT = "CDT"
    DRG = "DRG"


class BillingCodeProcedureMapping(BaseModel):
    """Procedure mapped to a billing code."""
    procedure_id: str
    procedure_name: str
    procedure_slug: str
    procedure_description: str | None = None

    family_name: str
    family_slug: str
    category_name: str
    category_slug: str

    # Pricing summary for this procedure
    min_price: Decimal | None = None
    max_price: Decimal | None = None
    avg_price: Decimal | None = None
    provider_count: int = 0

    # Code metadata
    code_type: CodeType
    is_primary: bool = False


class BillingCodeDetail(BaseModel):
    """Detailed information about a medical billing code."""
    code: str
    code_type: CodeType | None = None  # None if searching across all types
    description: str | None = None

    # All procedures that use this billing code
    procedures: List[BillingCodeProcedureMapping]

    # Aggregate pricing across all procedures
    overall_min_price: Decimal | None = None
    overall_max_price: Decimal | None = None
    overall_avg_price: Decimal | None = None
    total_providers: int = 0

    class Config:
        json_schema_extra = {
            "example": {
                "code": "71046",
                "code_type": "CPT",
                "description": "Chest X-ray, 2 views",
                "procedures": [
                    {
                        "procedure_id": "proc_001",
                        "procedure_name": "Chest X-Ray (2 views)",
                        "procedure_slug": "chest-x-ray-2-views",
                        "procedure_description": "Two-view chest radiograph",
                        "family_name": "X-Ray",
                        "family_slug": "x-ray",
                        "category_name": "Radiology",
                        "category_slug": "radiology",
                        "min_price": "45.00",
                        "max_price": "250.00",
                        "avg_price": "120.50",
                        "provider_count": 12,
                        "code_type": "CPT",
                        "is_primary": True
                    }
                ],
                "overall_min_price": "45.00",
                "overall_max_price": "250.00",
                "overall_avg_price": "120.50",
                "total_providers": 12
            }
        }

