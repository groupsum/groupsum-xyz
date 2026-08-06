from pathlib import Path

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.importer import canonical_package_id, connect


def test_package_identity_reuses_persisted_route_key(tmp_path: Path) -> None:
    database_path = tmp_path / "catalog.sqlite3"
    build_app(database_path)
    with connect(database_path) as connection:
        connection.execute(
            """
            INSERT INTO packages (
                id, ecosystem, name, registry_url, package_kind, private, route_key
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "legacy:package:id",
                "npm",
                "legacy-editor-name",
                "https://www.npmjs.com/package/legacy-editor-name",
                "published-package",
                False,
                "mdwrk-example-editor-basic-8e46b996",
            ),
        )
        connection.execute(
            """
            INSERT INTO packages (
                id, ecosystem, name, registry_url, package_kind, private
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                "new:package:id",
                "npm",
                "@mdwrk/example-editor-basic",
                "https://www.npmjs.com/package/@mdwrk/example-editor-basic",
                "published-package",
                False,
            ),
        )
        assert (
            canonical_package_id(
                connection,
                "new:package:id",
                "npm",
                "@mdwrk/example-editor-basic",
                "mdwrk-example-editor-basic-8e46b996",
            )
            == "legacy:package:id"
        )
