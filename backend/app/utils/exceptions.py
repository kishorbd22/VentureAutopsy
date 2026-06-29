"""
Custom application exceptions
"""


class AppException(Exception):
    """Base exception class for application-specific errors"""

    def __init__(self, status_code: int, error_code: str, message: str, details: dict | None = None):
        self.status_code = status_code
        self.error_code = error_code
        self.message = message
        self.details = details
        super().__init__(self.message)