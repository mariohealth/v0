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

    Required environment variable:
    - FIREBASE_PROJECT_ID: Your Firebase project ID (for token verification)

    Raises:
        Exception: If Firebase Admin SDK initialization fails
    """
    import os

    if not firebase_admin._apps:
        try:
            project_id = os.getenv("FIREBASE_PROJECT_ID")

            if not project_id:
                raise ValueError(
                    "FIREBASE_PROJECT_ID environment variable is required. "
                    "Set it to your Firebase project ID (e.g., 'mario-mrf-data')"
                )

            # Use Application Default Credentials with explicit project ID
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred, {
                'projectId': project_id
            })

            logger.info(f"✅ Firebase Admin SDK initialized for project: {project_id}")


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
