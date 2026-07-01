# Notification database queries
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationUpdate
from typing import Optional

class NotificationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self, skip: int = 0, limit: int = 50) -> list[Notification]:
        result = await self.session.execute(
            select(Notification).order_by(Notification.id.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_id(self, notification_id: int) -> Optional[Notification]:
        return await self.session.get(Notification, notification_id)

    async def create(self, data: NotificationCreate) -> Notification:
        notif = Notification(**data.model_dump())
        self.session.add(notif)
        await self.session.commit()
        await self.session.refresh(notif)
        return notif

    async def update(self, notif: Notification, data: NotificationUpdate) -> Notification:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(notif, field, value)
        await self.session.commit()
        await self.session.refresh(notif)
        return notif
