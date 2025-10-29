"""
Saved Searches API endpoints.

Provides CRUD operations for saved searches.
For authenticated users, searches are stored in the database.
For guest users, searches are stored in localStorage only.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List
from datetime import datetime

from app.models.saved_search import (
    SavedSearch,
    SavedSearchCreateRequest,
    SavedSearchResponse,
    SavedSearchesListResponse,
)
from app.core.dependencies import get_supabase

router = APIRouter()


@router.get("/saved-searches", response_model=SavedSearchesListResponse)
async def get_saved_searches(
    supabase=Depends(get_supabase)
):
    """
    Get all saved searches for the current user.
    
    TODO: Implement proper authentication and extract user_id from request.
    """
    # TODO: Extract user_id from auth token
    user_id = "guest_user"
    
    try:
        response = supabase.table("saved_searches").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        
        if not response.data:
            return SavedSearchesListResponse(searches=[])
        
        searches = [
            SavedSearch(
                id=str(item["id"]),
                user_id=item["user_id"],
                query=item.get("query", ""),
                location=item.get("location"),
                filters=item.get("filters", {}),
                alert_enabled=item.get("alert_enabled", False),
                created_at=item.get("created_at"),
            )
            for item in response.data
        ]
        
        return SavedSearchesListResponse(searches=searches)
        
    except Exception as e:
        print(f"Error fetching saved searches: {e}")
        return SavedSearchesListResponse(searches=[])


@router.post("/saved-searches", response_model=SavedSearchResponse)
async def create_saved_search(
    request: SavedSearchCreateRequest,
    supabase=Depends(get_supabase)
):
    """
    Create a new saved search.
    """
    # TODO: Extract user_id from auth token
    user_id = "guest_user"
    
    try:
        search = request.search
        search.user_id = user_id
        search.created_at = datetime.utcnow()
        
        # Convert to dict for database insert
        search_dict = {
            "user_id": search.user_id,
            "query": search.query,
            "location": search.location,
            "filters": search.filters.model_dump() if search.filters else {},
            "alert_enabled": search.alert_enabled or False,
            "created_at": search.created_at.isoformat(),
        }
        
        insert_response = supabase.table("saved_searches").insert(search_dict).execute()
        
        if not insert_response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save search"
            )
        
        # Get the ID from the inserted record
        saved_id = insert_response.data[0].get("id")
        if not saved_id:
            saved_id = str(hash(f"{user_id}_{search.query}_{search.created_at}"))
        
        return SavedSearchResponse(id=str(saved_id))
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating saved search: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create saved search: {str(e)}"
        )


@router.delete("/saved-searches/{search_id}", response_model=SavedSearchResponse)
async def delete_saved_search(
    search_id: str,
    supabase=Depends(get_supabase)
):
    """
    Delete a saved search.
    """
    # TODO: Extract user_id from auth token
    user_id = "guest_user"
    
    try:
        # Verify the search belongs to the user
        check_response = supabase.table("saved_searches").select("*").eq("id", search_id).eq("user_id", user_id).execute()
        
        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Saved search not found"
            )
        
        # Delete the search
        delete_response = supabase.table("saved_searches").delete().eq("id", search_id).eq("user_id", user_id).execute()
        
        if not delete_response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete saved search"
            )
        
        return SavedSearchResponse(id=search_id)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting saved search: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete saved search: {str(e)}"
        )
