"""Convert structured data into text chunks for RAG."""

from __future__ import annotations

from typing import Any


def chunk_driver(driver: dict[str, Any]) -> list[dict[str, Any]]:
    """Convert a driver record into text chunks."""
    text = (
        f"Driver {driver['name']} ({driver['driver_id']}) - "
        f"Status: {driver['status']}, Rating: {driver['rating']}/5.0, "
        f"Total Trips: {driver['total_trips']}, Total Earnings: ₹{driver['total_earnings']}, "
        f"Completion Rate: {driver['completion_rate']}%, "
        f"Acceptance Rate: {driver['acceptance_rate']}%, "
        f"Cancellation Rate: {driver['cancellation_rate']}%. "
        f"Vehicle: {driver['vehicle_id']} ({driver['vehicle_number']}), "
        f"License: {driver['license_number']}. "
        f"Address: {driver['address']}. "
        f"Documents: {', '.join(d['type'] + ' (' + d['status'] + ')' for d in driver['documents'])}."
    )
    return [{
        "text": text,
        "type": "driver",
        "metadata": {
            "driver_id": driver["driver_id"],
            "name": driver["name"],
            "status": driver["status"],
            "rating": driver["rating"],
        }
    }]


def chunk_vehicle(vehicle: dict[str, Any]) -> list[dict[str, Any]]:
    """Convert a vehicle record into text chunks."""
    driver_info = f"Assigned to {vehicle['driver_name']} ({vehicle['driver_id']})" if vehicle.get("driver_id") else "Unassigned"
    text = (
        f"Vehicle {vehicle['registration_number']} ({vehicle['vehicle_id']}) - "
        f"{vehicle['year']} {vehicle['make']} {vehicle['model']} ({vehicle['type']}), "
        f"Color: {vehicle['color']}, Fuel: {vehicle['fuel_type']}. "
        f"Status: {vehicle['status']}, Health Score: {vehicle['health_score']}%, "
        f"Fuel Level: {vehicle['fuel_level']}%, Mileage: {vehicle['mileage']} km/l, "
        f"Total KM: {vehicle['total_km']}. "
        f"Last Service: {vehicle['last_service']}, Next Service Due: {vehicle['next_service']}. "
        f"Insurance Expiry: {vehicle['insurance_expiry']}, Fitness Expiry: {vehicle['fitness_expiry']}. "
        f"Location: ({vehicle['location_lat']}, {vehicle['location_lng']}), Speed: {vehicle['current_speed']} km/h. "
        f"Features: {', '.join(vehicle['features'])}. {driver_info}."
    )
    return [{
        "text": text,
        "type": "vehicle",
        "metadata": {
            "vehicle_id": vehicle["vehicle_id"],
            "registration": vehicle["registration_number"],
            "status": vehicle["status"],
            "health_score": vehicle["health_score"],
        }
    }]


def chunk_trip(trip: dict[str, Any]) -> list[dict[str, Any]]:
    """Convert a trip record into text chunks."""
    text = (
        f"Trip {trip['trip_id']} - Driver: {trip['driver_name']} ({trip['driver_id']}), "
        f"Vehicle: {trip['vehicle_number']} ({trip['vehicle_id']}), "
        f"Customer: {trip['customer_name']} ({trip['customer_id']}). "
        f"Pickup: {trip['pickup_address']} ({trip['pickup_lat']}, {trip['pickup_lng']}), "
        f"Drop: {trip['drop_address']} ({trip['drop_lat']}, {trip['drop_lng']}). "
        f"Status: {trip['status']}, Fare: ₹{trip['fare']}, "
        f"Distance: {trip['distance']} km, Duration: {trip['duration']} min. "
        f"Start: {trip['start_time']}, End: {trip['end_time'] or 'In Progress'}. "
        f"Payment: {trip['payment_method']}, Rating: {trip['rating'] or 'N/A'}. "
        f"Vehicle Type: {trip['vehicle_type']}."
    )
    return [{
        "text": text,
        "type": "trip",
        "metadata": {
            "trip_id": trip["trip_id"],
            "driver_id": trip["driver_id"],
            "vehicle_id": trip["vehicle_id"],
            "status": trip["status"],
            "fare": trip["fare"],
            "distance": trip["distance"],
        }
    }]


def chunk_notification(notification: dict[str, Any]) -> list[dict[str, Any]]:
    """Convert a notification record into text chunks."""
    text = (
        f"Notification {notification.get('notification_id', notification.get('notification_id', 'N/A'))} - "
        f"Title: {notification['title']}. "
        f"Message: {notification['message']}. "
        f"Type: {notification['type']}, Priority: {notification.get('priority', 'medium')}. "
        f"Timestamp: {notification['timestamp']}. "
        f"Read: {notification.get('read', False)}."
    )
    return [{
        "text": text,
        "type": "notification",
        "metadata": {
            "notification_id": notification.get("notification_id", "N/A"),
            "type": notification["type"],
            "priority": notification.get("priority", "medium"),
            "timestamp": notification["timestamp"],
        }
    }]


def chunk_all_data(data: dict[str, list[dict[str, Any]]]) -> list[dict[str, Any]]:
    """Convert all seed data into chunks."""
    chunks = []
    for driver in data.get("drivers", []):
        chunks.extend(chunk_driver(driver))
    for vehicle in data.get("vehicles", []):
        chunks.extend(chunk_vehicle(vehicle))
    for trip in data.get("trips", []):
        chunks.extend(chunk_trip(trip))
    for notification in data.get("notifications", []):
        chunks.extend(chunk_notification(notification))
    return chunks