"""
Mario Health API - Main application entry point.

Provides endpoints for healthcare procedure price comparison.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.api.v1.endpoints import categories, families, procedures, search, billing_codes, providers
import os
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
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

# CORS middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://mariohealth.com,https://www.mariohealth.com"
).split(",")

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
            "message": str(exc) if os.getenv("DEBUG", "false").lower() == "true" else "An error occurred"
        },
    )

# Mount API v1 routers
app.include_router(categories.router, prefix="/api/v1")
app.include_router(families.router, prefix="/api/v1")
app.include_router(procedures.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(billing_codes.router, prefix="/api/v1")
app.include_router(providers.router, prefix="/api/v1")

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
        }
    }

@app.get("/health", tags=["root"])
def health_check():
    """Health check endpoint for monitoring and load balancers."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development"),
    }

# Optional: Add middleware for request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests."""
    logger.info(f"{request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response
