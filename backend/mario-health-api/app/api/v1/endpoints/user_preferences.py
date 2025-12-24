"""
User Preferences API endpoints.

Provides CRUD operations for user preferences.
For authenticated users, preferences are stored in the database.
For guest users, preferences are stored in localStorage only.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Dict, Any
import json
from datetime import datetime

from app.models.user_preferences import (
    UserPreferences,
    UserPreferencesResponse,
    UserPreferencesUpdateRequest,
)
from app.core.dependencies import get_supabase
from app.core.auth import get_current_user_id
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/preferences", response_model=UserPreferencesResponse)
async def get_user_preferences(
        user_id: str = Depends(get_current_user_id),
        supabase=Depends(get_supabase)
):
    """
    Get user preferences for authenticated user.

    Requires authentication via Firebase ID token in Authorization header.
    """
    try:
        # Query the database for user preferences
        response = supabase.table("user_preferences").select("*").eq("user_id", user_id).execute()

        if response.data and len(response.data) > 0:
            # Return preferences from database
            prefs_data = response.data[0]

            # Convert to UserPreferences model
            preferences = UserPreferences(
                user_id=prefs_data["user_id"],
                default_zip=prefs_data.get("default_zip"),
                default_radius=prefs_data.get("default_radius", 50),
                preferred_insurance_carriers=prefs_data.get("preferred_insurance_carriers", []) or [],
                saved_locations=prefs_data.get("saved_locations", []) or [],
                language=prefs_data.get("language", "en"),
                notifications=prefs_data.get("notifications", {}),
            )

            return UserPreferencesResponse(preferences=preferences)
        else:
            # Return default preferences for this user
            default_prefs = UserPreferences(
                user_id=user_id,
                default_zip=None,
                default_radius=50,
                preferred_insurance_carriers=[],
                saved_locations=[],
                language="en",
                notifications={"email": True, "sms": False},
            )

            return UserPreferencesResponse(preferences=default_prefs)

    except Exception as e:
        # Log error but don't fail the request
        logger.error(f"Error fetching user preferences for user {user_id}: {e}")

        # Return default preferences on error
        default_prefs = UserPreferences(
            user_id=user_id,
            default_zip=None,
            default_radius=50,
            preferred_insurance_carriers=[],
            saved_locations=[],
            language="en",
            notifications={"email": True, "sms": False},
        )

        return UserPreferencesResponse(preferences=default_prefs)


@router.put("/preferences", response_model=UserPreferencesResponse)
async def update_user_preferences(
        request: UserPreferencesUpdateRequest,
        user_id: str = Depends(get_current_user_id),
        supabase=Depends(get_supabase)
):
    """
    Update user preferences for authenticated user.

    Creates or updates user preferences in the database.
    Requires authentication via Firebase ID token in Authorization header.
    """
    try:
        preferences = request.preferences
        preferences.user_id = user_id  # Ensure user_id matches authenticated user
        preferences.updated_at = datetime.utcnow()

        # Convert to dict for database insert
        prefs_dict = preferences.model_dump()

        # Check if preferences already exist
        response = supabase.table("user_preferences").select("*").eq("user_id", user_id).execute()

        if response.data and len(response.data) > 0:
            # Update existing preferences
            update_response = supabase.table("user_preferences").update(prefs_dict).eq("user_id", user_id).execute()

            if not update_response.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update preferences"
                )
        else:
            # Insert new preferences
            insert_response = supabase.table("user_preferences").insert(prefs_dict).execute()

            if not insert_response.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to save preferences"
                )

        # Return updated preferences
        return UserPreferencesResponse(preferences=preferences)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user preferences for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update preferences: {str(e)}"
        )
