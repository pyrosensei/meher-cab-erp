# Driver database queries — no business logic here
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.driver import Driver, DriverStatus
from app.schemas.driver import DriverCreate, DriverUpdate
from typing import Optional

class DriverRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Driver]:
        result = await self.session.execute(select(Driver).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def get_by_id(self, driver_id: int) -> Optional[Driver]:
        return await self.session.get(Driver, driver_id)

    async def count_by_status(self, status: DriverStatus) -> int:
        result = await self.session.execute(
            select(func.count(Driver.id)).where(Driver.status == status)
        )
        return result.scalar() or 0

    async def count_total(self) -> int:
        result = await self.session.execute(select(func.count(Driver.id)))
        return result.scalar() or 0

    async def create(self, data: DriverCreate) -> Driver:
        driver = Driver(**data.model_dump())
        self.session.add(driver)
        await self.session.commit()
        await self.session.refresh(driver)
        return driver

    async def update(self, driver: Driver, data: DriverUpdate) -> Driver:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(driver, field, value)
        await self.session.commit()
        await self.session.refresh(driver)
        return driver

    async def delete(self, driver: Driver) -> None:
        await self.session.delete(driver)
        await self.session.commit()
