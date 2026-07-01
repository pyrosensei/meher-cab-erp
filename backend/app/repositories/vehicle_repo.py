# Vehicle database queries
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleUpdate
from typing import Optional

class VehicleRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Vehicle]:
        result = await self.session.execute(select(Vehicle).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def get_by_id(self, vehicle_id: int) -> Optional[Vehicle]:
        return await self.session.get(Vehicle, vehicle_id)

    async def count_total(self) -> int:
        result = await self.session.execute(select(func.count(Vehicle.id)))
        return result.scalar() or 0

    async def count_by_status(self, status: VehicleStatus) -> int:
        result = await self.session.execute(
            select(func.count(Vehicle.id)).where(Vehicle.status == status)
        )
        return result.scalar() or 0

    async def create(self, data: VehicleCreate) -> Vehicle:
        vehicle = Vehicle(**data.model_dump())
        self.session.add(vehicle)
        await self.session.commit()
        await self.session.refresh(vehicle)
        return vehicle

    async def update(self, vehicle: Vehicle, data: VehicleUpdate) -> Vehicle:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(vehicle, field, value)
        await self.session.commit()
        await self.session.refresh(vehicle)
        return vehicle

    async def delete(self, vehicle: Vehicle) -> None:
        await self.session.delete(vehicle)
        await self.session.commit()
