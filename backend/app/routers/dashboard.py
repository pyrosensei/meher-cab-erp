from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.repositories.driver_repo import DriverRepository
from app.repositories.vehicle_repo import VehicleRepository
from app.repositories.trip_repo import TripRepository
from app.models.driver import DriverStatus
from app.models.vehicle import VehicleStatus

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_dashboard_stats(session: AsyncSession = Depends(get_session)):
    """Aggregate KPI stats for the main dashboard."""
    driver_repo = DriverRepository(session)
    vehicle_repo = VehicleRepository(session)
    trip_repo = TripRepository(session)

    return {
        "total_drivers": await driver_repo.count_total(),
        "online_drivers": await driver_repo.count_by_status(DriverStatus.ONLINE),
        "on_trip_drivers": await driver_repo.count_by_status(DriverStatus.ON_TRIP),
        "total_vehicles": await vehicle_repo.count_total(),
        "active_vehicles": await vehicle_repo.count_by_status(VehicleStatus.ACTIVE),
        "total_trips": await trip_repo.count_total(),
        "total_revenue": await trip_repo.sum_revenue(),
    }
