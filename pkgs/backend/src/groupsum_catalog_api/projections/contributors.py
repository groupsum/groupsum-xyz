from __future__ import annotations

from urllib.parse import quote


def observed_contributor_route(person):
    from ..record_compiler_common import stable_id

    provider = person.get("provider") or "github"
    key = person.get("id") or person.get("login") or person.get("url") or person.get("name")
    identifier = person.get("login") or stable_id("person", provider, str(key).casefold())
    return f"/contributors/{quote(provider, safe='')}/{quote(identifier, safe='')}"


def contributor_records(people, repositories, associations):
    """One public identity and deduplicated repository edges, shared by API/SSG."""
    repos = {row["id"]: row for row in repositories}
    edges = {}
    for edge in associations:
        if (
            edge.get("relationship_type") != "contributed_by"
            or edge.get("source_type") != "source.repository"
            or edge.get("target_type") != "party.person"
            or edge["source_id"] not in repos
        ):
            continue
        key = (edge["target_id"], edge["source_id"])
        if key not in edges or str(edge.get("observed_at") or "") > str(
            edges[key].get("observed_at") or ""
        ):
            edges[key] = edge
    records = []
    for person in people:
        related = []
        for (person_id, repo_id), edge in edges.items():
            if person_id != person["id"]:
                continue
            repo = repos[repo_id]
            related.append(
                {
                    "id": repo_id,
                    "name": f"{repo['owner']}/{repo['name']}",
                    "route": (
                        f"/catalog/repositories/{quote(repo['owner'], safe='')}/"
                        f"{quote(repo['name'], safe='')}"
                    ),
                    "contributions": int((edge.get("attributes") or {}).get("contributions") or 0),
                }
            )
        if not related:
            continue
        provider = person.get("provider") or "github"
        identifier = person.get("login") or person["id"]
        records.append(
            {
                **{key: value for key, value in person.items() if key != "source_payload"},
                "url": person.get("profile_url") or person.get("source_url"),
                "route": f"/contributors/{quote(provider, safe='')}/{quote(identifier, safe='')}",
                "account_type": person.get("account_type")
                or ("Anonymous" if person.get("anonymous") else "User"),
                "repository_count": len(related),
                "contributions": sum(row["contributions"] for row in related),
                "repositories": sorted(
                    related, key=lambda row: (-row["contributions"], row["name"])
                ),
            }
        )
    return sorted(
        records, key=lambda row: (-row["contributions"], row["name"].casefold(), row["id"])
    )
