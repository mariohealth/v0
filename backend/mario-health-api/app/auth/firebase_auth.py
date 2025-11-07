"""
Firebase Admin SDK initialization using Application Default Credentials (ADC).

This module initializes Firebase Admin SDK using ADC, which works:
- Locally: When user runs `gcloud auth application-default login`
- On Cloud Run: Automatically uses the attached IAM service account

No service account key file is required.
"""

import firebase_admin
from firebase_admin import credentials, auth
import logging

logger = logging.getLogger(__name__)


def initialize_firebase_admin():
    """
    Initialize Firebase Admin SDK using Application Default Credentials (ADC).

    ADC works in two scenarios:
    1. Local development: After running `gcloud auth application-default login`
    2. Cloud Run: Automatically uses the attached IAM service account

    Raises:
        Exception: If Firebase Admin SDK initialization fails
    """
    if not firebase_admin._apps:
        try:
            # Use Application Default Credentials (ADC)
            # This will automatically use:
            # - Local: Credentials from `gcloud auth application-default login`
            # - Cloud Run: The attached IAM service account
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)
            logger.info(
                "✅ Firebase Admin SDK initialized using Application Default Credentials (ADC)"
            )
        except Exception as e:
            logger.error(f"❌ Failed to initialize Firebase Admin SDK: {str(e)}")
            raise
    else:
        logger.debug("Firebase Admin SDK already initialized")


def get_firebase_auth():
    """
    Get Firebase Auth instance.

    Ensures Firebase Admin is initialized before returning auth instance.

    Returns:
        firebase_admin.auth: Firebase Auth instance
    """
    initialize_firebase_admin()
    return auth


def verify_token(id_token: str):
    """
    Verify a Firebase ID token.

    Args:
        id_token: Firebase ID token string

    Returns:
        dict: Decoded token claims if valid, None if invalid
    """
    try:
        initialize_firebase_admin()
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        logger.error(f"Firebase auth error: {e}")
        return None
