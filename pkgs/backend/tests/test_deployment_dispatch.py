from __future__ import annotations

import json
from contextlib import contextmanager
from typing import Any

from groupsum_catalog_api.config import Settings
from groupsum_catalog_api.deployment_dispatch import dispatch_snapshot


def _settings(**overrides: Any) -> Settings:
    values: dict[str, Any] = {
        "database_url": "sqlite://",
        "analytics_dsn": ":memory:",
        "analytics_token": None,
        "analytics_disable_ssl": False,
        "catalog_internal_token": None,
        "catalog_publish_api_key": None,
        "catalog_publisher_id": "test-publisher",
        "catalog_publish_keys": {},
        "deploy_repository": None,
        "deploy_workflow": "deploy.yml",
        "deploy_ref": "master",
        "deploy_github_token": None,
    }
    values.update(overrides)
    return Settings(**values)


def test_dispatch_remains_pending_when_backend_dispatch_is_not_configured() -> None:
    result = dispatch_snapshot("snapshot:test", _settings())

    assert result.status == "pending"
    assert result.detail == "GitHub deployment dispatch is not configured"


def test_dispatch_sends_only_the_snapshot_identity(monkeypatch) -> None:
    captured: dict[str, Any] = {}

    @contextmanager
    def fake_urlopen(request, timeout):
        captured["url"] = request.full_url
        captured["authorization"] = request.headers["Authorization"]
        captured["payload"] = json.loads(request.data)
        captured["timeout"] = timeout

        class Response:
            status = 204

        yield Response()

    monkeypatch.setattr(
        "groupsum_catalog_api.deployment_dispatch.urllib.request.urlopen",
        fake_urlopen,
    )
    result = dispatch_snapshot(
        "snapshot:20261102:test",
        _settings(
            deploy_repository="groupsum/groupsum-xyz",
            deploy_github_token="dispatch-token",
        ),
    )

    assert result.status == "dispatched"
    assert captured == {
        "url": (
            "https://api.github.com/repos/groupsum/groupsum-xyz/actions/workflows/"
            "deploy.yml/dispatches"
        ),
        "authorization": "Bearer dispatch-token",
        "payload": {
            "ref": "master",
            "inputs": {"snapshot_id": "snapshot:20261102:test"},
        },
        "timeout": 30,
    }
