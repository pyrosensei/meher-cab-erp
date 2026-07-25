"""
backend/app/schemas/auth.py
============================
Pydantic schemas for the authentication endpoints.
"""

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Payload for POST /api/v1/auth/register"""
    email: EmailStr
    password: str = Field(min_length=6, description="Must be at least 6 characters")


class LoginRequest(BaseModel):
    """Payload for POST /api/v1/auth/login"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Response returned by both /register and /login on success."""
    access_token: str
    token_type: str = "bearer"
