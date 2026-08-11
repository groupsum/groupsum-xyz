#!/usr/bin/env python3
"""Collect and normalize the public Groupsum ecosystem catalog.

Only primary APIs and repository manifests are treated as observed evidence.
Missing APIs, pagination caps, truncated trees, and registry lookup failures are
recorded in the output rather than converted into negative claims.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import dataclasses
import datetime as dt
import hashlib
import json
import os
import re
import subprocess
import sys
import threading
import time
import tomllib
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[3]
DEFAULT_CONFIG = ROOT / "catalog" / "catalog.config.json"
DEFAULT_OUTPUT = ROOT / "catalog" / "generated" / "catalog.json"
DEFAULT_SUMMARY = ROOT / "catalog" / "generated" / "summary.json"
USER_AGENT = "groupsum-xyz-catalog/1.0 (+https://groupsum.xyz)"
ISO_NOW = lambda: dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


@dataclasses.dataclass
class Observation:
    source: str
    status: str
    observed_at: str
    detail: str | None = None
    url: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {key: value for key, value in dataclasses.asdict(self).items() if value is not None}


class ApiClient:
    def __init__(self, config: dict[str, Any], cache_dir: Path, refresh: bool = False) -> None:
        self.timeout = int(config.get("request_timeout_seconds", 30))
        self.ttl = dt.timedelta(hours=float(config.get("cache_ttl_hours", 6)))
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.refresh = refresh
        self.token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or self._gh_token()
        self._write_lock = threading.Lock()

    @staticmethod
    def _gh_token() -> str | None:
        try:
            result = subprocess.run(
                ["gh", "auth", "token"], capture_output=True, text=True, timeout=10, check=False
            )
        except (FileNotFoundError, subprocess.SubprocessError):
            return None
        return result.stdout.strip() if result.returncode == 0 and result.stdout.strip() else None

    def _cache_path(self, url: str) -> Path:
        return self.cache_dir / f"{hashlib.sha256(url.encode()).hexdigest()}.json"

    def _read_cache(self, url: str) -> tuple[Any, dict[str, str]] | None:
        path = self._cache_path(url)
        if self.refresh or not path.exists():
            return None
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            fetched = dt.datetime.fromisoformat(payload["fetched_at"].replace("Z", "+00:00"))
            if dt.datetime.now(dt.timezone.utc) - fetched > self.ttl:
                return None
            return payload["body"], payload.get("headers", {})
        except (KeyError, ValueError, OSError, json.JSONDecodeError):
            return None

    def _write_cache(self, url: str, body: Any, headers: dict[str, str]) -> None:
        payload = {"fetched_at": ISO_NOW(), "url": url, "headers": headers, "body": body}
        with self._write_lock:
            self._cache_path(url).write_text(json.dumps(payload, sort_keys=True), encoding="utf-8")

    def request_json(
        self,
        url: str,
        *,
        github: bool = False,
        allow_404: bool = False,
        use_cache: bool = True,
        retries: int = 3,
    ) -> tuple[Any | None, dict[str, str], Observation]:
        cached = self._read_cache(url) if use_cache else None
        if cached:
            body, headers = cached
            return body, headers, Observation(url, "cached", ISO_NOW(), url=url)

        headers = {"Accept": "application/json", "User-Agent": USER_AGENT}
        if github:
            headers["Accept"] = "application/vnd.github+json"
            headers["X-GitHub-Api-Version"] = "2022-11-28"
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
        request = urllib.request.Request(url, headers=headers)
        for attempt in range(retries):
            try:
                with urllib.request.urlopen(request, timeout=self.timeout) as response:
                    response_headers = {key.lower(): value for key, value in response.headers.items()}
                    body = json.loads(response.read().decode("utf-8"))
                    if use_cache:
                        self._write_cache(url, body, response_headers)
                    return body, response_headers, Observation(url, "observed", ISO_NOW(), url=url)
            except urllib.error.HTTPError as exc:
                if exc.code == 404 and allow_404:
                    return None, {}, Observation(url, "not_found", ISO_NOW(), url=url)
                if exc.code in {403, 429} and attempt + 1 < retries:
                    retry_after = int(exc.headers.get("Retry-After", "2"))
                    time.sleep(min(retry_after * (attempt + 1), 20))
                    continue
                return None, {}, Observation(url, "error", ISO_NOW(), f"HTTP {exc.code}", url)
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
                if attempt + 1 < retries:
                    time.sleep(2**attempt)
                    continue
                return None, {}, Observation(url, "error", ISO_NOW(), str(exc), url)
        return None, {}, Observation(url, "error", ISO_NOW(), "retry budget exhausted", url)

    def request_text(
        self, url: str, *, use_cache: bool = True, allow_404: bool = False
    ) -> tuple[str | None, Observation]:
        cached = self._read_cache(url) if use_cache else None
        if cached and isinstance(cached[0], str):
            return cached[0], Observation(url, "cached", ISO_NOW(), url=url)
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                headers = {key.lower(): value for key, value in response.headers.items()}
                body = response.read().decode("utf-8", errors="replace")
                if use_cache:
                    self._write_cache(url, body, headers)
                return body, Observation(url, "observed", ISO_NOW(), url=url)
        except urllib.error.HTTPError as exc:
            if exc.code == 404 and allow_404:
                return None, Observation(url, "not_found", ISO_NOW(), url=url)
            return None, Observation(url, "error", ISO_NOW(), f"HTTP {exc.code}", url)
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            return None, Observation(url, "error", ISO_NOW(), str(exc), url)

    def github_pages(
        self, path: str, *, limit: int | None = None
    ) -> tuple[list[Any], list[Observation]]:
        url = f"https://api.github.com/{path.lstrip('/')}"
        items: list[Any] = []
        observations: list[Observation] = []
        while url and (limit is None or len(items) < limit):
            body, headers, observation = self.request_json(url, github=True)
            observations.append(observation)
            if not isinstance(body, list):
                break
            items.extend(body)
            url = parse_next_link(headers.get("link"))
        return items if limit is None else items[:limit], observations


def parse_next_link(link: str | None) -> str | None:
    if not link:
        return None
    for part in link.split(","):
        match = re.match(r'\s*<([^>]+)>;\s*rel="([^"]+)"', part)
        if match and match.group(2) == "next":
            return match.group(1)
    return None


def last_page_count(headers: dict[str, str], current_items: int) -> int | None:
    link = headers.get("link", "")
    for part in link.split(","):
        match = re.match(r'\s*<([^>]+)>;\s*rel="last"', part)
        if match:
            query = urllib.parse.parse_qs(urllib.parse.urlparse(match.group(1)).query)
            try:
                return int(query["page"][0])
            except (KeyError, ValueError, IndexError):
                pass
    return current_items if current_items < 100 else None
