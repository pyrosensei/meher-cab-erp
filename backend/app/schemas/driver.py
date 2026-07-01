from pydantic import BaseModel
from typing import Optional, List
from app.models.driver import DriverStatus

class DriverBase(BaseModel):
    driver_id: str
    name: str
    phone: str
    email: str
    avatar: str
    rating: float
    total_trips: int
    total_earnings: float
    status: DriverStatus
    current_trip: Optional[str] = None
    vehicle_id: Optional[str] = None
    vehicle_number: Optional[str] = None
    license_number: str
    join_date: str
    address: str
    emergency_contact: str
    documents: List[dict]
    weekly_earnings: List[float]
    completion_rate: float
    acceptance_rate: float
    cancellation_rate: float

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[DriverStatus] = None
    rating: Optional[float] = None
    vehicle_id: Optional[str] = None
    vehicle_number: Optional[str] = None
    current_trip: Optional[str] = None

class DriverOut(DriverBase):
    id: int
    model_config = {"from_attributes": True}
