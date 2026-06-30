"""
Error tracking middleware
Provides error tracking with Sentry integration
"""

import logging
import traceback
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

logger = logging.getLogger(__name__)


class ErrorTrackingMiddleware(BaseHTTPMiddleware):
    """Middleware for tracking and handling errors"""

    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            # Get request ID from state if available
            request_id = getattr(request.state, 'request_id', 'unknown')

            # Log error
            logger.error(
                "Unhandled exception occurred",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "error": str(exc),
                    "error_type": type(exc).__name__,
                    "traceback": traceback.format_exc(),
                },
                exc_info=True
            )

            # Here you can integrate with Sentry or other error tracking services
            # Example with Sentry:
            # import sentry_sdk
            # sentry_sdk.capture_exception(exc)

            # Return generic error response
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal server error",
                    "request_id": request_id,
                    "message": "An unexpected error occurred. Please try again later."
                }
            )