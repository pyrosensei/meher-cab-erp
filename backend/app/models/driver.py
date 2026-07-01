import enum
from sqlalchemy import String, Integer, Float, Boolean, Enum as SAEnum, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from datetime import datetime

class DriverStatus(str, enum.Enum):
    ONLINE = "online"
    ON_TRIP = "on-trip"
    OFFLINE = "offline"

class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    driver_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(25), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    avatar: Mapped[str] = mapped_column(String(10), nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=5.0)
    total_trips: Mapped[int] = mapped_column(Integer, default=0)
    total_earnings: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[DriverStatus] = mapped_column(SAEnum(DriverStatus), default=DriverStatus.OFFLINE)
    current_trip: Mapped[str | None] = mapped_column(String(20), nullable=True)
    vehicle_id: Mapped[str | None] = mapped_column(String(20), nullable=True)
    vehicle_number: Mapped[str | None] = mapped_column(String(30), nullable=True)
    license_number: Mapped[str] = mapped_column(String(50), nullable=False)
    join_date: Mapped[str] = mapped_column(String(50), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    emergency_contact: Mapped[str] = mapped_column(String(25), nullable=False)
    documents: Mapped[list] = mapped_column(JSON, default=list)
    weekly_earnings: Mapped[list] = mapped_column(JSON, default=list)
    completion_rate: Mapped[float] = mapped_column(Float, default=0.0)
    acceptance_rate: Mapped[float] = mapped_column(Float, default=0.0)
    cancellation_rate: Mapped[float] = mapped_column(Float, default=0.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
