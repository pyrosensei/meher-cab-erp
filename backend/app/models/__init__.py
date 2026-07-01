# Import all models so SQLAlchemy Base.metadata is fully populated for create_all
from app.models.driver import Driver
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.notification import Notification

__all__ = ["Driver", "Vehicle", "Trip", "Notification"]
