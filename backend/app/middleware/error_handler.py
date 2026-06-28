"""
Custom error handling middleware
Centralized exception handling for FastAPI application
"""

import logging
import traceback

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    """
    Custom middleware for handling exceptions globally
    Provides consistent error response format
    """

    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response

        except Exception as exc:
            return self.handle_exception(request, exc)

    def handle_exception(self, request: Request, exc: Exception) -> JSONResponse:
        """Handle different types of exceptions"""

        # Log the full error
        logger.error(f"Error occurred: {str(exc)}")
        logger.error(traceback.format_exc())

        # Handle validation errors
        if isinstance(exc, RequestValidationError):
            return JSONResponse(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                content={
                    "error": "Validation Error",
                    "message": "Request validation failed",
                    "details": exc.errors(),
                    "path": str(request.url.path),
                },
            )

        # Handle database errors
        if isinstance(exc, SQLAlchemyError):
            logger.error(f"Database error: {str(exc)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "Database Error",
                    "message": "An error occurred while processing your request",
                    "path": str(request.url.path),
                },
            )

        # Handle HTTP exceptions
        from fastapi import HTTPException

        if isinstance(exc, HTTPException):
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    "error": exc.detail
                    if isinstance(exc.detail, str)
                    else "HTTP Exception",
                    "message": str(exc.detail),
                    "path": str(request.url.path),
                },
            )

        # Handle custom application exceptions
        from app.utils.exceptions import AppException

        if isinstance(exc, AppException):
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    "error": exc.error_code,
                    "message": exc.message,
                    "details": exc.details,
                    "path": str(request.url.path),
                },
            )

        # Generic server error
        logger.error(f"Unhandled exception: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal Server Error",
                "message": "An unexpected error occurred",
                "path": str(request.url.path),
            },
        )
