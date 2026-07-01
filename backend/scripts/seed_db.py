"""
Seed the database from JSON files in data/seed/.
Usage: cd backend && python scripts/seed_db.py
"""
import asyncio
import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.core.database import Base
import app.models  # noqa: F401 — registers all models with Base
from app.models.driver import Driver
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.notification import Notification

SEED_DIR = pathlib.Path(__file__).parent.parent / "data" / "seed"

async def seed():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    Session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with Session() as session:
        drivers_data = json.loads((SEED_DIR / "drivers.json").read_text(encoding="utf-8"))
        for d in drivers_data:
            session.add(Driver(**d))
        await session.commit()
        print(f"Seeded {len(drivers_data)} drivers")

        vehicles_data = json.loads((SEED_DIR / "vehicles.json").read_text(encoding="utf-8"))
        for v in vehicles_data:
            session.add(Vehicle(**v))
        await session.commit()
        print(f"Seeded {len(vehicles_data)} vehicles")

        trips_data = json.loads((SEED_DIR / "trips.json").read_text(encoding="utf-8"))
        for t in trips_data:
            session.add(Trip(**t))
        await session.commit()
        print(f"Seeded {len(trips_data)} trips")

        notifs_data = json.loads((SEED_DIR / "notifications.json").read_text(encoding="utf-8"))
        for n in notifs_data:
            session.add(Notification(**n))
        await session.commit()
        print(f"Seeded {len(notifs_data)} notifications")

    print("\nDatabase seeding complete!")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed())
