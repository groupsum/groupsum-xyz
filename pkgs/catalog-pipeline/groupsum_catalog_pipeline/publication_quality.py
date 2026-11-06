"""Fail closed on source failures that would erase current catalog membership."""

from typing import Any
from urllib.parse import urlparse


def publication_quality_errors(catalog: dict[str, Any]) -> list[str]:
    errors = []
    for repository in catalog.get("repositories", []):
        name = str(repository.get("full_name") or "unknown")
        tree = repository.get("tree") or {}
        if tree.get("truncated"):
            errors.append(f"{name}: truncated repository tree")
        for observation in repository.get("observations", []):
            if observation.get("status") != "error":
                continue
            source = str(observation.get("url") or observation.get("source") or "")
            parsed = urlparse(source)
            path = parsed.path
            critical = parsed.hostname == "api.github.com" and any(
                part in path for part in ("/git/trees/", "/contributors", "/commits", "/languages", "/releases")
            )
            critical |= parsed.hostname == "raw.githubusercontent.com" and any(
                source.endswith("/" + str(item.get("path"))) for item in repository.get("manifests", [])
            )
            if critical:
                errors.append(f"{name}: {source}: {observation.get('detail', 'source failure')}")
    for observation in catalog.get("observations", []):
        source = str(observation.get("url") or observation.get("source") or "")
        if observation.get("status") == "error" and (
            source.startswith("github.repository:") or "/repos?" in source
        ):
            errors.append(f"{source}: {observation.get('detail', 'repository discovery failure')}")
    return errors
