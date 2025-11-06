"""
FastAPI Structured Logging for GCP Cloud Run
Automatically captures request/response metrics in Cloud Logging format
"""

import json
import time
import logging
from typing import Callable
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
import traceback

# Configure structured logging for GCP
# Cloud Run automatically captures stdout as structured logs
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',  # Just the message - GCP adds timestamp/severity
)
logger = logging.getLogger(__name__)


def log_structured(severity: str, message: str, **kwargs):
    """
    Log in GCP Cloud Logging structured format
    https://cloud.google.com/logging/docs/structured-logging
    """
    log_entry = {
        "severity": severity,
        "message": message,
        **kwargs  # Additional fields for filtering/querying
    }
    
    # Print as JSON - Cloud Run captures this as structured log
    print(json.dumps(log_entry))


class RequestLoggingMiddleware:
    """
    Middleware to automatically log all API requests with performance metrics
    """
    
    def __init__(self, app: FastAPI):
        self.app = app
    
    async def __call__(self, request: Request, call_next: Callable) -> Response:
        # Start timer
        start_time = time.time()
        
        # Extract request metadata
        request_id = request.headers.get("X-Request-ID", str(time.time()))
        user_agent = request.headers.get("User-Agent", "unknown")
        
        # Store in request state for access in endpoints
        request.state.request_id = request_id
        request.state.start_time = start_time
        
        try:
            # Process request
            response = await call_next(request)
            
            # Calculate duration
            duration_ms = round((time.time() - start_time) * 1000, 2)
            
            # Log successful request
            log_structured(
                severity="INFO",
                message=f"{request.method} {request.url.path}",
                httpRequest={
                    "requestMethod": request.method,
                    "requestUrl": str(request.url),
                    "status": response.status_code,
                    "userAgent": user_agent,
                    "latency": f"{duration_ms}ms",
                },
                request_id=request_id,
                duration_ms=duration_ms,
                status_code=response.status_code,
                endpoint=request.url.path,
            )
            
            # Add request ID to response headers for debugging
            response.headers["X-Request-ID"] = request_id
            
            # Warn on slow requests (>1000ms)
            if duration_ms > 1000:
                log_structured(
                    severity="WARNING",
                    message=f"Slow request: {request.method} {request.url.path}",
                    duration_ms=duration_ms,
                    request_id=request_id,
                    threshold_ms=1000,
                )
            
            return response
            
        except Exception as e:
            # Calculate duration even for errors
            duration_ms = round((time.time() - start_time) * 1000, 2)
            
            # Log error with full context
            log_structured(
                severity="ERROR",
                message=f"Request failed: {request.method} {request.url.path}",
                httpRequest={
                    "requestMethod": request.method,
                    "requestUrl": str(request.url),
                    "status": 500,
                    "userAgent": user_agent,
                },
                request_id=request_id,
                duration_ms=duration_ms,
                error={
                    "type": type(e).__name__,
                    "message": str(e),
                    "traceback": traceback.format_exc(),
                },
            )
            
            # Return 500 error response
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal server error",
                    "request_id": request_id,
                },
                headers={"X-Request-ID": request_id},
            )


# Example: Custom event logging in endpoints
@app.get("/api/v1/search")
async def search_procedures(request: Request, q: str, zip: str = None):
    """
    Search endpoint with custom event logging
    """
    try:
        # Your search logic here
        results = perform_search(q, zip)
        
        # Log custom event for analytics
        log_structured(
            severity="INFO",
            message="Search performed",
            event_type="search",
            request_id=request.state.request_id,
            search_query=q,
            zip_code=zip,
            results_count=len(results),
            has_results=len(results) > 0,
        )
        
        return {"results": results}
        
    except Exception as e:
        # Error is already logged by middleware
        # But you can add domain-specific context
        log_structured(
            severity="ERROR",
            message="Search failed",
            event_type="search_error",
            request_id=request.state.request_id,
            search_query=q,
            zip_code=zip,
            error_type=type(e).__name__,
        )
        raise


@app.get("/api/v1/procedures/{slug}")
async def get_procedure_detail(request: Request, slug: str):
    """
    Procedure detail with user interaction tracking
    """
    # Your logic here
    procedure = fetch_procedure(slug)
    
    # Track procedure views for analytics
    log_structured(
        severity="INFO",
        message="Procedure viewed",
        event_type="procedure_view",
        request_id=request.state.request_id,
        procedure_slug=slug,
        procedure_category=procedure.get("category"),
        procedure_family=procedure.get("family"),
    )
    
    return procedure


# Health check endpoint (don't log every health check - too noisy)
@app.get("/health")
async def health_check():
    """
    Health check endpoint - logs only failures
    """
    return {"status": "healthy"}


def perform_search(query: str, zip_code: str = None):
    """Placeholder for your search logic"""
    # Your implementation here
    return []


def fetch_procedure(slug: str):
    """Placeholder for your procedure fetch logic"""
    # Your implementation here
    return {}
