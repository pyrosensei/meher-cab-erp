import enum
from sqlalchemy import String, Integer, Float, Boolean, Enum as SAEnum, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from datetime import datetime

class VehicleStatus(str, enum.Enum):
    ACTIVE = "active"
    MAINTENANCE = "maintenance"
    INACTIVE = "inactive"
    OUT_OF_SERVICE = "out-of-service"

class VehicleType(str, enum.Enum):
    SEDAN = "Sedan"
    SUV = "SUV"
    HATCHBACK = "Hatchback"
    PREMIUM = "Premium"

class FuelType(str, enum.Enum):
    PETROL = "Petrol"
    DIESEL = "Diesel"
    CNG = "CNG"
    ELECTRIC = "Electric"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    vehicle_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    registration_number: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    make: Mapped[str] = mapped_column(String(50), nullable=False)
    model: Mapped[str] = mapped_column(String(80), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    color: Mapped[str] = mapped_column(String(30), nullable=False)
    type: Mapped[VehicleType] = mapped_column(SAEnum(VehicleType), nullable=False)
    fuel_type: Mapped[FuelType] = mapped_column(SAEnum(FuelType), nullable=False)
    status: Mapped[VehicleStatus] = mapped_column(SAEnum(VehicleStatus), default=VehicleStatus.ACTIVE)
    health_score: Mapped[int] = mapped_column(Integer, default=100)
    fuel_level: Mapped[int] = mapped_column(Integer, default=100)
    mileage: Mapped[float] = mapped_column(Float, default=0.0)
    total_km: Mapped[int] = mapped_column(Integer, default=0)
    last_service: Mapped[str | None] = mapped_column(String(50), nullable=True)
    next_service: Mapped[str | None] = mapped_column(String(50), nullable=True)
    insurance_expiry: Mapped[str | None] = mapped_column(String(50), nullable=True)
    fitness_expiry: Mapped[str | None] = mapped_column(String(50), nullable=True)
    driver_id: Mapped[str | None] = mapped_column(String(20), nullable=True)
    driver_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    location_lat: Mapped[float] = mapped_column(Float, default=28.6139)
    location_lng: Mapped[float] = mapped_column(Float, default=77.2090)
    current_speed: Mapped[int] = mapped_column(Integer, default=0)
    features: Mapped[list] = mapped_column(JSON, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
