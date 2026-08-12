from __future__ import annotations

from collections.abc import Iterable, Mapping
from typing import Any
from urllib.parse import parse_qsl, unquote


def decode_path_parameters(
    params: Mapping[str, Any], expected_parts: Iterable[str]
) -> dict[str, Any]:
    path_names = {
        part[1:-1]
        for part in expected_parts
        if part.startswith("{") and part.endswith("}")
    }
    return {
        key: unquote(str(value)) if key in path_names else value
        for key, value in params.items()
    }


def binding_parameters(ctx: dict[str, Any], template: str) -> dict[str, Any]:
    """Collect and decode parameters exposed across Tigrbl request contexts."""

    params = dict(ctx.get("payload") or {})
    request = getattr(ctx, "request", None) or ctx.get("request")
    if request is not None:
        params.update(request.query_params)
        params.update(request.path_params)
        params.update(request.scope.get("path_params", {}))
    params.update(ctx.get("query_params") or {})
    params.update(ctx.get("path_params") or {})
    params.update(getattr(ctx, "path_params", None) or {})
    temp = ctx.get("temp") or {}
    for namespace in (temp.get("route"), temp.get("dispatch")):
        if isinstance(namespace, dict):
            params.update(namespace.get("path_params") or {})
    hot = temp.get("hot_ctx")
    if hot is not None:
        params.update(getattr(hot, "path_params", None) or {})
        params.update(getattr(hot, "route_path_params", None) or {})
        scope = getattr(hot, "raw_scope", None) or {}
        params.update(scope.get("path_params") or {})
        query_string = scope.get("query_string", b"")
        if isinstance(query_string, bytes):
            query_string = query_string.decode("utf-8")
        params.update(parse_qsl(str(query_string)))

    expected_parts = template.strip("/").split("/")
    actual = str((getattr(hot, "raw_scope", None) or {}).get("path") or "")
    actual_parts = actual.strip("/").split("/")
    if len(expected_parts) == len(actual_parts):
        for expected, value in zip(expected_parts, actual_parts, strict=True):
            if expected.startswith("{") and expected.endswith("}"):
                params.setdefault(expected[1:-1], value)
    return decode_path_parameters(params, expected_parts)


__all__ = ["binding_parameters", "decode_path_parameters"]
