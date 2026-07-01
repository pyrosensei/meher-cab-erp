from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.repositories.vehicle_repo import VehicleRepository
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleOut

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("/", response_model=list[VehicleOut])
async def list_vehicles(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
):
    return await VehicleRepository(session).get_all(skip=skip, limit=limit)

@router.get("/{vehicle_id}", response_model=VehicleOut)
async def get_vehicle(vehicle_id: int, session: AsyncSession = Depends(get_session)):
    vehicle = await VehicleRepository(session).get_by_id(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.post("/", response_model=VehicleOut, status_code=201)
async def create_vehicle(data: VehicleCreate, session: AsyncSession = Depends(get_session)):
    return await VehicleRepository(session).create(data)

@router.patch("/{vehicle_id}", response_model=VehicleOut)
async def update_vehicle(vehicle_id: int, data: VehicleUpdate, session: AsyncSession = Depends(get_session)):
    repo = VehicleRepository(session)
    vehicle = await repo.get_by_id(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return await repo.update(vehicle, data)

@router.delete("/{vehicle_id}", status_code=204)
async def delete_vehicle(vehicle_id: int, session: AsyncSession = Depends(get_session)):
    repo = VehicleRepository(session)
    vehicle = await repo.get_by_id(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    await repo.delete(vehicle)
