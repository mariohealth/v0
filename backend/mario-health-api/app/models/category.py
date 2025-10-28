from pydantic import BaseModel, Field
from typing import List


class Category(BaseModel):
    id: str
    name: str
    slug: str
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
                        "description": "Medical imaging procedures",
                        "family_count": 5
                    },
                    {
                        "id": "cat_002",
                        "name": "Laboratory",
                        "slug": "laboratory",
                        "description": "Lab tests and diagnostics",
                        "family_count": 12
                    }
                ]
            }
        }


# Keep existing models (Family, CategoryFamiliesResponse)
class Family(BaseModel):
    id: str
    name: str
    slug: str
    description: str | None = None
    procedure_count: int = Field(default=0, ge=0)


class CategoryFamiliesResponse(BaseModel):
    category_slug: str
    families: List[Family]
