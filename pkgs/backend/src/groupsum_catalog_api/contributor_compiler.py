from __future__ import annotations

from datetime import datetime

from .record_compiler_common import merge_association, parse_datetime, stable_id
from .tables.repository import Repository
from .tables.resources.party.person import PartyPerson


def import_contributors(
    session, rows: list[dict], repositories: dict[str, Repository], observed_at: datetime
) -> dict[str, PartyPerson]:
    people: dict[str, PartyPerson] = {}
    for repository_row in rows:
        repository = repositories.get(str(repository_row.get("full_name") or ""))
        if repository is None:
            continue
        for contributor in repository_row.get("contributors") or []:
            provider_key = (
                contributor.get("id")
                or contributor.get("login")
                or contributor.get("url")
                or contributor.get("name")
            )
            display_name = contributor.get("login") or contributor.get("name")
            if not provider_key or not display_name:
                continue
            person_id = stable_id("person", "github", str(provider_key).casefold())
            person = PartyPerson(
                id=person_id,
                name=str(display_name),
                description="GitHub contributor observed in the public repository history.",
                provider="github",
                provider_id=str(contributor.get("id")) if contributor.get("id") else None,
                login=contributor.get("login"),
                profile_url=contributor.get("url"),
                avatar_url=contributor.get("avatar_url"),
                account_type=contributor.get("account_type"),
                anonymous=bool(contributor.get("anonymous")),
                source_url=contributor.get("url"),
                observed_at=parse_datetime(repository_row.get("observed_at")) or observed_at,
                source_payload={
                    "provider": "github",
                    "provider_id": contributor.get("id"),
                    "login": contributor.get("login"),
                    "name": contributor.get("name"),
                    "url": contributor.get("url"),
                    "avatar_url": contributor.get("avatar_url"),
                    "account_type": contributor.get("account_type"),
                    "anonymous": bool(contributor.get("anonymous")),
                },
            )
            session.merge(person)
            people[person_id] = person
            merge_association(
                session,
                source_type=Repository.ENTITY_TYPE,
                source_id=repository.id,
                relationship_type="contributed_by",
                target_type=PartyPerson.ENTITY_TYPE,
                target_id=person.id,
                role="contributor",
                attributes={
                    "contributions": int(contributor.get("contributions") or 0),
                    "login": contributor.get("login"),
                    "anonymous": bool(contributor.get("anonymous")),
                },
                observed_at=person.observed_at,
            )
    return people


__all__ = ["import_contributors"]
