from pydantic import BaseModel
from typing import Optional
from app.models.notification import NotificationType, NotificationPriority

class NotificationBase(BaseModel):
    notification_id: str
    title: str
    message: str
    type: NotificationType
    read: bool
    timestamp: str
    icon: str
    priority: NotificationPriority

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    read: Optional[bool] = None

class NotificationOut(NotificationBase):
    id: int
    model_config = {"from_attributes": True}
