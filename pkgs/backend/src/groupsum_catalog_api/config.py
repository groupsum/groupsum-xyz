from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True, slots=True)
class Settings:
    database_url: str
    analytics_dsn: str
    analytics_token: str | None
    analytics_disable_ssl: bool

    @classmethod
    def from_environment(cls) -> Settings:
        data_root = Path(__file__).resolve().parents[2] / "data"
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
        )
