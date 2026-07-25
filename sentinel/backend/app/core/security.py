"""
backend/app/core/security.py
=============================
JWT creation/verification and bcrypt password hashing.

Uses:
  - python-jose  → JWT encode / decode
  - passlib      → bcrypt hash / verify
"""

from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_session

# ── Password hashing ───────────────────────────────────────────────────────
_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    """Return the bcrypt hash of a plaintext password."""
    return _pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if plain matches the stored bcrypt hash."""
    return _pwd_context.verify(plain, hashed)


# ── JWT ────────────────────────────────────────────────────────────────────

def create_access_token(subject: str) -> str:
    """
    Create a signed JWT.

    Args:
        subject: The value stored in the 'sub' claim (typically user email).

    Returns:
        Encoded JWT string.
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> str:
    """
    Decode and verify a JWT.  Returns the 'sub' claim.
    Raises HTTPException 401 on any failure.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
        subject: str = payload.get("sub")  # type: ignore[assignment]
        if not subject:
            raise credentials_exception
        return subject
    except JWTError:
        raise credentials_exception


# ── FastAPI auth dependency ────────────────────────────────────────────────
_bearer = HTTPBearer()


async def get_current_user_email(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    session: AsyncSession = Depends(get_session),
) -> str:
    """
    FastAPI dependency — extracts and validates the Bearer JWT from the
    Authorization header. Returns the user's email address.

    Usage in a router:
        email: str = Depends(get_current_user_email)
    """
    return decode_token(credentials.credentials)
