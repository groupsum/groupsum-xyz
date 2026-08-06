from __future__ import annotations

import ast
import json
from typing import Any


def requirement_fields(value: Any) -> dict[str, Any] | None:
    """Return structured dependency fields from current JSON or legacy literals."""
    if isinstance(value, dict):
        return value
    if not isinstance(value, str) or not value.strip().startswith("{"):
        return None
    try:
        parsed = json.loads(value)
    except json.JSONDecodeError:
        try:
            parsed = ast.literal_eval(value)
        except (SyntaxError, ValueError):
            return None
    return parsed if isinstance(parsed, dict) else None


def stored_requirement(value: Any) -> Any:
    """Store structured requirements as deterministic JSON text."""
    fields = requirement_fields(value)
    if fields is None:
        return value
    return json.dumps(fields, sort_keys=True, separators=(",", ":"))


def presented_requirement(value: Any) -> Any:
    """Expose structured requirements as objects in API page models."""
    fields = requirement_fields(value)
    return fields if fields is not None else value


def present_requirements(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    for record in records:
        record["requirement"] = presented_requirement(record.get("requirement"))
    return records
