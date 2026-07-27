"""
sentinel/mock-container/main.py
===============================
Cab fleet telemetry generator simulating a real operations center
for Meher Cab ERP in Delhi NCR.

Endpoints:
  GET /health  → liveness check
  GET /logs    → fleet operation log entries
  GET /metrics → cab-fleet KPI snapshot
"""

import os
import random
import threading
import time
from datetime import datetime, timezone
from typing import Optional

import uvicorn
from fastapi import FastAPI, Query

# ── App ────────────────────────────────────────────────────────────────────
app = FastAPI(title="Meher Cab Fleet Telemetry", version="2.0.0")

# ── In-memory buffers ──────────────────────────────────────────────────────
_logs: list[dict] = []
_metrics: dict = {}
_logs_lock = threading.Lock()
_metrics_lock = threading.Lock()

MAX_LOGS = 10_000

# ── Delhi NCR cab fleet data ───────────────────────────────────────────────

DRIVERS = [
    "Amit Kumar", "Rahul Singh", "Suresh Sharma", "Vikram Verma",
    "Pradeep Gupta", "Manoj Yadav", "Rajesh Chauhan", "Sanjay Joshi",
    "Deepak Pandey", "Arun Mishra", "Vinod Tiwari", "Ramesh Rawat",
    "Naveen Negi", "Rohit Malik", "Sunil Saini", "Ajay Choudhary",
    "Prakash Thakur", "Ravi Bhat", "Ashok Reddy", "Vikas Iyer",
    "Dinesh Mehta", "Mukesh Patel", "Santosh Srivastava", "Bharat Dwivedi",
    "Gopal Saxena", "Kishan Agarwal", "Mohan Kapoor", "Naresh Sethi",
    "Pawan Arora", "Tarun Batra",
]

VEHICLES = [
    ("DL 1C A 1001", "Maruti Suzuki", "Swift Dzire", "White"),
    ("DL 2C B 2034", "Hyundai", "Aura", "Silver"),
    ("DL 3C C 3421", "Toyota", "Innova Crysta", "Black"),
    ("DL 4C D 4567", "Honda", "City", "Grey"),
    ("DL 5C E 5842", "Tata", "Nexon EV", "Blue"),
    ("DL 6C F 6123", "Mahindra", "XUV700", "Red"),
    ("DL 7C G 7890", "Kia", "Seltos", "White"),
    ("DL 8C H 8345", "MG", "Hector", "Silver"),
    ("DL 9C I 9012", "Volkswagen", "Virtus", "Black"),
    ("DL 1C J 1122", "Skoda", "Slavia", "Grey"),
    ("DL 2C K 2233", "Maruti Suzuki", "Ertiga", "Blue"),
    ("DL 3C L 3344", "Hyundai", "Creta", "Red"),
    ("DL 4C M 4455", "Toyota", "Fortuner", "White"),
    ("DL 5C N 5566", "Honda", "Amaze", "Silver"),
    ("DL 6C O 6677", "Tata", "Tigor EV", "Black"),
    ("DL 7C P 7788", "Mahindra", "Scorpio N", "Grey"),
    ("DL 8C Q 8899", "Maruti Suzuki", "Baleno", "Blue"),
    ("DL 9C R 9900", "Hyundai", "Verna", "Red"),
    ("DL 1C S 1010", "Kia", "Carens", "White"),
    ("DL 2C T 2121", "Maruti Suzuki", "Brezza", "Silver"),
    ("DL 3C U 3232", "Hyundai", "i20", "Black"),
    ("DL 4C V 4343", "Hyundai", "Venue", "Grey"),
    ("DL 5C W 5454", "Toyota", "Glanza", "Blue"),
    ("DL 6C X 6565", "Maruti Suzuki", "Ciaz", "Red"),
    ("DL 7C Y 7676", "Maruti Suzuki", "Suzuki", "White"),
]

CUSTOMERS = [
    "Priya Sharma", "Arun Verma", "Neha Gupta", "Ravi Patel",
    "Sneha Reddy", "Vijay Singh", "Pooja Mehta", "Ankit Jain",
    "Kavita Nair", "Rohit Khanna", "Deepa Iyer", "Manoj Saxena",
    "Anjali Desai", "Siddharth Rao", "Meera Choudhury", "Karan Bajaj",
    "Divya Menon", "Aditya Pandit", "Ritu Kapoor", "Gaurav Bhatia",
    "Swati Mishra", "Harsh Agarwal", "Nidhi Tiwari", "Sahil Sethi",
    "Isha Chauhan", "Pranav Joshi", "Shreya Arora", "Dhruv Malhotra",
    "Tanya Kaur", "Abhishek Sinha",
]

PICKUP_LOCATIONS = [
    "Connaught Place", "Karol Bagh", "Lajpat Nagar", "Saket",
    "Dwarka Sector 12", "Rohini Sector 7", "Pitampura", "Janakpuri",
    "Vasant Kunj", "Greater Kailash I", "Hauz Khas Village",
    "Nehru Place", "Rajouri Garden", "Patel Nagar", "Moti Nagar",
    "Punjabi Bagh Club Road", "Model Town", "Civil Lines Metro",
    "Chandni Chowk", "Paharganj Railway Station",
    "Noida Sector 18 Market", "Noida Sector 62",
    "Gurugram Sector 29", "Gurugram DLF Phase 3",
    "Faridabad NIT", "Ghaziabad Indirapuram",
    "Mayur Vihar Phase 1", "Preet Vihar",
    "Vasant Vihar", "Defence Colony Market",
    "Laxmi Nagar Metro", "Kashmere Gate ISBT",
    "Aerocity", "IGI Airport T3", "Anand Vihar Terminal",
]

DROP_LOCATIONS = [
    "Cyber Hub Gurugram", "Okhla Phase 2", "Noida Sector 44",
    "Gurugram Udyog Vihar", "Saket Select Citywalk",
    "Dwarka Sector 21 Metro", "Rohini West Metro",
    "Vasant Kunj Ambience Mall", "Greater Kailash M Block",
    "Hauz Khas Fort", "Nehru Place Metro", "Rajouri Garden Pacific Mall",
    "Patel Nagar Metro", "Punjabi Bagh West", "Model Town 3",
    "Civil Lines", "Chandni Chowk Red Fort",
    "Noida Sector 15 Metro", "Noida Sector 16 Stadium",
    "Gurugram MG Road", "Gurugram Golf Course Road",
    "Faridabad Sector 12", "Ghaziabad Kavi Nagar",
    "Mayur Vihar Pocket 1", "Preet Vihar Metro",
    "Vasant Vihar Japanese Park", "Defence Colony Flyover",
    "Aerocity Mahipalpur", "IGI Airport T1", "Sarojini Nagar Market",
    "India Gate", "Lodhi Garden",
]

TRIP_STATUS_EVENTS = [
    "Trip {trip_id} started: {driver} in {vehicle} picked up customer {customer} from {pickup} \u2192 {drop}",
    "Trip {trip_id} en route: {driver} travelling from {pickup} towards {drop} — ETA {eta}",
    "Trip {trip_id} completed: {driver} dropped {customer} at {drop} — fare {fare} | distance {dist} km | rating {rating}",
    "Trip {trip_id} cancelled: {customer} cancelled after {wait} min wait — driver {driver} en route",
    "Trip {trip_id} diverted: {driver} rerouted via {alt_route} due to traffic near {location}",
    "Trip {trip_id} extended: {customer} requested additional stop at {stop} before {drop}",
    "Trip {trip_id} waiting: {driver} arrived at {pickup} — {customer} notified, ETA to passenger {wait} min",
]

FLEET_EVENTS = [
    "Vehicle {vehicle} fuel level critical: {fuel}% — directing {driver} to nearest pump in {area}",
    "Maintenance alert: {vehicle} ({make} {model}) due for service at {km} km — next service {days}d",
    "GPS signal lost on {vehicle} at {location} — last known position lat {lat}, lng {lng}",
    "Insurance expiry reminder: {vehicle} insurance expires in {days} days — renewal required",
    "Speed violation: {vehicle} clocked at {speed} km/h in zone near {location} — driver {driver} warned",
    "Battery low warning: {vehicle} ({model}) at {fuel}% charge — pulling into {location} charging station",
    "Driver check-in: {driver} marked online from {location} — assigned zone {zone}",
    "Driver break: {driver} going off-duty near {location} — replacement needed for zone {zone}",
    "Idle vehicle: {vehicle} stationary for {mins} min at {location} — driver {driver} may be on break",
    "Decongestion signal: {vehicle} re-routed from {location} to avoid 2 km jam on {road}",
    "Rider complaint logged: {customer} reported {issue} in {vehicle} ({make} {model}) — driver {driver}",
]

SYSTEM_EVENTS = [
    "Fleet backend: dispatch optimization cycle completed — {trips} trips assigned in {ms}ms",
    "Payment gateway: invoice {txn} settled for trip {trip_id} — amount {amount}",
    "Fleet backend: surge pricing active in zone {zone} — multiplier x{mult}",
    "Analytics: daily fleet report generated — {trips} trips | {rev} revenue | {rate}% completion",
    "Fleet backend: driver {driver} incentive of {amount} credited for completing {trips} trips today",
    "SMS gateway: OTP sent to {customer} for trip {trip_id}",
    "Fleet backend: new ride request #{req_id} — {customer} from {pickup} to {drop}",
    "Fleet backend: driver {driver} accepted trip {trip_id} — {pickup} \u2192 {drop}",
    "Support ticket #{ticket} opened: {customer} reported lost item in {vehicle}",
    "Rate update: base fare revised to {base_amt} for zone {zone} effective tomorrow",
]

KPI_METRICS = [
    "KPI snapshot :: active_trips={active} fleet_health={health} drivers_online={online} avg_wait={wait}min rev_hr={rev} trip_rate={rate}%",
]

def _pick_driver() -> str:
    return random.choice(DRIVERS)

def _pick_vehicle() -> tuple[str, str, str, str]:
    return random.choice(VEHICLES)

def _pick_customer() -> str:
    return random.choice(CUSTOMERS)

def _pick_pickup() -> str:
    return random.choice(PICKUP_LOCATIONS)

def _pick_drop() -> str:
    return random.choice(DROP_LOCATIONS)

def _trip_id() -> str:
    return f"TRP-{random.randint(1000, 9999)}"

def _req_id() -> str:
    return f"REQ-{random.randint(10000, 99999)}"

def _txn_id() -> str:
    return f"TXN{random.randint(100000, 999999)}"

def _ticket_id() -> str:
    return f"TKT-{random.randint(10000, 99999)}"


LOG_TEMPLATES: dict[str, list[str]] = {
    "INFO": [
        *TRIP_STATUS_EVENTS,
        *[e for e in FLEET_EVENTS if "critical" not in e.lower() and "violation" not in e.lower() and "lost" not in e.lower()],
        *[e for e in SYSTEM_EVENTS if "surge" not in e.lower()],
        *KPI_METRICS,
    ],
    "WARNING": [
        *[e for e in FLEET_EVENTS if any(w in e.lower() for w in ("critical", "violation", "lost", "low", "idle", "decongestion", "complaint"))],
        "Surge pricing active in zone {zone} — multiplier x{mult}",
        "Driver {driver} completion rate dropped to {rate}% — below threshold of 85%",
        "Peak hour traffic detected near {location} — fleet rerouting {count} vehicles",
        "Driver {driver} acceptance rate at {rate}% — approaching minimum threshold",
        "Vehicle {vehicle} AC malfunction reported by {customer} — scheduling service",
        "Ride request #{req_id} unassigned for {wait}s — escalating to supervisor",
        "Driver {driver} reported road closure at {location} — trip {trip_id} affected",
    ],
    "ERROR": [
        "Trip {trip_id} abandoned: {driver} cancelled mid-trip — {customer} stranded at {location}",
        "CRITICAL: GPS outage in {location} zone — {count} vehicles offline",
        "CRITICAL: Payment gateway timeout for trip {trip_id} — amount {amount} at risk",
        "CRITICAL: Fleet dispatch service down — failover initiated, {count} requests queued",
        "Driver {driver} involved in incident near {location} — emergency protocols activated",
        "Database connection lost in dispatch service — retry {retry}/5",
        "Vehicle {vehicle} engine trouble reported — towing required from {location}",
        "CRITICAL: Surge pricing engine miscalculation — correcting {count} trip fares",
        "Billing reconciliation failed for trip {trip_id} ({customer}) — mismatch of {amount}",
        "CRITICAL: Driver SDK mass disconnect — {count} drivers lost heartbeat",
    ],
}

SPIKE_MESSAGES = {
    "ERROR": [
        "CRITICAL: Fleet dispatch DB primary down — all trip assignment failing over",
        "CRITICAL: Widespread GPS blackout across Delhi NCR — {count} vehicles untracked",
        "CRITICAL: Driver app crash loop detected — {count} drivers affected, version 3.2.1 rolled back",
    ],
    "WARNING": [
        "ALERT: Trip completion rate dropped to {rate}% in last 15 min — ops team notified",
        "ALERT: Average wait time spiked to {wait} min — surge pricing activating in {zone}",
        "ALERT: {count} ride requests timing out simultaneously in {location} — checking dispatch",
    ],
}


def _location_tag() -> str:
    return random.choice(PICKUP_LOCATIONS + DROP_LOCATIONS)

def _fill(template: str) -> str:
    if template.startswith("KPI snapshot"):
        return template.format(
            active=random.randint(18, 45),
            health=round(random.uniform(82.0, 98.5), 1),
            online=random.randint(20, 30),
            wait=round(random.uniform(2.5, 12.0), 1),
            rev=round(random.uniform(450, 1200), 0),
            rate=round(random.uniform(88.0, 99.0), 1),
        )

    vehicle, make, model, color = _pick_vehicle()
    driver = _pick_driver()
    customer = _pick_customer()
    pickup = _pick_pickup()
    drop = _pick_drop()
    trip = _trip_id()
    req = _req_id()
    txn = _txn_id()
    ticket = _ticket_id()
    location = _location_tag()

    fields = {
        "trip_id": trip,
        "driver": driver,
        "vehicle": vehicle,
        "make": make,
        "model": model,
        "color": color,
        "customer": customer,
        "pickup": pickup,
        "drop": drop,
        "location": location,
        "eta": f"{random.randint(5, 25)} min",
        "fare": f"\u20b9{random.randint(180, 1200)}",
        "dist": random.randint(3, 45),
        "rating": f"{random.uniform(3.5, 5.0):.1f}\u2605",
        "wait": random.randint(1, 15),
        "alt_route": random.choice(["NH-44", "Eastern Peripheral", "Dwarka Expressway", "Outer Ring Road", "Ghazipur Flyover"]),
        "stop": _pick_drop(),
        "fuel": random.randint(5, 25),
        "area": _pick_pickup(),
        "days": random.randint(1, 60),
        "km": random.randint(15000, 120000),
        "lat": f"{28.4 + random.random() * 0.5:.4f}",
        "lng": f"{77.0 + random.random() * 0.4:.4f}",
        "speed": random.randint(45, 110),
        "mins": random.randint(5, 35),
        "zone": random.choice(["Zone-A", "Zone-B", "Zone-C", "Zone-D", "Zone-E"]),
        "road": random.choice(["Ring Road", "NH-24", "GT Karnal Road", "Mathura Road", "Sohna Road", "MG Road"]),
        "issue": random.choice(["rough driving", "AC not cooling", "detour without asking", "smell in car", "late pickup"]),
        "mult": f"{random.uniform(1.2, 2.5):.1f}",
        "ms": random.randint(25, 850),
        "trips": random.randint(50, 350),
        "amount": f"\u20b9{random.randint(5000, 25000)}",
        "rev": f"\u20b9{random.randint(30000, 150000)}",
        "rate": random.randint(75, 98),
        "req_id": req,
        "txn": txn,
        "ticket": ticket,
        "retry": random.randint(1, 3),
        "count": random.randint(3, 25),
        "base_amt": f"\u20b9{(25 + random.choice([0, 5, 10]))}",
        "wait_s": random.randint(30, 180),
        "wait": random.randint(3, 15),
        "route": random.choice(["NH-44", "Eastern Peripheral Expressway", "Dwarka Expressway"]),
    }

    return template.format(**fields)


def _generate_log(force_spike: bool = False) -> dict:
    if force_spike:
        level = random.choices(["ERROR", "WARNING"], weights=[0.6, 0.4])[0]
    else:
        level = random.choices(["INFO", "WARNING", "ERROR"], weights=[0.60, 0.25, 0.15])[0]

    is_spike = False
    if random.random() < 0.04 and level in SPIKE_MESSAGES:
        templates = SPIKE_MESSAGES[level]
        is_spike = True
    else:
        templates = LOG_TEMPLATES[level]

    message = _fill(random.choice(templates))

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "level": level,
        "message": message,
        "service": "cab-fleet",
        "is_spike": is_spike,
    }


def _generate_metrics() -> dict:
    with _metrics_lock:
        prev = _metrics.copy() if _metrics else {
            "active_trips": 28.0,
            "fleet_health_score": 92.5,
            "driver_online_count": 24.0,
            "avg_wait_time_min": 4.5,
            "revenue_per_hour": 780.0,
            "trip_completion_rate": 96.2,
        }

    spike = random.random() < 0.04
    dip = random.random() < 0.03

    active = max(5.0, min(60.0, prev["active_trips"] + random.gauss(0, 4) + (5 if spike else 0) + (-8 if dip else 0)))
    health = max(65.0, min(99.5, prev["fleet_health_score"] + random.gauss(-0.3, 1.5) + (-15 if dip else 0) + (0 if spike else 0)))
    online = max(12.0, min(30.0, round(prev["driver_online_count"] + random.gauss(0, 1.5))))
    wait = max(1.0, min(18.0, prev["avg_wait_time_min"] + random.gauss(0.1, 0.8) + (4 if spike else 0) + (-2 if dip else 0)))
    rev = max(200.0, min(2000.0, prev["revenue_per_hour"] + random.gauss(0, 50) + (200 if spike else 0) + (-150 if dip else 0)))
    rate = max(70.0, min(100.0, prev["trip_completion_rate"] + random.gauss(-0.2, 1.2) + (-8 if dip else 0) + (0 if spike else 0)))

    return {
        "active_trips": round(active, 0),
        "fleet_health_score": round(health, 1),
        "driver_online_count": round(online, 0),
        "avg_wait_time_min": round(wait, 1),
        "revenue_per_hour": round(rev, 0),
        "trip_completion_rate": round(rate, 1),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def _background_generator() -> None:
    log_interval = float(os.getenv("LOG_INTERVAL_SECONDS", "1.5"))
    metrics_interval = float(os.getenv("METRICS_INTERVAL_SECONDS", "2.0"))

    last_metrics_ts = 0.0
    last_burst_ts = 0.0
    burst_mode = False
    burst_count = 0

    while True:
        now = time.time()

        if now - last_burst_ts > 60.0 and not burst_mode:
            burst_mode = True
            burst_count = random.randint(5, 10)
            last_burst_ts = now

        log_entry = _generate_log(force_spike=burst_mode)
        with _logs_lock:
            _logs.append(log_entry)
            if len(_logs) > MAX_LOGS:
                _logs.pop(0)

        if burst_mode:
            burst_count -= 1
            if burst_count <= 0:
                burst_mode = False

        if now - last_metrics_ts >= metrics_interval:
            new_metrics = _generate_metrics()
            with _metrics_lock:
                _metrics.update(new_metrics)
            last_metrics_ts = now

        time.sleep(log_interval)


_thread = threading.Thread(target=_background_generator, daemon=True)
_thread.start()


# ── Routes ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "cab-fleet-telemetry", "fleet": "Meher Cab ERP Delhi NCR"}


@app.get("/logs")
def get_logs(
    since: Optional[float] = Query(
        default=None,
        description="Unix timestamp (float). Only return logs newer than this.",
    )
) -> dict:
    with _logs_lock:
        if since is None:
            return {"logs": list(_logs[-50:])}

        since_iso = datetime.fromtimestamp(since, tz=timezone.utc).isoformat()
        filtered = [entry for entry in _logs if entry["timestamp"] > since_iso]
        return {"logs": filtered}


@app.get("/metrics")
def get_metrics() -> dict:
    with _metrics_lock:
        if not _metrics:
            return {
                "active_trips": 0,
                "fleet_health_score": 0.0,
                "driver_online_count": 0,
                "avg_wait_time_min": 0.0,
                "revenue_per_hour": 0,
                "trip_completion_rate": 0.0,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        return dict(_metrics)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
