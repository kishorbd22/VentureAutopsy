"""
Database configuration and initialization
SQLite database setup with SQLAlchemy
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config.settings import settings

# Ensure data directory exists
os.makedirs("data", exist_ok=True)

# Create SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}  # SQLite specific
)

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
