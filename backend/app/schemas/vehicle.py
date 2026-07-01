from pydantic import BaseModel
from typing import Optional, List
from app.models.vehicle import VehicleStatus, VehicleType, FuelType

class VehicleBase(BaseModel):
    vehicle_id: str
    registration_number: str
    make: str
    model: str
    year: int
    color: str
    type: VehicleType
    fuel_type: FuelType
    status: VehicleStatus
    health_score: int
    fuel_level: int
    mileage: float
    total_km: int
    last_service: Optional[str] = None
    next_service: Optional[str] = None
    insurance_expiry: Optional[str] = None
    fitness_expiry: Optional[str] = None
    driver_id: Optional[str] = None
    driver_name: Optional[str] = None
    location_lat: float
    location_lng: float
    current_speed: int
    features: List[str]

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    status: Optional[VehicleStatus] = None
    health_score: Optional[int] = None
    fuel_level: Optional[int] = None
    driver_id: Optional[str] = None
    driver_name: Optional[str] = None
    current_speed: Optional[int] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None

class VehicleOut(VehicleBase):
    id: int
    model_config = {"from_attributes": True}
