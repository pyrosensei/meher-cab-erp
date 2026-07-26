import importlib

import pytest

from app.core import config as config_module


def test_settings_allows_development_defaults():
    settings = config_module.Settings()
    assert settings.app_env == "development"
    assert settings.secret_key


def test_settings_rejects_dev_secret_in_production(monkeypatch):
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.setenv("SECRET_KEY", "dev-secret-change-in-production")
    monkeypatch.setenv("NVIDIA_API_KEY", "some-key")

    with pytest.raises(ValueError, match="secret_key must be set"):
        importlib.reload(config_module)


def test_settings_rejects_missing_nvidia_key_in_production(monkeypatch):
    with pytest.raises(ValueError, match="nvidia_api_key must be set"):
        config_module._validate_settings(
            config_module.Settings(
                app_env="production",
                secret_key="prod-secret",
                nvidia_api_key="",
            )
        )
