"""Search-related models."""
from pydantic import BaseModel, Field
from typing import List
from decimal import Decimal


class SearchResult(BaseModel):
    """Individual search result."""
    procedure_id: str
    procedure_name: str
    procedure_slug: str

    family_name: str
    family_slug: str
    category_name: str
    category_slug: str

    best_price: Decimal
    avg_price: Decimal
    price_range: str

    provider_count: int
    nearest_provider: str | None = None
    nearest_distance_miles: float | None = None


class SearchResponse(BaseModel):
    """Response for GET /api/v1/search."""
    query: str
    location: str | None = None
    radius_miles: int = 25
    results_count: int
    results: List[SearchResult]

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "query": "chest x-ray",
                "location": "02138",
                "radius_miles": 25,
                "results_count": 2,
                "results": [
                    {
                        "procedure_id": "proc_001",
                        "procedure_name": "Chest X-Ray (2 views)",
                        "procedure_slug": "chest-x-ray-2-views",
                        "family_name": "X-Ray",
                        "family_slug": "x-ray",
                        "category_name": "Radiology",
                        "category_slug": "radiology",
                        "best_price": "45.00",
                        "avg_price": "120.50",
                        "price_range": "$45 - $250",
                        "provider_count": 12,
                        "nearest_provider": "Mass General Hospital",
                        "nearest_distance_miles": 2.3
                    }
                ]
            }
        }
