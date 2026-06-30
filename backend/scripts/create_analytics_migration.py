"""
Script to create database migration for analytics tables
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from alembic import command
from alembic.config import Config
from app.config.database import Base, engine

def create_migration():
    """Create Alembic migration for Analysis model"""
    
    # Create tables directly (for quick setup)
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")
    
    # Create migration using Alembic
    print("\nCreating Alembic migration...")
    alembic_cfg = Config("alembic.ini")
    alembic_cfg.set_main_option("sqlalchemy.url", "sqlite:///./data/startups.db")
    
    try:
        command.revision(alembic_cfg, autogenerate=True, message="Add analytics tables")
        print("✓ Migration created successfully")
    except Exception as e:
        print(f"Note: {e}")
        print("Tables already created via SQLAlchemy")

if __name__ == "__main__":
    create_migration()