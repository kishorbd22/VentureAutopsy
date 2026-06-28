"""
User service
Business logic layer for user operations
"""

from sqlalchemy.orm import Session

from app.models.user import User


class UserService:
    """Service class for user business logic"""

    def __init__(self, db: Session):
        self.db = db

    def get_all_users(self, skip: int = 0, limit: int = 100):
        """Get all users with pagination"""
        return self.db.query(User).offset(skip).limit(limit).all()

    def get_user_by_id(self, user_id: int):
        """Get a specific user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str):
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()
