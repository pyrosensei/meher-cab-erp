import asyncio

from app.main import health


def test_health_response_does_not_expose_env():
    assert asyncio.run(health()) == {"status": "ok"}
