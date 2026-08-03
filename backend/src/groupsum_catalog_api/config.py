from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True, slots=True)
class Settings:
    database_path: Path
    public_base_url: str

    @classmethod
    def from_environment(cls) -> Settings:
        default_db = Path(__file__).resolve().parents[2] / "data" / "groupsum-catalog.sqlite3"
        return cls(
            database_path=Path(os.getenv("GROUPSUM_DATABASE_PATH", default_db)),
            public_base_url=os.getenv("GROUPSUM_PUBLIC_BASE_URL", "https://groupsum.xyz").rstrip(
                "/"
            ),
        )
