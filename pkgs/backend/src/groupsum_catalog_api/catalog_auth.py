from __future__ import annotations

import hashlib
import hmac
from dataclasses import dataclass
from typing import Any

from .config import Settings

PUBLISH_SCOPE = "catalog:publish"


@dataclass(frozen=True, slots=True)
class PublisherPrincipal:
    publisher_id: str
    scopes: frozenset[str]


def _bearer_token(ctx: dict[str, Any]) -> str | None:
    request = getattr(ctx, "request", None) or ctx.get("request")
    supplied = request.headers.get("authorization", "") if request is not None else ""
    prefix = "Bearer "
    return supplied[len(prefix) :] if supplied.startswith(prefix) else None


def _matches_digest(token: str, expected: object) -> bool:
    actual = hashlib.sha256(token.encode("utf-8")).hexdigest()
    return isinstance(expected, str) and hmac.compare_digest(actual, expected.lower())


def authenticate_publisher(
    ctx: dict[str, Any], settings: Settings | None = None
) -> PublisherPrincipal | None:
    token = _bearer_token(ctx)
    if not token:
        return None
    current = settings or Settings.from_environment()
    for publisher_id, definition in current.catalog_publish_keys.items():
        if not isinstance(definition, dict) or not _matches_digest(
            token, definition.get("sha256")
        ):
            continue
        scopes = frozenset(str(value) for value in definition.get("scopes", ()))
        return PublisherPrincipal(str(publisher_id), scopes)
    if current.catalog_publish_api_key and hmac.compare_digest(
        token, current.catalog_publish_api_key
    ):
        return PublisherPrincipal(current.catalog_publisher_id, frozenset({PUBLISH_SCOPE}))
    if current.catalog_internal_token and hmac.compare_digest(
        token, current.catalog_internal_token
    ):
        return PublisherPrincipal("legacy-internal-token", frozenset({PUBLISH_SCOPE}))
    return None


def require_publisher(ctx: dict[str, Any]) -> PublisherPrincipal | None:
    principal = authenticate_publisher(ctx)
    return principal if principal and PUBLISH_SCOPE in principal.scopes else None


__all__ = [
    "PUBLISH_SCOPE",
    "PublisherPrincipal",
    "authenticate_publisher",
    "require_publisher",
]
