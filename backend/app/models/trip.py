import enum
from sqlalchemy import String, Integer, Float, Enum as SAEnum, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from datetime import datetime

class TripStatus(str, enum.Enum):
    COMPLETED = "completed"
    IN_PROGRESS = "in-progress"
    SCHEDULED = "scheduled"
    CANCELLED = "cancelled"

class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    UPI = "upi"
    CARD = "card"
    WALLET = "wallet"

class VehicleType(str, enum.Enum):
    SEDAN = "Sedan"
    SUV = "SUV"
    HATCHBACK = "Hatchback"
    PREMIUM = "Premium"

class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    trip_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    driver_id: Mapped[str] = mapped_column(String(20), nullable=False)
    driver_name: Mapped[str] = mapped_column(String(100), nullable=False)
    vehicle_id: Mapped[str] = mapped_column(String(20), nullable=False)
    vehicle_number: Mapped[str] = mapped_column(String(30), nullable=False)
    customer_id: Mapped[str] = mapped_column(String(20), nullable=False)
    customer_name: Mapped[str] = mapped_column(String(100), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(25), nullable=False)
    pickup_address: Mapped[str] = mapped_column(String(255), nullable=False)
    pickup_lat: Mapped[float] = mapped_column(Float, nullable=False)
    pickup_lng: Mapped[float] = mapped_column(Float, nullable=False)
    drop_address: Mapped[str] = mapped_column(String(255), nullable=False)
    drop_lat: Mapped[float] = mapped_column(Float, nullable=False)
    drop_lng: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[TripStatus] = mapped_column(SAEnum(TripStatus), default=TripStatus.SCHEDULED)
    fare: Mapped[float] = mapped_column(Float, nullable=False)
    distance: Mapped[float] = mapped_column(Float, nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    start_time: Mapped[str] = mapped_column(String(50), nullable=False)
    end_time: Mapped[str | None] = mapped_column(String(50), nullable=True)
    payment_method: Mapped[PaymentMethod] = mapped_column(SAEnum(PaymentMethod), default=PaymentMethod.CASH)
    rating: Mapped[float | None] = mapped_column(Float, nullable=True)
    vehicle_type: Mapped[VehicleType] = mapped_column(SAEnum(VehicleType), default=VehicleType.SEDAN)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
