"""Category-related models."""
from pydantic import BaseModel, Field
from typing import List


class Category(BaseModel):
    """Single category with family count."""
    id: str
    name: str
    slug: str
    emoji: str
    description: str | None = None
    family_count: int = Field(default=0, ge=0)


class CategoriesResponse(BaseModel):
    """Response for GET /api/v1/categories."""
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
                    }
                ]
            }
        }
