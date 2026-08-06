from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True, slots=True)
class Settings:
    database_url: str
    analytics_path: Path
    public_base_url: str

    @classmethod
    def from_environment(cls) -> Settings:
        data_root = Path(__file__).resolve().parents[2] / "data"
        return cls(
            database_url=os.getenv(
                "GROUPSUM_DATABASE_URL",
                f"sqlite:///{data_root / 'groupsum-catalog.sqlite3'}",
            ),
            analytics_path=Path(
                os.getenv("GROUPSUM_ANALYTICS_PATH", data_root / "groupsum-metrics.duckdb")
            ),
            public_base_url=os.getenv("GROUPSUM_PUBLIC_BASE_URL", "https://groupsum.xyz").rstrip(
                "/"
            ),
        )
