"""
User controller
Handles HTTP requests and responses for user operations
"""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.services.user_service import UserService


class UserController:
    """Controller for user endpoints"""

    def __init__(self, db: Session):
        self.db = db
        self.service = UserService(db)

    def get_all(self, skip: int = 0, limit: int = 100):
        """Get all users"""
        users = self.service.get_all_users(skip, limit)
        return [self._format_user(u) for u in users]

    def get_by_id(self, user_id: int):
        """Get user by ID"""
        user = self.service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found",
            )
        return self._format_user(user, detailed=True)

    def _format_user(self, user: User, detailed: bool = False):
        """Format user object for response"""
        if detailed:
            return {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "bio": user.bio,
                "avatar_url": user.avatar_url,
                "is_active": user.is_active,
                "is_verified": user.is_verified,
                "is_admin": user.is_admin,
                "created_at": user.created_at,
                "updated_at": user.updated_at,
                "last_login": user.last_login,
            }
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "created_at": user.created_at,
        }
