"""
Whoami API endpoint for debugging authentication.

Returns decoded token claims and authentication status.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional
from app.core.auth import require_auth

router = APIRouter(prefix="/whoami", tags=["auth"])


@router.get("")
async def whoami(user: Dict[str, Any] = Depends(require_auth)):
    """
    Debug endpoint that returns authenticated user information from token claims.

    Requires authentication - will return 401 if no valid token is provided.

    Returns:
        Dictionary containing:
        - authenticated: true
        - token_claims: All decoded token claims (iss, aud, email, sub, exp, etc.)
        - user_info: Extracted user information (email, subject, etc.)
    """
    try:
        # Extract key user information
        user_info = {
            "email": user.get("email", "N/A"),
            "email_verified": user.get("email_verified", False),
            "subject": user.get("sub", "N/A"),
            "issuer": user.get("iss", "N/A"),
            "audience": user.get("aud", "N/A"),
        }

        return {
            "authenticated": True,
            "user_info": user_info,
            "token_claims": user,  # Return all token claims for debugging
        }
    except Exception as e:
        # This should not happen if require_auth worked, but handle gracefully
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "authenticated": False,
                "error": str(e),
                "message": "Error processing token claims",
            },
        )


@router.get("/test")
async def whoami_test():
    """
    Test endpoint that does NOT require authentication.

    Returns error details to help debug authentication issues.

    Returns:
        Information about the endpoint and how to use it
    """
    return {
        "message": "This endpoint does not require authentication",
        "authenticated": False,
        "instructions": {
            "to_test_auth": "Send a GET request to /api/v1/whoami (without /test) with Authorization: Bearer <token> header",
            "token_required": True,
            "expected_response": "Returns token claims if valid, 401 if invalid or missing",
        },
    }
