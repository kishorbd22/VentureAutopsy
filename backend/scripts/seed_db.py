#!/usr/bin/env python3
"""
Database seed script
Populates the database with initial data for development and testing
"""

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from sqlalchemy.orm import Session

from app.config.database import SessionLocal, engine
from app.models.user import User
from app.utils.auth import get_password_hash


def seed_users(db: Session):
    """Seed default users"""
    existing_admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not existing_admin:
        admin = User(
            email="admin@example.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            full_name="System Administrator",
            is_active=True,
            is_verified=True,
            is_admin=True,
        )
        db.add(admin)
        print("✓ Created admin user: admin@example.com / admin123")

    existing_user = db.query(User).filter(User.email == "user@example.com").first()
    if not existing_user:
        user = User(
            email="user@example.com",
            username="demo",
            hashed_password=get_password_hash("demo123"),
            full_name="Demo User",
            is_active=True,
            is_verified=True,
            is_admin=False,
        )
        db.add(user)
        print("✓ Created demo user: user@example.com / demo123")

    db.commit()


def main():
    print("Starting database seed...")
    db = SessionLocal()
    try:
        seed_users(db)
        print("Database seeded successfully")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()