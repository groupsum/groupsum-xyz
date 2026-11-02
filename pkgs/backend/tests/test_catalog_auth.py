from __future__ import annotations

import hashlib

from groupsum_catalog_api.catalog_auth import PUBLISH_SCOPE, authenticate_publisher
from groupsum_catalog_api.config import Settings


class Request:
    def __init__(self, token: str):
        self.headers = {"authorization": f"Bearer {token}"}


def _settings(**overrides) -> Settings:
    values = {
        "database_url": "sqlite:///test.sqlite3",
        "analytics_dsn": "test.duckdb",
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


def test_hashed_publisher_key_resolves_named_scoped_principal() -> None:
    token = "publisher-secret"
    settings = _settings(
        catalog_publish_keys={
            "collector:external": {
                "sha256": hashlib.sha256(token.encode()).hexdigest(),
                "scopes": [PUBLISH_SCOPE],
            }
        }
    )

    principal = authenticate_publisher({"request": Request(token)}, settings)

    assert principal is not None
    assert principal.publisher_id == "collector:external"
    assert principal.scopes == frozenset({PUBLISH_SCOPE})


def test_unknown_publisher_key_fails_closed() -> None:
    settings = _settings(catalog_publish_api_key="expected")

    assert authenticate_publisher({"request": Request("wrong")}, settings) is None
