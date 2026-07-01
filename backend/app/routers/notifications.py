from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.repositories.notification_repo import NotificationRepository
from app.schemas.notification import NotificationCreate, NotificationUpdate, NotificationOut

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/", response_model=list[NotificationOut])
async def list_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    return await NotificationRepository(session).get_all(skip=skip, limit=limit)

@router.patch("/{notification_id}", response_model=NotificationOut)
async def update_notification(
    notification_id: int, data: NotificationUpdate, session: AsyncSession = Depends(get_session)
):
    repo = NotificationRepository(session)
    notif = await repo.get_by_id(notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return await repo.update(notif, data)
