from pydantic import BaseModel
from typing import Optional
from app.models.trip import TripStatus, PaymentMethod, VehicleType

class TripBase(BaseModel):
    trip_id: str
    driver_id: str
    driver_name: str
    vehicle_id: str
    vehicle_number: str
    customer_id: str
    customer_name: str
    customer_phone: str
    pickup_address: str
    pickup_lat: float
    pickup_lng: float
    drop_address: str
    drop_lat: float
    drop_lng: float
    status: TripStatus
    fare: float
    distance: float
    duration: int
    start_time: str
    end_time: Optional[str] = None
    payment_method: PaymentMethod
    rating: Optional[float] = None
    vehicle_type: VehicleType

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    status: Optional[TripStatus] = None
    end_time: Optional[str] = None
    rating: Optional[float] = None
    fare: Optional[float] = None

class TripOut(TripBase):
    id: int
    model_config = {"from_attributes": True}
