"""
Mario Health API - Main application entry point.

Provides endpoints for healthcare procedure price comparison.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import Optional, Dict, Any
from app.api.v1.endpoints import (
    categories,
    families,
    procedures,
    search,
    billing_codes,
    providers,
    user_preferences,
    saved_searches,
    whoami,
    bookings,
    insurance,
)
import os
from pathlib import Path
from app.middleware.logging import RequestLoggingMiddleware
from app.auth.firebase_auth import verify_token

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan events."""
    # Startup
    logger.info("\n" + ASCII_ART)
    logger.info("🚀 Mario Health API starting up...")
    logger.info("📚 Docs available at: /docs")
    logger.info("🔍 Health check at: /health")
    yield
    # Shutdown
    logger.info("👋 Mario Health API shutting down...")


# Load ASCII art
def load_ascii_art():
    """Load ASCII art from file."""
    try:
        ascii_file = Path(__file__).parent.parent / "dr_mario.txt"
        with open(ascii_file, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return "🏥 Mario Health API"


ASCII_ART = load_ascii_art()

# Create FastAPI app
app = FastAPI(
    title="Mario Health API",
    version="0.0.1",
    description="Healthcare price comparison platform API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)
app.middleware("http")(RequestLoggingMiddleware(app))

# CORS middleware configuration
# Required origins for frontend access
REQUIRED_ORIGINS = [
    "http://localhost:3000",
    "https://mario-mrf-data.web.app",
    "https://mario-health-frontend.vercel.app",
    "https://mario-health-clean.vercel.app",
]

# Firebase Hosting origins
# Note: FastAPI CORSMiddleware doesn't support wildcards, so we'll use a custom handler
# For now, add specific Firebase Hosting origins via ALLOWED_ORIGINS env var
# Example: ALLOWED_ORIGINS=https://your-site.web.app,https://your-site.firebaseapp.com
FIREBASE_HOSTING_ORIGINS = []

# Get additional origins from environment variable
ALLOWED_ORIGINS_STR = os.getenv(
    "ALLOWED_ORIGINS",
    "http://127.0.0.1:3000,https://mario.health,https://www.mario.health,https://mario-health-ifzy.vercel.app,https://mario-mrf-data.web.app",
)

# Strip whitespace from each origin to prevent CORS issues
ALLOWED_ORIGINS = [
    origin.strip() for origin in ALLOWED_ORIGINS_STR.split(",") if origin.strip()
]

# Always add required origins (they take precedence)
for origin in REQUIRED_ORIGINS:
    if origin not in ALLOWED_ORIGINS:
        ALLOWED_ORIGINS.append(origin)
        logger.info(f"✅ Added required CORS origin: {origin}")

# Add Firebase Hosting origins from environment variable
# Since FastAPI CORSMiddleware doesn't support wildcards, add specific origins via ALLOWED_ORIGINS
# Example: ALLOWED_ORIGINS=https://your-site.web.app,https://your-site.firebaseapp.com
if FIREBASE_HOSTING_ORIGINS:
    ALLOWED_ORIGINS.extend(FIREBASE_HOSTING_ORIGINS)
    logger.info(f"✅ Added Firebase Hosting CORS origins: {FIREBASE_HOSTING_ORIGINS}")
else:
    logger.info(
        "ℹ️  Add Firebase Hosting origins via ALLOWED_ORIGINS env var (e.g., https://your-site.web.app)"
    )

# Google OAuth2 allowed audiences
# These should match the client IDs from your Google OAuth2 credentials
# For Cloud Run identity tokens, the audience should be the Cloud Run service URL
# For regular Google ID tokens, the audience should be the OAuth2 client ID
GOOGLE_ALLOWED_AUDIENCES_STR = os.getenv("GOOGLE_ALLOWED_AUDIENCES", "")
GOOGLE_ALLOWED_AUDIENCES = [
    aud.strip() for aud in GOOGLE_ALLOWED_AUDIENCES_STR.split(",") if aud.strip()
]

logger.info(f"🔒 CORS configured with allowed origins: {ALLOWED_ORIGINS}")
logger.info(
    f"🔐 Google OAuth2 allowed audiences: {GOOGLE_ALLOWED_AUDIENCES if GOOGLE_ALLOWED_AUDIENCES else 'NOT CONFIGURED - Token verification will fail'}"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with detailed messages."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "body": exc.body,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catch-all exception handler."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "message": (
                str(exc)
                if os.getenv("DEBUG", "false").lower() == "true"
                else "An error occurred"
            ),
        },
    )


# Mount API v1 routers
app.include_router(categories.router, prefix="/api/v1")
app.include_router(families.router, prefix="/api/v1")
app.include_router(procedures.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(billing_codes.router, prefix="/api/v1")
app.include_router(providers.router, prefix="/api/v1")
app.include_router(user_preferences.router, prefix="/api/v1/user")
app.include_router(saved_searches.router, prefix="/api/v1/user")
app.include_router(whoami.router, prefix="/api/v1")  # Debug endpoint for authentication
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(insurance.router, prefix="/api/v1")


# Alias routes for compatibility
@app.get("/api/v1/procedure-categories", tags=["categories"], include_in_schema=False)
async def procedure_categories_alias():
    """Alias route for /procedure-categories, redirects to /categories."""
    from fastapi.responses import RedirectResponse

    return RedirectResponse(url="/api/v1/categories", status_code=307)


# Root endpoints
@app.get("/", tags=["root"])
def root():
    """API root - returns basic info."""
    return {
        "message": "Mario Health API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "categories": "/api/v1/categories",
            "search": "/api/v1/search",
        },
    }


@app.get("/health", tags=["root"])
def health_check():
    """Health check endpoint for monitoring and load balancers."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development"),
    }


# Firebase Auth dependency
async def require_auth(authorization: str = Header(...)) -> Dict[str, Any]:
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
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>",
        )

    token = authorization.split("Bearer ")[-1]
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token is missing"
        )

    decoded = verify_token(token)
    if not decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    return decoded


# Secure endpoints
@app.get("/user/profile", tags=["auth"])
async def user_profile(user: Dict[str, Any] = Depends(require_auth)):
    """Get user profile from Firebase token."""
    return {
        "uid": user.get("uid"),
        "email": user.get("email"),
        "email_verified": user.get("email_verified", False),
        "name": user.get("name"),
        "picture": user.get("picture"),
    }


@app.get("/secure/verify", tags=["auth"])
async def secure_verify(user: Dict[str, Any] = Depends(require_auth)):
    """Verify Firebase authentication token."""
    return {
        "status": "verified",
        "user": {
            "uid": user.get("uid"),
            "email": user.get("email"),
            "email_verified": user.get("email_verified", False),
        },
    }


# Add middleware for request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests with headers for debugging."""
    # Log auth header if present (truncated for security)
    auth_header = request.headers.get("authorization", "")
    if auth_header:
        # Show first 30 chars only
        auth_preview = (
            auth_header[:30] + "..." if len(auth_header) > 30 else auth_header
        )
        logger.info(f"{request.method} {request.url.path} | Auth: {auth_preview}")

    # Log origin header for CORS debugging
    origin = request.headers.get("origin", "")
    if origin:
        logger.info(f"  Origin: {origin}")

    response = await call_next(request)

    # Log CORS headers in response
    cors_origin = response.headers.get("access-control-allow-origin", "")
    if cors_origin:
        logger.info(f"  CORS Allowed Origin: {cors_origin}")

    logger.info(f"Response status: {response.status_code}")
    return response
