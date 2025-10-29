"""
Authentication utilities for Google Cloud identity tokens.

Supports both:
- Google OAuth2 ID tokens (for local testing with ADC)
- Service account tokens (for Cloud Run service-to-service)
"""

import os
import logging
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Header
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

logger = logging.getLogger(__name__)


def verify_google_token(token: str, audience: Optional[str] = None) -> Dict[str, Any]:
    """
    Verify a Google OAuth2 ID token.
    
    Args:
        token: JWT token string
        audience: Optional expected audience (aud claim). If None, will try to verify
                  without audience check (for tokens from accounts.google.com)
        
    Returns:
        Decoded token information (claims)
        
    Raises:
        HTTPException: If token verification fails
    """
    try:
        request = google_requests.Request()
        
        # Try to verify the token
        # If audience is provided, use it (for Cloud Run tokens)
        # If not, try without audience check (for OAuth2 user tokens)
        if audience:
            id_info = id_token.verify_oauth2_token(token, request, audience=audience)
        else:
            # For tokens from accounts.google.com, we need to check the issuer
            # and may need to skip audience verification for local testing
            try:
                # Try without audience first (for local ADC tokens)
                id_info = id_token.verify_oauth2_token(token, request)
            except ValueError:
                # If that fails and we have a Cloud Run URL, try with that as audience
                cloud_run_url = os.getenv("CLOUD_RUN_URL") or os.getenv("GOOGLE_CLOUD_PROJECT")
                if cloud_run_url:
                    logger.info(f"Retrying token verification with audience: {cloud_run_url}")
                    id_info = id_token.verify_oauth2_token(token, request, audience=cloud_run_url)
                else:
                    raise
        
        issuer = id_info.get('iss', 'unknown')
        token_email = id_info.get('email', 'unknown')
        logger.info(f"✅ Token verified successfully. Issuer: {issuer}, Email: {token_email}")
        return id_info
        
    except ValueError as e:
        error_msg = str(e)
        logger.warning(f"❌ Token verification failed (ValueError): {error_msg}")
        
        # Provide helpful error messages
        if "Token audience mismatch" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token audience mismatch. Ensure token is issued for the correct service."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token: {error_msg}"
            )
    except Exception as e:
        logger.warning(f"❌ Token verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}"
        )


async def get_current_user(
    authorization: Optional[str] = Header(None)
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
            detail="Invalid authorization header format. Expected: Bearer <token>"
        )
    
    token = authorization[7:]  # Remove "Bearer " prefix
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing"
        )
    
    # Verify and return token claims
    return verify_google_token(token)


async def require_auth(
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
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
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Extract token
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    token = authorization[7:]
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing"
        )
    
    return verify_google_token(token)

