from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True, slots=True)
class Settings:
    database_url: str
    analytics_dsn: str
    analytics_token: str | None
    analytics_disable_ssl: bool
    catalog_internal_token: str | None
    catalog_publish_api_key: str | None
    catalog_publisher_id: str
    catalog_publish_keys: dict[str, dict[str, object]]
    deploy_repository: str | None
    deploy_workflow: str
    deploy_ref: str
    deploy_github_token: str | None

    @classmethod
    def from_environment(cls) -> Settings:
        data_root = Path(__file__).resolve().parents[2] / "data"
        publish_keys_raw = os.getenv("GROUPSUM_CATALOG_PUBLISH_KEYS", "{}").strip()
        try:
            publish_keys = json.loads(publish_keys_raw) if publish_keys_raw else {}
        except json.JSONDecodeError as exc:
            raise ValueError("GROUPSUM_CATALOG_PUBLISH_KEYS must be valid JSON") from exc
        if not isinstance(publish_keys, dict):
            raise ValueError("GROUPSUM_CATALOG_PUBLISH_KEYS must be a JSON object")
        return cls(
            database_url=os.getenv(
                "GROUPSUM_DATABASE_URL",
                f"sqlite:///{data_root / 'groupsum-catalog.sqlite3'}",
            ),
            analytics_dsn=os.getenv(
                "GROUPSUM_ANALYTICS_DSN",
                str(data_root / "groupsum-metrics.duckdb"),
            ),
            analytics_token=os.getenv("GROUPSUM_ANALYTICS_TOKEN") or None,
            analytics_disable_ssl=os.getenv(
                "GROUPSUM_ANALYTICS_DISABLE_SSL", "false"
            ).lower()
            in {"1", "true", "yes", "on"},
            catalog_internal_token=os.getenv("GROUPSUM_CATALOG_INTERNAL_TOKEN") or None,
            catalog_publish_api_key=os.getenv("GROUPSUM_CATALOG_PUBLISH_API_KEY") or None,
            catalog_publisher_id=os.getenv(
                "GROUPSUM_CATALOG_PUBLISHER_ID", "groupsum-catalog-publisher"
            ),
            catalog_publish_keys=publish_keys,
            deploy_repository=os.getenv("GROUPSUM_DEPLOY_REPOSITORY") or None,
            deploy_workflow=os.getenv("GROUPSUM_DEPLOY_WORKFLOW", "deploy.yml"),
            deploy_ref=os.getenv("GROUPSUM_DEPLOY_REF", "master"),
            deploy_github_token=os.getenv("GROUPSUM_DEPLOY_GITHUB_TOKEN") or None,
        )
