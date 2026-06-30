"""
Admin middleware
Provides role-based access control for admin routes
"""

from fastapi import HTTPException, status, Depends, Request
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.user import User


async def require_admin(request: Request, db: Session = Depends(get_db)):
    """
    Dependency to require admin role
    Checks JWT token for admin privileges
    """
    # Get token from authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )

    try:
        # Extract token
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )

        # Decode token (placeholder - use actual JWT decode in production)
        # from app.utils.jwt import decode_token
        # token_data = decode_token(token)
        
        # For now, just check if user exists and is admin
        # In production, properly decode and validate JWT
        user_id = request.state.user_id if hasattr(request.state, 'user_id') else None
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        if not user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        return user

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )