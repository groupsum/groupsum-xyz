from datetime import UTC, datetime
from pathlib import Path

from groupsum_catalog_api.contributor_compiler import import_contributors
from groupsum_catalog_api.record_compiler import RecordAccumulator, compile_catalog_records
from groupsum_catalog_api.tables.association import Association
from groupsum_catalog_api.tables.portfolio import Portfolio
from groupsum_catalog_api.tables.repository import Repository
from groupsum_catalog_api.tables.resources.party.person import PartyPerson


def test_contributors_are_tigrbl_entities_associated_to_each_repository() -> None:
    observed_at = datetime(2026, 8, 10, tzinfo=UTC)
    collector = RecordAccumulator()
    repository = Repository(
        id="repository:groupsum/example",
        provider="github",
        owner="groupsum",
        name="example",
        url="https://github.com/groupsum/example",
        is_archived=False,
        is_fork=False,
        ssot_governed=False,
        observed_at=observed_at,
    )
    collector.merge(repository)

    people = import_contributors(
        collector,
        [
            {
                "full_name": "groupsum/example",
                "observed_at": "2026-08-10T00:00:00Z",
                "contributors": [
                    {
                        "id": "42",
                        "login": "dev",
                        "name": "Dev Example",
                        "url": "https://github.com/dev",
                        "avatar_url": "https://avatars.githubusercontent.com/u/42",
                        "account_type": "User",
                        "contributions": 7,
                    }
                ],
            }
        ],
        {"groupsum/example": repository},
        observed_at,
    )

    person = next(iter(people.values()))
    assert isinstance(person, PartyPerson)
    assert person.name == "dev"
    assert person.provider == "github"
    assert person.provider_id == "42"
    assert person.login == "dev"
    assert person.profile_url == "https://github.com/dev"
    assert person.avatar_url == "https://avatars.githubusercontent.com/u/42"
    assert person.account_type == "User"
    assert person.anonymous is False
    assert person.source_payload["provider_id"] == "42"
    association = next(iter(collector.records[Association].values()))
    assert association.source_id == repository.id
    assert association.relationship_type == "contributed_by"
    assert association.target_type == PartyPerson.ENTITY_TYPE
    assert association.target_id == person.id
    assert association.attributes["contributions"] == 7


def test_current_catalog_compiles_contributor_people_and_repository_edges() -> None:
    repo_root = Path(__file__).resolve().parents[3]
    entities, associations = compile_catalog_records(repo_root)

    people = entities.get(PartyPerson.ENTITY_TYPE, [])
    contributor_edges = [
        row for row in associations if row["relationship_type"] == "contributed_by"
    ]
    assert people
    assert contributor_edges
    assert {row["target_id"] for row in contributor_edges} <= {
        row["id"] for row in people
    }


def test_current_catalog_compiles_approved_portfolios_as_public_records() -> None:
    repo_root = Path(__file__).resolve().parents[3]
    entities, _ = compile_catalog_records(repo_root)

    portfolios = entities[Portfolio.ENTITY_TYPE]
    assert len(portfolios) == 6
    assert all(row["visibility"] == "public" for row in portfolios)
    assert all("/portfolio/records/" in row["canonical_url"] for row in portfolios)
    assert all(row["updated_at"] is not None for row in portfolios)
