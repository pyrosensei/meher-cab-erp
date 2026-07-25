"""
backend/app/routers/auth.py
============================
Authentication endpoints.

POST /api/v1/auth/register  — create a new account, return JWT
POST /api/v1/auth/login     — verify credentials, return JWT
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse

router = APIRouter(tags=["Auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(
    body: RegisterRequest,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    """
    Create a new user account.

    - Checks that the email isn't already taken.
    - Hashes the password with bcrypt.
    - Issues a JWT on success (user is immediately logged in after registering).
    """
    # Check if email is already registered
    existing = await session.scalar(select(User).where(User.email == body.email))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Create the user row (password is hashed — never stored in plaintext)
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    # Issue a JWT so the frontend can log in immediately after registration
    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    """
    Authenticate an existing user.

    - Looks up the user by email.
    - Verifies the bcrypt password hash.
    - Issues a JWT on success.
    """
    user = await session.scalar(select(User).where(User.email == body.email))

    # Use a constant-time comparison via passlib to prevent timing attacks
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token)
