"""Family-related models."""
from pydantic import BaseModel, Field
from typing import List


class Family(BaseModel):
    """Single procedure family with procedure count."""
    id: str
    name: str
    slug: str
    description: str | None = None
    procedure_count: int = Field(default=0, ge=0)


class CategoryFamiliesResponse(BaseModel):
    """Response for GET /api/v1/categories/{slug}/families."""
    category_slug: str
    families: List[Family]

    class Config:
        json_schema_extra = {
            "example": {
                "category_slug": "radiology",
                "families": [
                    {
                        "id": "fam_001",
                        "name": "X-Ray",
                        "slug": "x-ray",
                        "description": "Diagnostic X-ray imaging",
                        "procedure_count": 24
                    }
                ]
            }
        }
