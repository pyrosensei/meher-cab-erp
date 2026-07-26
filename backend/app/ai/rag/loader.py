"""Load seed data from JSON files."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).parent.parent.parent.parent.parent
SEED_DIR = BASE_DIR / "data" / "seed"


def load_json(filename: str) -> list[dict[str, Any]]:
    """Load a JSON seed file."""
    path = SEED_DIR / filename
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_all_seed_data() -> dict[str, list[dict[str, Any]]]:
    """Load all seed data files."""
    return {
        "drivers": load_json("drivers.json"),
        "vehicles": load_json("vehicles.json"),
        "trips": load_json("trips.json"),
        "notifications": load_json("notifications.json"),
    }