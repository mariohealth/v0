"""
FastAPI Structured Logging for GCP Cloud Run
Automatically captures request/response metrics in Cloud Logging format
Handles both HTTPExceptions (from services) and unexpected errors
"""

import json
import time
import logging
import traceback
from typing import Callable
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

# Configure structured logging for GCP
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',  # Just the message - GCP adds timestamp/severity
)
logger = logging.getLogger(__name__)


def log_structured(severity: str, message: str, **kwargs):
    """
    Log in GCP Cloud Logging structured format.
    https://cloud.google.com/logging/docs/structured-logging
    """
    log_entry = {
        "severity": severity,
        "message": message,
        **kwargs
    }
    print(json.dumps(log_entry))


class RequestLoggingMiddleware:
    """
    Middleware to automatically log all API requests.

    Handles:
    1. Successful requests (200-299)
    2. Client errors (400-499) - HTTPException from services
    3. Server errors (500-599) - Unexpected exceptions
    """

    def __init__(self, app: FastAPI):
        self.app = app

    async def __call__(self, request: Request, call_next: Callable) -> Response:
        # Start timer
        start_time = time.time()

        # Generate request ID
        request_id = request.headers.get("X-Request-ID", f"req_{int(time.time() * 1000)}")
        user_agent = request.headers.get("User-Agent", "unknown")

        # Store in request state for access in routes/services
        request.state.request_id = request_id
        request.state.start_time = start_time

        try:
            # Process request
            response = await call_next(request)

            # Calculate duration
            duration_ms = round((time.time() - start_time) * 1000, 2)

            # Determine log severity based on status code
            if response.status_code >= 500:
                severity = "ERROR"
            elif response.status_code >= 400:
                severity = "WARNING"
            else:
                severity = "INFO"

            # Log request
            log_structured(
                severity=severity,
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

            # Warn on slow requests
            if duration_ms > 1000:
                log_structured(
                    severity="WARNING",
                    message=f"Slow request: {request.method} {request.url.path}",
                    duration_ms=duration_ms,
                    request_id=request_id,
                    threshold_ms=1000,
                )

            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id

            return response

        except HTTPException as e:
            """
            Handle HTTPException raised by services (400, 404, etc.)
            These are EXPECTED errors with user-friendly messages.
            """
            duration_ms = round((time.time() - start_time) * 1000, 2)

            # Determine severity
            severity = "ERROR" if e.status_code >= 500 else "WARNING"

            # Log with appropriate severity
            log_structured(
                severity=severity,
                message=f"HTTP {e.status_code}: {request.method} {request.url.path}",
                httpRequest={
                    "requestMethod": request.method,
                    "requestUrl": str(request.url),
                    "status": e.status_code,
                    "userAgent": user_agent,
                },
                request_id=request_id,
                duration_ms=duration_ms,
                status_code=e.status_code,
                endpoint=request.url.path,
                error_detail=e.detail,
            )

            # Return properly formatted error response
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": e.detail,
                    "status_code": e.status_code,
                    "request_id": request_id,
                },
                headers={"X-Request-ID": request_id},
            )

        except Exception as e:
            """
            Handle UNEXPECTED errors (bugs, network issues, etc.)
            These should be investigated immediately.
            """
            duration_ms = round((time.time() - start_time) * 1000, 2)

            # Log error with full details
            log_structured(
                severity="ERROR",
                message=f"Unexpected error: {request.method} {request.url.path}",
                httpRequest={
                    "requestMethod": request.method,
                    "requestUrl": str(request.url),
                    "status": 500,
                    "userAgent": user_agent,
                },
                request_id=request_id,
                duration_ms=duration_ms,
                status_code=500,
                endpoint=request.url.path,
                error={
                    "type": type(e).__name__,
                    "message": str(e),
                    "traceback": traceback.format_exc(),
                },
            )

            # Return generic 500 error (don't leak internal details)
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal server error. Please try again later.",
                    "request_id": request_id,
                },
                headers={"X-Request-ID": request_id},
            )
