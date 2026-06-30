"""
Authentication routes
API endpoints for login, register, and user profile
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.auth import (
    Token,
    UserLogin,
    UserProfile,
    UserRegister,
)
from app.utils.auth import create_access_token, get_password_hash, verify_password
from app.utils.auth_dependencies import get_current_active_user

router = APIRouter()


@router.post(
    "/register",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
    tags=["Authentication"],
    summary="Register a new user",
    description="Create a new user account with email, username, and password",
)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user

    Steps:
    1. Check if email already exists
    2. Check if username already exists
    3. Hash the password
    4. Create new user in database
    5. Generate JWT token
    6. Return token
    """
    # Check if email exists
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Check if username exists
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token = create_access_token(data={"sub": str(new_user.id)})

    return Token(access_token=access_token, token_type="bearer")


@router.post(
    "/login",
    response_model=Token,
    tags=["Authentication"],
    summary="Login user",
    description="Authenticate user and return JWT token",
)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login user

    Steps:
    1. Find user by email
    2. Verify password
    3. Generate JWT token
    4. Update last_login timestamp
    5. Return token
    """
    # Find user
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    # Update last login timestamp
    from datetime import datetime, timezone

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=None,  # Use default from settings
    )

    return Token(access_token=access_token, token_type="bearer")


@router.get(
    "/me",
    response_model=UserProfile,
    tags=["Authentication"],
    summary="Get current user profile",
    description="Get the authenticated user's profile information",
)
async def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """
    Get current user profile

    Returns the profile information of the currently authenticated user
    """
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        bio=current_user.bio,
        avatar_url=current_user.avatar_url,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        is_admin=current_user.is_admin,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None,
        updated_at=current_user.updated_at.isoformat() if current_user.updated_at else None,
        last_login=current_user.last_login.isoformat() if current_user.last_login else None,
    )