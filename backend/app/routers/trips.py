from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.repositories.trip_repo import TripRepository
from app.schemas.trip import TripCreate, TripUpdate, TripOut

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("/", response_model=list[TripOut])
async def list_trips(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
):
    return await TripRepository(session).get_all(skip=skip, limit=limit)

@router.get("/{trip_id}", response_model=TripOut)
async def get_trip(trip_id: int, session: AsyncSession = Depends(get_session)):
    trip = await TripRepository(session).get_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.post("/", response_model=TripOut, status_code=201)
async def create_trip(data: TripCreate, session: AsyncSession = Depends(get_session)):
    return await TripRepository(session).create(data)

@router.patch("/{trip_id}", response_model=TripOut)
async def update_trip(trip_id: int, data: TripUpdate, session: AsyncSession = Depends(get_session)):
    repo = TripRepository(session)
    trip = await repo.get_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return await repo.update(trip, data)

@router.delete("/{trip_id}", status_code=204)
async def delete_trip(trip_id: int, session: AsyncSession = Depends(get_session)):
    repo = TripRepository(session)
    trip = await repo.get_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    await repo.delete(trip)
