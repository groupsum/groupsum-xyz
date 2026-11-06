from datetime import UTC, datetime
from pathlib import Path
from types import SimpleNamespace

import httpx
import pytest

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.projections.contributors import contributor_records
from groupsum_catalog_api.tables.view_package_relationships import resolve_relationships


def test_contributor_projection_deduplicates_edges_and_keeps_stable_anonymous_routes():
    people = [
        {"id": "person:anon", "name": "Public anonymous", "provider": "github", "anonymous": True}
    ]
    repositories = [{"id": "r", "owner": "fixture", "name": "one"}]
    base = {
        "source_type": "source.repository",
        "source_id": "r",
        "target_type": "party.person",
        "target_id": "person:anon",
        "relationship_type": "contributed_by",
    }
    rows = contributor_records(
        people,
        repositories,
        [
            {**base, "attributes": {"contributions": 3}, "observed_at": "2026-01-01"},
            {**base, "attributes": {"contributions": 4}, "observed_at": "2026-01-02"},
        ],
    )
    assert rows[0]["contributions"] == 4
    assert rows[0]["repository_count"] == 1
    assert rows[0]["route"] == "/contributors/github/person%3Aanon"
    assert rows[0]["account_type"] == "Anonymous"


def test_relationship_normalization_respects_ecosystems_aliases_and_exact_ids():
    rows = [
        SimpleNamespace(id="n", name="@scope/real", ecosystem="npm", route_key="npm-real"),
        SimpleNamespace(id="p", name="My.Package", ecosystem="pypi", route_key="python-real"),
        SimpleNamespace(id="c", name="my_crate", ecosystem="crates", route_key="crate-real"),
    ]
    item = {
        "ecosystem": "npm",
        "dependencies": [
            {"name": "alias", "requirement": "npm:@scope/real@^1", "target_id": "alias"}
        ],
    }
    assert resolve_relationships(item, rows, "dependency")[0]["package"]["id"] == "n"
    for ecosystem, identity, expected in [
        ("pypi", "pypi:my_package", "p"),
        ("crates", "crates:my-crate", "c"),
    ]:
        item = {"ecosystem": ecosystem, "dependencies": [{"target_id": identity}]}
        assert resolve_relationships(item, rows, "dependency")[0]["package"]["id"] == expected
    assert (
        resolve_relationships(
            {"ecosystem": "npm", "dependencies": [{"name": "wrong", "target_id": "p"}]},
            rows,
            "dependency",
        )[0]["package"]["id"]
        == "p"
    )


def test_contributor_projection_excludes_edges_absent_from_current_snapshot():
    from sqlalchemy import create_engine
    from sqlalchemy.orm import Session

    from groupsum_catalog_api.tables.association import Association
    from groupsum_catalog_api.tables.catalog_snapshot import CatalogSnapshot
    from groupsum_catalog_api.tables.observation import CatalogObservation
    from groupsum_catalog_api.tables.repository import Repository
    from groupsum_catalog_api.tables.resources.party.person import PartyPerson
    from groupsum_catalog_api.tables.view_contributors import projected_contributors

    engine = create_engine("sqlite://")
    for model in (Association, CatalogSnapshot, CatalogObservation, Repository, PartyPerson):
        model.__table__.create(engine)
    now = datetime(2026, 11, 6, tzinfo=UTC)
    with Session(engine) as session:
        session.add(
            Repository(
                id="r",
                provider="github",
                owner="fixture",
                name="one",
                url="https://example.invalid/one",
            )
        )
        session.add(
            PartyPerson(id="p", name="Person", login="dev", provider="github", anonymous=False)
        )
        session.add(
            CatalogSnapshot(
                id="s", collected_at=now, status="complete", source_digest="a" * 64, is_current=True
            )
        )
        for identity, role, count in [("good", "contributor", 7), ("stale", "old", 99)]:
            session.add(
                Association(
                    id=identity,
                    source_type="source.repository",
                    source_id="r",
                    target_type="party.person",
                    target_id="p",
                    relationship_type="contributed_by",
                    role=role,
                    attributes={"contributions": count},
                )
            )
        for subject_type, subject_id, kind in [
            ("source.repository", "r", "entity_presence"),
            ("association", "good", "association_presence"),
        ]:
            session.add(
                CatalogObservation(
                    id=kind,
                    snapshot_id="s",
                    subject_type=subject_type,
                    subject_id=subject_id,
                    observation_type=kind,
                    source_kind="test",
                    status="observed",
                    observed_at=now,
                    payload={},
                    content_hash="b" * 64,
                    confidence="observed",
                )
            )
        session.commit()
        assert projected_contributors(PartyPerson, session)[0]["contributions"] == 7


@pytest.mark.anyio
async def test_compound_contributor_and_package_relationship_routes(tmp_path: Path, monkeypatch):
    monkeypatch.setenv("GROUPSUM_CATALOG_INTERNAL_TOKEN", "test-token")
    app = build_app(tmp_path / "catalog.sqlite3", tmp_path / "analytics.duckdb")
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app), base_url="http://test"
    ) as client:

        async def publish(entity_type, records):
            result = await client.post(
                f"/internal/v1/catalog/entities/{entity_type}",
                headers={"Authorization": "Bearer test-token"},
                json={"snapshot_id": "snapshot:test", "records": records},
            )
            assert result.status_code == 200, result.text

        await publish(
            "source.repository",
            [
                {
                    "id": "repo",
                    "provider": "github",
                    "owner": "fixture",
                    "name": "repo",
                    "url": "https://example.invalid/repo",
                }
            ],
        )
        await publish(
            "party.person",
            [
                {
                    "id": "person:42",
                    "name": "Dev",
                    "provider": "github",
                    "login": "Dev[bot]",
                    "account_type": "Bot",
                },
                {
                    "id": "person:anon",
                    "name": "Public anonymous name",
                    "provider": "github",
                    "anonymous": True,
                },
            ],
        )
        edges = [
            {
                "id": f"edge:{index}",
                "source_type": "source.repository",
                "source_id": "repo",
                "relationship_type": "contributed_by",
                "target_type": "party.person",
                "target_id": person,
                "role": "contributor",
                "attributes": {"contributions": 4},
            }
            for index, person in enumerate(["person:42", "person:anon"])
        ]
        result = await client.post(
            "/internal/v1/catalog/associations",
            headers={"Authorization": "Bearer test-token"},
            json={"snapshot_id": "snapshot:test", "records": edges},
        )
        assert result.status_code == 200, result.text
        for identifier in ("dev%5Bbot%5D", "person%3Aanon"):
            result = await client.get(f"/api/v1/contributors/github/{identifier}")
            assert result.status_code == 200, result.text
            assert result.json()["repositories"][0]["contributions"] == 4
        assert (await client.get("/api/v1/contributors/github/missing")).status_code == 404
        directory = (await client.get("/api/v1/contributors?account_type=Bot&page_size=1")).json()
        assert directory["count"] == 1
        assert directory["records"][0]["route"].endswith("Dev%5Bbot%5D")
        await publish(
            "distribution.package",
            [
                {
                    "id": "package:a",
                    "name": "a",
                    "ecosystem": "pypi",
                    "route_key": "a",
                    "source_payload": {
                        "id": "package:a",
                        "name": "a",
                        "ecosystem": "pypi",
                        "dependencies": [
                            {
                                "name": "My_Package",
                                "scope": "dev",
                                "requirement": {"version": ">=1", "optional": True},
                            },
                            {"name": "external", "requirement": "*"},
                            {"name": "missing", "internal": True},
                            {"name": "duplicate"},
                        ],
                        "dependents": [{"name": "my-package", "source_id": "package:b"}],
                    },
                },
                {"id": "package:b", "name": "my-package", "ecosystem": "pypi", "route_key": "b"},
                {"id": "package:c", "name": "duplicate", "ecosystem": "pypi", "route_key": "c"},
                {"id": "package:d", "name": "duplicate", "ecosystem": "pypi", "route_key": "d"},
            ],
        )
        result = await client.get("/api/v1/catalog/packages/a/relationships?page_size=2")
        assert result.status_code == 200, result.text
        assert result.json()["count"] == 4
        assert result.json()["page_count"] == 2
        all_edges = (
            result.json()["records"]
            + (
                await client.get("/api/v1/catalog/packages/a/relationships?page_size=2&page=2")
            ).json()["records"]
        )
        by_name = {edge["name"]: edge for edge in all_edges}
        assert by_name["My_Package"]["package"]["route"] == "/catalog/packages/pypi/b"
        assert by_name["external"]["resolution"] == "external"
        assert by_name["missing"]["resolution"] == "unresolved"
        assert len(by_name["duplicate"]["candidates"]) == 2
        optional = (
            await client.get(
                "/api/v1/catalog/packages/a/relationships?optional=true&scope=dev&q=My"
            )
        ).json()
        assert optional["count"] == 1
        reverse = (
            await client.get("/api/v1/catalog/packages/a/relationships?direction=dependent")
        ).json()
        assert reverse["records"][0]["package"]["id"] == "package:b"
        assert (
            await client.get("/api/v1/catalog/packages/missing/relationships")
        ).status_code == 404
