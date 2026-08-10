from __future__ import annotations

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from collections.abc import Iterable
from typing import Any


class CatalogApiError(RuntimeError):
    pass


class CatalogApiClient:
    def __init__(self, base_url: str, token: str, *, retries: int = 4, timeout: int = 120):
        self.base_url = base_url.rstrip("/")
        self.token = token
        self.retries = retries
        self.timeout = timeout

    def _request(self, method: str, path: str, body: dict[str, Any] | None = None) -> Any:
        payload = None if body is None else json.dumps(body, separators=(",", ":")).encode()
        request = urllib.request.Request(
            f"{self.base_url}{path}",
            data=payload,
            method=method,
            headers={
                "Accept": "application/json",
                "Authorization": f"Bearer {self.token}",
                **({"Content-Type": "application/json"} if payload is not None else {}),
            },
        )
        for attempt in range(self.retries):
            try:
                with urllib.request.urlopen(request, timeout=self.timeout) as response:
                    return json.loads(response.read().decode())
            except urllib.error.HTTPError as exc:
                detail = exc.read().decode(errors="replace")
                if exc.code < 500 or attempt == self.retries - 1:
                    raise CatalogApiError(f"{method} {path}: HTTP {exc.code}: {detail}") from exc
            except urllib.error.URLError as exc:
                if attempt == self.retries - 1:
                    raise CatalogApiError(f"{method} {path}: {exc}") from exc
            time.sleep(2**attempt)
        raise AssertionError("unreachable")

    def current_snapshot_id(self) -> str | None:
        payload = self._request("GET", "/api/v1/snapshots")
        current = next(
            (row for row in payload.get("snapshots", []) if row.get("is_current")),
            None,
        )
        return str(current["snapshot_id"]) if current else None

    def publish_records(
        self,
        path: str,
        snapshot_id: str,
        rows: Iterable[dict[str, Any]],
        *,
        chunk_size: int = 250,
    ) -> dict[str, int]:
        records = list(rows)
        totals = {"accepted": 0, "created": 0, "existing": 0}
        for offset in range(0, len(records), chunk_size):
            response = self._request(
                "POST",
                path,
                {"snapshot_id": snapshot_id, "records": records[offset : offset + chunk_size]},
            )
            for key in totals:
                totals[key] += int(response.get(key, 0))
        return totals

    def publish_entities(
        self, snapshot_id: str, records: dict[str, list[dict[str, Any]]]
    ) -> dict[str, dict[str, int]]:
        return {
            entity_type: self.publish_records(
                "/internal/v1/catalog/entities/"
                + urllib.parse.quote(entity_type, safe="."),
                snapshot_id,
                rows,
            )
            for entity_type, rows in records.items()
        }

    def create_snapshot(self, descriptor: dict[str, Any]) -> dict[str, Any]:
        return self._request("POST", "/internal/v1/catalog/snapshots", descriptor)


__all__ = ["CatalogApiClient", "CatalogApiError"]
