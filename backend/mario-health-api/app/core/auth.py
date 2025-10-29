"""
Authentication utilities for Google Cloud identity tokens and OAuth2 ID tokens.

Supports two types of tokens:
1. Google Cloud Identity Tokens (for Cloud Run services)
   - Audience: Cloud Run service URL (e.g., https://service.run.app)
   - Issuer: https://accounts.google.com (for service account tokens)

2. Google OAuth2 ID Tokens (for user authentication)
   - Audience: OAuth2 client ID
   - Issuer: accounts.google.com or https://accounts.google.com
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
    Get list of allowed audiences from environment variable.

    Supports both:
    - Google OAuth2 client IDs (for user OAuth tokens)
    - Cloud Run service URLs (for service account identity tokens)

    Returns:
        List of allowed audience strings, stripped of whitespace
    """
    audiences_str = os.getenv("GOOGLE_ALLOWED_AUDIENCES", "")
    if not audiences_str:
        return []

    # Split by comma and strip whitespace
    audiences = [aud.strip() for aud in audiences_str.split(",") if aud.strip()]

    # Log what types of audiences we expect
    cloud_run_urls = [
        a for a in audiences if a.startswith("https://") and ".run.app" in a
    ]
    oauth_client_ids = [a for a in audiences if not a.startswith("https://")]

    if cloud_run_urls:
        logger.info(
            f"📌 Configured Cloud Run service URLs as audiences: {cloud_run_urls}"
        )
    if oauth_client_ids:
        logger.info(f"📌 Configured OAuth2 client IDs as audiences: {oauth_client_ids}")

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

    # Log configuration for debugging
    logger.info(
        f"🔍 Token verification started. Allowed audiences: {allowed_audiences}"
    )

    if not allowed_audiences:
        logger.warning(
            "⚠️ GOOGLE_ALLOWED_AUDIENCES not configured. Token verification will fail."
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google token verification not configured. GOOGLE_ALLOWED_AUDIENCES must be set.",
        )

    request = google_requests.Request()

    # Try each allowed audience until one succeeds
    last_error = None
    for audience in allowed_audiences:
        try:
            logger.debug(f"🔄 Attempting token verification with audience: {audience}")
            id_info = id_token.verify_oauth2_token(token, request, audience=audience)

            # Extract and log token claims for debugging
            issuer = id_info.get("iss", "")
            token_audience = id_info.get("aud", "")
            email = id_info.get("email", "N/A")
            email_verified = id_info.get("email_verified", False)
            sub = id_info.get("sub", "N/A")
            exp = id_info.get("exp", "N/A")

            # Log all token claims for debugging
            logger.info(f"📋 Decoded token claims:")
            logger.info(f"   - Issuer (iss): {issuer}")
            logger.info(f"   - Audience (aud): {token_audience}")
            logger.info(f"   - Expected audience: {audience}")
            logger.info(f"   - Subject (sub): {sub}")
            logger.info(f"   - Email: {email}")
            logger.info(f"   - Email verified: {email_verified}")
            logger.info(f"   - Expiration (exp): {exp}")

            # Verify issuer is from Google
            # Accept both user OAuth2 tokens (accounts.google.com) and service account tokens (https://accounts.google.com)
            valid_issuers = (
                "accounts.google.com",
                "https://accounts.google.com",
                "https://securetoken.google.com",  # Firebase/service account tokens
            )
            if issuer not in valid_issuers:
                logger.error(
                    f"❌ Invalid token issuer: {issuer}. Expected one of: {valid_issuers}"
                )
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid token issuer: {issuer}. Expected Google issuer.",
                )

            # Verify audience matches
            if token_audience != audience:
                logger.warning(
                    f"⚠️ Token audience ({token_audience}) does not match expected ({audience}), trying next audience..."
                )
                continue  # Try next audience

            logger.info(
                f"✅ Token verified successfully. Issuer: {issuer}, Audience: {token_audience}, Email: {email}"
            )
            return id_info

        except ValueError as e:
            last_error = str(e)
            logger.warning(
                f"⚠️ Token verification failed with audience {audience}: {str(e)}"
            )
            continue  # Try next audience
        except HTTPException:
            raise
        except Exception as e:
            logger.error(
                f"❌ Unexpected error during token verification: {str(e)}",
                exc_info=True,
            )
            last_error = str(e)
            continue

    # If we get here, no audience matched
    logger.error(
        f"❌ Token verification failed: Token audience does not match any allowed audience. "
        f"Allowed: {allowed_audiences}. Last error: {last_error or 'No specific error'}"
    )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Invalid Google ID token: Token audience does not match any allowed audience. Allowed audiences: {allowed_audiences}. {last_error or ''}",
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
