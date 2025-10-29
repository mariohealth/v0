"""
Authentication utilities for Google Cloud identity tokens.

Strict verification for Google OAuth2 ID tokens from accounts.google.com.
"""

import os
import logging
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, status, Header
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

logger = logging.getLogger(__name__)


def get_allowed_audiences() -> List[str]:
    """
    Get list of allowed Google OAuth2 client IDs from environment variable.
    
    Returns:
        List of allowed audience (client ID) strings, stripped of whitespace
    """
    audiences_str = os.getenv("GOOGLE_ALLOWED_AUDIENCES", "")
    if not audiences_str:
        return []
    
    # Split by comma and strip whitespace
    audiences = [aud.strip() for aud in audiences_str.split(",") if aud.strip()]
    return audiences


def verify_google_id_token_strict(token: str) -> Dict[str, Any]:
    """
    Strictly verify a Google OAuth2 ID token.
    
    Requirements:
    - Issuer must be exactly "accounts.google.com" or "https://accounts.google.com"
    - Audience (aud) must match one of the configured GOOGLE_ALLOWED_AUDIENCES
    - Does NOT auto-extract audience; requires explicit configuration
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token information (claims)
        
    Raises:
        HTTPException: If token verification fails or requirements not met
    """
    allowed_audiences = get_allowed_audiences()
    
    if not allowed_audiences:
        logger.warning("⚠️ GOOGLE_ALLOWED_AUDIENCES not configured. Token verification will fail.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google token verification not configured. GOOGLE_ALLOWED_AUDIENCES must be set.",
        )
    
    request = google_requests.Request()
    
    # Try each allowed audience until one succeeds
    last_error = None
    for audience in allowed_audiences:
        try:
            id_info = id_token.verify_oauth2_token(token, request, audience=audience)
            
            # Verify issuer is accounts.google.com
            issuer = id_info.get("iss", "")
            if issuer not in ("accounts.google.com", "https://accounts.google.com"):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid token issuer: {issuer}. Expected accounts.google.com",
                )
            
            # Verify audience matches
            token_audience = id_info.get("aud", "")
            if token_audience != audience:
                continue  # Try next audience
            
            logger.info(
                f"✅ Token verified successfully. Issuer: {issuer}, Audience: {token_audience}"
            )
            return id_info
            
        except ValueError as e:
            last_error = str(e)
            continue  # Try next audience
        except HTTPException:
            raise
    
    # If we get here, no audience matched
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Invalid Google ID token: Token audience does not match any allowed audience. {last_error or ''}",
    )


async def get_current_user(
    authorization: Optional[str] = Header(None),
) -> Optional[Dict[str, Any]]:
    """
    Optional dependency to extract and verify user from Authorization header.

    This is OPTIONAL - if no Authorization header is provided, returns None.
    This allows public endpoints to work without auth.

    For endpoints that require auth, check if the result is None and raise 401.

    Args:
        authorization: Authorization header value (format: "Bearer <token>")

    Returns:
        Token claims if valid, None if no token provided

    Raises:
        HTTPException: If token is provided but invalid
    """
    if not authorization:
        return None

    # Extract token from "Bearer <token>"
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>",
        )

    token = authorization[7:]  # Remove "Bearer " prefix

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token is missing"
        )

    # Verify and return token claims using strict verification
    return verify_google_id_token_strict(token)


async def require_auth(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Required dependency that enforces authentication.

    Use this for endpoints that must be authenticated.

    Args:
        authorization: Authorization header value

    Returns:
        Token claims

    Raises:
        HTTPException: If no token or invalid token
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required"
        )

    # Extract token
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
        )

    token = authorization[7:]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token is missing"
        )

    return verify_google_id_token_strict(token)
