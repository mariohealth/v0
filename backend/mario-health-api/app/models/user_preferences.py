"""User preferences models."""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class SavedLocation(BaseModel):
    """Saved location model."""
    id: str
    name: str
    zip: str
    radius: int = Field(default=50, ge=5, le=100)


class Notifications(BaseModel):
    """Notification preferences."""
    email: Optional[bool] = True
    sms: Optional[bool] = False


class UserPreferences(BaseModel):
    """User preferences model."""
    user_id: str = Field(..., description="User ID (from auth)")
    
    # Location defaults
    default_zip: Optional[str] = Field(None, max_length=10)
    default_radius: Optional[int] = Field(50, ge=10, le=100)
    
    # Insurance preferences
    preferred_insurance_carriers: Optional[List[str]] = Field(default_factory=list)
    
    # Saved locations (max 5)
    saved_locations: Optional[List[SavedLocation]] = Field(default_factory=list)
    
    # Language preference
    language: Optional[str] = Field("en", regex="^[a-z]{2}$")
    
    # Notification preferences
    notifications: Optional[Notifications] = Field(default_factory=Notifications)
    
    # Timestamp
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_123",
                "default_zip": "02115",
                "default_radius": 50,
                "preferred_insurance_carriers": ["Aetna", "Blue Cross Blue Shield"],
                "saved_locations": [
                    {
                        "id": "loc_001",
                        "name": "Home",
                        "zip": "02115",
                        "radius": 25
                    }
                ],
                "language": "en",
                "notifications": {
                    "email": True,
                    "sms": False
                },
                "updated_at": "2025-01-15T10:30:00Z"
            }
        }


class UserPreferencesResponse(BaseModel):
    """Response for user preferences."""
    preferences: UserPreferences
    success: bool = True


class UserPreferencesUpdateRequest(BaseModel):
    """Request to update user preferences."""
    preferences: UserPreferences


__all__ = [
    "SavedLocation",
    "Notifications",
    "UserPreferences",
    "UserPreferencesResponse",
    "UserPreferencesUpdateRequest",
]

