import pytest

@pytest.mark.asyncio
async def test_list_drivers_empty(client):
    response = await client.get("/api/v1/drivers/")
    assert response.status_code == 200
    assert response.json() == []

@pytest.mark.asyncio
async def test_create_and_get_driver(client):
    payload = {
        "driver_id": "DRV-TEST",
        "name": "Test Driver",
        "phone": "+91 9876543210",
        "email": "test@mehercabs.in",
        "avatar": "TD",
        "rating": 4.5,
        "total_trips": 100,
        "total_earnings": 50000.0,
        "status": "offline",
        "current_trip": None,
        "vehicle_id": None,
        "vehicle_number": None,
        "license_number": "DL-TEST123",
        "join_date": "2024-01-01T00:00:00.000Z",
        "address": "Test Address, Delhi NCR",
        "emergency_contact": "+91 9876543211",
        "documents": [],
        "weekly_earnings": [1000, 1200, 1100, 1300, 1400, 1600, 1500],
        "completion_rate": 90.0,
        "acceptance_rate": 85.0,
        "cancellation_rate": 5.0
    }
    create = await client.post("/api/v1/drivers/", json=payload)
    assert create.status_code == 201
    driver_id = create.json()["id"]

    get = await client.get(f"/api/v1/drivers/{driver_id}")
    assert get.status_code == 200
    assert get.json()["name"] == "Test Driver"

@pytest.mark.asyncio
async def test_driver_not_found(client):
    response = await client.get("/api/v1/drivers/9999")
    assert response.status_code == 404
