"""
Custom application exceptions
Provides structured error handling across the application
"""

from typing import Any, Dict, Optional


class AppException(Exception):
    """Base custom exception class"""

    def __init__(
        self,
        status_code: int,
        error_code: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.status_code = status_code
        self.error_code = error_code
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class NotFoundException(AppException):
    """Exception raised when resource is not found"""

    def __init__(self, resource: str, identifier: Any):
        super().__init__(
            status_code=404,
            error_code="NOT_FOUND",
            message=f"{resource} not found",
            details={"resource": resource, "identifier": str(identifier)},
        )


class ValidationException(AppException):
    """Exception raised when validation fails"""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=400,
            error_code="VALIDATION_ERROR",
            message=message,
            details=details,
        )


class AuthenticationException(AppException):
    """Exception raised when authentication fails"""

    def __init__(self, message: str = "Authentication required"):
        super().__init__(
            status_code=401, error_code="AUTHENTICATION_ERROR", message=message
        )


class AuthorizationException(AppException):
    """Exception raised when authorization fails"""

    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(
            status_code=403, error_code="AUTHORIZATION_ERROR", message=message
        )


class ConflictException(AppException):
    """Exception raised when resource conflict occurs"""

    def __init__(self, resource: str, message: str = "Resource already exists"):
        super().__init__(
            status_code=409,
            error_code="CONFLICT",
            message=message,
            details={"resource": resource},
        )


class InternalServerException(AppException):
    """Exception raised for internal server errors"""

    def __init__(self, message: str = "Internal server error"):
        super().__init__(status_code=500, error_code="INTERNAL_ERROR", message=message)
