"""
Authentication schemas for login, register, and token operations
"""

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    """Schema for user registration"""

    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str | None = None


class UserLogin(BaseModel):
    """Schema for user login"""

    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for JWT token response"""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for token payload data"""

    user_id: int | None = None
    email: str | None = None


class UserProfile(BaseModel):
    """Schema for user profile response"""

    id: int
    email: str
    username: str
    full_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    is_active: bool
    is_verified: bool
    is_admin: bool
    created_at: str | None = None
    updated_at: str | None = None
    last_login: str | None = None

    model_config = {"from_attributes": True}