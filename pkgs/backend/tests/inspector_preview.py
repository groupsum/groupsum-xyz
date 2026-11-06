"""Local-only browser fixture: real Tigrbl routes, isolated SQLite, synthetic test records.

Never imported by the application or deployment. Run with the backend test runtime.
"""

import os
import tempfile
from pathlib import Path

import uvicorn
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

directory = Path(tempfile.mkdtemp(prefix="groupsum-inspector-"))
database = directory / "catalog.sqlite3"
os.environ["GROUPSUM_DATABASE_URL"] = f"sqlite:///{database}"
os.environ["GROUPSUM_ANALYTICS_DSN"] = str(directory / "metrics.duckdb")

from groupsum_catalog_api.app import app  # noqa: E402
from groupsum_catalog_api.tables.package import Package  # noqa: E402
from groupsum_catalog_api.tables.repository import Repository  # noqa: E402

with Session(create_engine(f"sqlite:///{database}")) as session:
    for owner, name, stars, count in [
        ("fixture", "multi-package", 2, 25),
        ("fixture", "popular", 105, 0),
    ]:
        ids = []
        for index in range(count):
            package_id = f"package:fixture:{index}"
            ids.append(package_id)
            ecosystem = "pypi" if index < 15 else "npm"
            status = "published" if index % 2 else "manifest-private"
            source = {
                "id": package_id,
                "name": f"package-{index:02}-with-a-long-name-for-truncation",
                "ecosystem": ecosystem,
                "repository": f"{owner}/{name}",
                "route": f"/catalog/packages/{ecosystem}/fixture-{index}",
                "latest_version": "1.2.3",
                "publication_status": status,
                "published": status == "published",
            }
            session.add(
                Package(
                    id=package_id,
                    ecosystem=ecosystem,
                    name=source["name"],
                    route_key=f"fixture-{index}",
                    published=source["published"],
                    publication_status=status,
                    source_payload=source,
                )
            )
        session.add(
            Repository(
                id=f"repository:{owner}/{name}",
                provider="github",
                owner=owner,
                name=name,
                url=f"https://example.invalid/{owner}/{name}",
                source_payload={
                    "id": f"repository:{owner}/{name}",
                    "owner": owner,
                    "name": name,
                    "package_ids": ids,
                    "metrics": {"stars": stars},
                    "pushed_at": "2026-11-06T00:00:00Z",
                },
            )
        )
    session.commit()

print("Synthetic inspector fixtures ready on http://127.0.0.1:8189", flush=True)
uvicorn.run(app, host="127.0.0.1", port=8189)
