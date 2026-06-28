"""
Application settings and configuration
Uses Pydantic Settings for environment variable management
"""

from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=False, extra="ignore"
    )

    # Application
    APP_NAME: str = "Venture Autopsy"
    API_VERSION: str = "v1"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "sqlite:///./data/startups.db"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from string if needed"""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS


settings = Settings()
