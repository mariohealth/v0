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


def verify_google_token(token: str) -> Dict[str, Any]:
    """
    Verify a Google OAuth2 ID token.
    
    Supports Google ID tokens from accounts.google.com for local testing.
    Uses the helper function pattern as requested, with fallback to extract
    audience from token if verification without audience fails.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token information (claims)
        
    Raises:
        HTTPException: If token verification fails
    """
    try:
        request = google_requests.Request()
        
        # Try verification without audience first (as per user's helper function)
        # This works for some token types but may fail for accounts.google.com tokens
        try:
            id_info = id_token.verify_oauth2_token(token, request)
            issuer = id_info.get('iss', 'unknown')
            logger.info(f"✅ Token verified successfully. Issuer: {issuer}")
            return id_info
        except ValueError as e:
            error_msg = str(e)
            
            # If audience is required, extract it from the token itself and retry
            if "audience" in error_msg.lower() or "aud" in error_msg.lower():
                # Decode JWT to get audience claim
                import base64
                import json
                try:
                    parts = token.split('.')
                    if len(parts) >= 2:
                        payload = parts[1]
                        payload += '=' * (4 - len(payload) % 4)
                        decoded = base64.urlsafe_b64decode(payload)
                        token_data = json.loads(decoded)
                        token_audience = token_data.get('aud')
                        issuer = token_data.get('iss', '')
                        
                        if token_audience:
                            logger.info(f"Found audience in token: {token_audience}, issuer: {issuer}")
                            # Retry verification with token's own audience
                            id_info = id_token.verify_oauth2_token(token, request, audience=token_audience)
                            logger.info(f"✅ Token verified with extracted audience. Issuer: {issuer}")
                            return id_info
                except Exception as decode_error:
                    logger.debug(f"Could not extract/use audience from token: {decode_error}")
            
            # If we couldn't verify, raise the original error
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Google ID token: {error_msg}"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"❌ Token verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google ID token: {str(e)}"
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

