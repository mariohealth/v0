"""
Authentication utilities for Firebase ID tokens.

Uses Firebase Admin SDK to verify tokens from Firebase Authentication.
"""

import logging
from typing import Dict, Any
from fastapi import HTTPException, status, Header, Depends

logger = logging.getLogger(__name__)


async def require_auth(authorization: str = Header(None)) -> Dict[str, Any]:
    """
    Required dependency that enforces Firebase authentication.

    Use this for endpoints that must be authenticated.

    Args:
        authorization: Authorization header value (format: "Bearer <token>")

    Returns:
        Decoded Firebase token claims

    Raises:
        HTTPException: If no token or invalid token
    """
    from app.auth.firebase_auth import verify_token

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide Authorization header."
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>",
        )

    token = authorization[7:]  # Remove "Bearer " prefix

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing"
        )

    # Verify token using Firebase Admin SDK
    decoded = verify_token(token)

    if not decoded:
        logger.error("Token verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    logger.info(f"User authenticated: {decoded.get('email', 'N/A')}")
    return decoded


async def get_current_user_id(user: Dict[str, Any] = Depends(require_auth)) -> str:
    """
    Extract user ID from authenticated Firebase token.

    Firebase tokens can have the user ID in different fields:
    - 'user_id' (Firebase custom tokens)
    - 'uid' (Firebase ID tokens)
    - 'sub' (JWT standard subject claim)

    Args:
        user: Decoded token claims from require_auth dependency

    Returns:
        User ID string

    Raises:
        HTTPException: If user ID cannot be extracted from token
    """
    # Try to get user ID from token claims (in order of preference)
    user_id = user.get("user_id") or user.get("uid") or user.get("sub")

    if not user_id:
        logger.error(f"User ID not found in token claims. Available claims: {list(user.keys())}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in authentication token"
        )

    logger.debug(f"Extracted user_id: {user_id}")
    return user_id


async def get_current_user_email(user: Dict[str, Any] = Depends(require_auth)) -> str:
    """
    Extract user email from authenticated Firebase token.

    Args:
        user: Decoded token claims from require_auth dependency

    Returns:
        User email string

    Raises:
        HTTPException: If email cannot be extracted from token
    """
    email = user.get("email")

    if not email:
        logger.error(f"Email not found in token claims. Available claims: {list(user.keys())}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not found in authentication token"
        )

    return email
