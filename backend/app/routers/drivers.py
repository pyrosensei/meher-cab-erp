from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.repositories.driver_repo import DriverRepository
from app.schemas.driver import DriverCreate, DriverUpdate, DriverOut

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("/", response_model=list[DriverOut])
async def list_drivers(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
):
    return await DriverRepository(session).get_all(skip=skip, limit=limit)

@router.get("/{driver_id}", response_model=DriverOut)
async def get_driver(driver_id: int, session: AsyncSession = Depends(get_session)):
    driver = await DriverRepository(session).get_by_id(driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@router.post("/", response_model=DriverOut, status_code=201)
async def create_driver(data: DriverCreate, session: AsyncSession = Depends(get_session)):
    return await DriverRepository(session).create(data)

@router.patch("/{driver_id}", response_model=DriverOut)
async def update_driver(driver_id: int, data: DriverUpdate, session: AsyncSession = Depends(get_session)):
    repo = DriverRepository(session)
    driver = await repo.get_by_id(driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return await repo.update(driver, data)

@router.delete("/{driver_id}", status_code=204)
async def delete_driver(driver_id: int, session: AsyncSession = Depends(get_session)):
    repo = DriverRepository(session)
    driver = await repo.get_by_id(driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    await repo.delete(driver)
