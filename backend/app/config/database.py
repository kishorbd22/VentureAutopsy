"""
Database configuration and initialization
Supports SQLite (local) and PostgreSQL (Docker)
"""

import os
from urllib.parse import quote_plus

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config.settings import settings

# Build database URL for SQLite or PostgreSQL
def get_database_url() -> str:
    database_url = settings.DATABASE_URL

    # Use PostgreSQL only if DATABASE_URL was explicitly set to PostgreSQL,
    # or if POSTGRES_SERVER was explicitly overridden from default "db"
    if database_url == "sqlite:///./data/startups.db":
        # Check if PostgreSQL was explicitly configured
        if settings.POSTGRES_SERVER and settings.POSTGRES_SERVER != "db":
            password = quote_plus(settings.POSTGRES_PASSWORD)
            database_url = (
                f"postgresql://{settings.POSTGRES_USER}:{password}"
                f"@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
            )

    return database_url


# Ensure data directory exists (for SQLite)
os.makedirs("data", exist_ok=True)

DATABASE_URL = get_database_url()

# Create SQLAlchemy engine with driver-specific options
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency to get database session
    Yields a database session for FastAPI endpoints
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_database():
    """
    Initialize database tables
    Creates all tables defined in models
    """
    Base.metadata.create_all(bind=engine)
