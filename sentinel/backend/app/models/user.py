"""
backend/app/models/user.py
===========================
SQLAlchemy ORM model for the users table.

Stores hashed passwords — plaintext passwords never touch the database.
"""

from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.core.database import Base


class User(Base):
    """A registered user of the Sentinel dashboard."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)

    # bcrypt hash of the user's password — never store plaintext!
    hashed_password = Column(String, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    # Automatically set on row creation
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"
