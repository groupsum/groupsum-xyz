from collections import Counter


def package_summary(package_ids, index):
    """Summarize current package identities without serializing their source payloads."""
    ids = set(package_ids)
    ecosystems = Counter()
    publications = Counter()
    for package_id in ids:
        package = index.get(package_id)
        ecosystems[str(package.ecosystem or "unknown") if package else "unknown"] += 1
        status = (
            "published"
            if package and package.published
            else str(package.publication_status or "not-observed")
            if package
            else "not-observed"
        )
        publications[status] += 1
    return {
        "total": len(ids),
        "ecosystems": dict(sorted(ecosystems.items())),
        "publications": dict(sorted(publications.items())),
    }


def package_collection_summary(item):
    """The inspector needs identity and state, not dependency/release inventories."""
    keys = (
        "id",
        "name",
        "ecosystem",
        "route",
        "route_key",
        "latest_version",
        "published",
        "publication_status",
        "package_kind",
        "repository",
        "repositories",
        "observed_at",
    )
    return {key: item.get(key) for key in keys}
