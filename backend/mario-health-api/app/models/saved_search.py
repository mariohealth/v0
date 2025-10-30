"""Saved search models."""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class SearchFilters(BaseModel):
    """Search filter preferences."""

    price_range: Optional[List[float]] = Field(None, min_length=2, max_length=2)
    types: Optional[List[str]] = Field(default_factory=list)
    min_rating: Optional[float] = Field(None, ge=0, le=5)


class SavedSearch(BaseModel):
    """Saved search model."""

    id: Optional[str] = Field(None, description="Search ID (generated if not provided)")
    user_id: str = Field(..., description="User ID (from auth)")
    query: str = Field(..., max_length=200, description="Search query")
    location: Optional[str] = Field(None, max_length=100)
    filters: Optional[SearchFilters] = Field(default_factory=SearchFilters)
    alert_enabled: Optional[bool] = Field(
        False, description="Enable email alerts for new results"
    )
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "user_id": "user_123",
                "query": "MRI Brain",
                "location": "02115",
                "filters": {
                    "price_range": [100, 1000],
                    "types": ["hospital"],
                    "min_rating": 4.0,
                },
                "alert_enabled": True,
                "created_at": "2025-01-15T10:30:00Z",
            }
        }


class SavedSearchCreateRequest(BaseModel):
    """Request to create a saved search."""

    search: SavedSearch


class SavedSearchResponse(BaseModel):
    """Response for a saved search."""

    id: str
    success: bool = True


class SavedSearchesListResponse(BaseModel):
    """Response for list of saved searches."""

    searches: List[SavedSearch]
    success: bool = True


__all__ = [
    "SearchFilters",
    "SavedSearch",
    "SavedSearchCreateRequest",
    "SavedSearchResponse",
    "SavedSearchesListResponse",
]
