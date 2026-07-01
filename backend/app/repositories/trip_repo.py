# Trip database queries
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.trip import Trip, TripStatus
from app.schemas.trip import TripCreate, TripUpdate
from typing import Optional

class TripRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Trip]:
        result = await self.session.execute(
            select(Trip).order_by(Trip.id.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_id(self, trip_id: int) -> Optional[Trip]:
        return await self.session.get(Trip, trip_id)

    async def count_total(self) -> int:
        result = await self.session.execute(select(func.count(Trip.id)))
        return result.scalar() or 0

    async def sum_revenue(self) -> float:
        result = await self.session.execute(
            select(func.sum(Trip.fare)).where(Trip.status == TripStatus.COMPLETED)
        )
        return float(result.scalar() or 0)

    async def create(self, data: TripCreate) -> Trip:
        trip = Trip(**data.model_dump())
        self.session.add(trip)
        await self.session.commit()
        await self.session.refresh(trip)
        return trip

    async def update(self, trip: Trip, data: TripUpdate) -> Trip:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(trip, field, value)
        await self.session.commit()
        await self.session.refresh(trip)
        return trip

    async def delete(self, trip: Trip) -> None:
        await self.session.delete(trip)
        await self.session.commit()
