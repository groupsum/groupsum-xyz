from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass

from .config import Settings


@dataclass(frozen=True, slots=True)
class DispatchResult:
    status: str
    detail: str | None = None


def dispatch_snapshot(snapshot_id: str, settings: Settings | None = None) -> DispatchResult:
    current = settings or Settings.from_environment()
    if not current.deploy_repository or not current.deploy_github_token:
        return DispatchResult("pending", "GitHub deployment dispatch is not configured")
    repository = urllib.parse.quote(current.deploy_repository, safe="/")
    workflow = urllib.parse.quote(current.deploy_workflow, safe="")
    request = urllib.request.Request(
        f"https://api.github.com/repos/{repository}/actions/workflows/{workflow}/dispatches",
        data=json.dumps(
            {"ref": current.deploy_ref, "inputs": {"snapshot_id": snapshot_id}},
            separators=(",", ":"),
        ).encode("utf-8"),
        method="POST",
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {current.deploy_github_token}",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "groupsum-catalog-api",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            if response.status != 204:
                return DispatchResult("failed", f"GitHub returned HTTP {response.status}")
    except urllib.error.HTTPError as exc:
        return DispatchResult("failed", f"GitHub returned HTTP {exc.code}")
    except urllib.error.URLError as exc:
        return DispatchResult("failed", f"GitHub dispatch unavailable: {exc.reason}")
    return DispatchResult("dispatched")


__all__ = ["DispatchResult", "dispatch_snapshot"]
