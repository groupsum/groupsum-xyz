from __future__ import annotations

import ast
import json
import re
from collections import Counter
from urllib.parse import quote

from .view_common import _page, current_entity_query, package_resource, payload, source_record


def normalized_name(ecosystem, name):
    name = str(name).strip()
    if ecosystem == "pypi":
        return re.sub(r"[-_.]+", "-", name).casefold()
    if ecosystem in {"npm", "crates"}:
        return name.casefold().replace("_", "-") if ecosystem == "crates" else name.casefold()
    return name


def package_identity(row):
    return {
        "id": row.id,
        "name": row.name,
        "ecosystem": row.ecosystem,
        "route": (
            f"/catalog/packages/{quote(row.ecosystem, safe='')}/{quote(row.route_key, safe='')}"
        ),
        "repository": getattr(row, "repository", None),
    }


def resolve_relationships(item, rows, direction):
    by_id = {row.id: row for row in rows if row.route_key}
    by_name = {}
    for row in by_id.values():
        by_name.setdefault((row.ecosystem, normalized_name(row.ecosystem, row.name)), []).append(
            row
        )
    result = []
    for edge in item.get("dependents" if direction == "dependent" else "dependencies", []):
        edge = dict(edge)
        ecosystem = str(edge.get("ecosystem") or item.get("ecosystem") or "")
        identity = str(edge.get("source_id" if direction == "dependent" else "target_id") or "")
        key = str(edge.get("package_key") or "")
        key_name = key.partition(":")[2] or (
            identity.partition(":")[2] if identity.startswith(f"{ecosystem}:") else identity
        )
        name = str(edge.get("name") or edge.get("source_name") or key_name)
        requirement = edge.get("requirement")
        details = requirement if isinstance(requirement, dict) else {}
        if isinstance(requirement, str) and requirement.lstrip().startswith("{"):
            for parse in (json.loads, ast.literal_eval):
                try:
                    parsed = parse(requirement)
                    if isinstance(parsed, dict):
                        details = parsed
                        break
                except (ValueError, TypeError, SyntaxError):
                    pass
        alias = details.get("package")
        if isinstance(requirement, str) and requirement.startswith("npm:"):
            alias = requirement[4:].rsplit("@", 1)[0]
        candidates = (
            [by_id[identity]]
            if identity in by_id
            else by_name.get((ecosystem, normalized_name(ecosystem, alias or name)), [])
        )
        if len(candidates) == 1:
            resolution = "resolved"
        elif candidates:
            resolution = "ambiguous"
        else:
            resolution = (
                "unresolved"
                if edge.get("internal")
                or edge.get("target_kind") == "package"
                or direction == "dependent"
                else "external"
            )
        optional = (
            details.get("optional") is True
            or edge.get("optional") is True
            or "optional" in str(edge.get("scope") or "").casefold()
        )
        result.append(
            {
                **edge,
                "name": name,
                "ecosystem": ecosystem,
                "scope": edge.get("scope") or "dependencies",
                "optional": optional,
                "resolution": resolution,
                "package": package_identity(candidates[0]) if len(candidates) == 1 else None,
                "candidates": [
                    package_identity(row) for row in sorted(candidates, key=lambda row: row.id)
                ]
                if len(candidates) > 1
                else [],
            }
        )
    return result


def package_relationships(table, ctx):
    params = payload(ctx)
    session = ctx["db"]
    row = (
        current_entity_query(session, table)
        .filter(table.route_key == str(params.get("route_key") or ""))
        .first()
    )
    if row is None:
        return {"detail": "Package not found"}
    item = package_resource(source_record(row))
    direction = "dependent" if params.get("direction") == "dependent" else "dependency"
    # Only identity columns/payload identity are needed for resolution; never N+1 reads.
    rows = (
        current_entity_query(session, table)
        .with_entities(
            table.id,
            table.name,
            table.ecosystem,
            table.route_key,
            table.source_payload["repository"].label("repository"),
        )
        .all()
    )
    values = resolve_relationships(item, rows, direction)
    facets = {
        "scope": dict(Counter(edge["scope"] for edge in values)),
        "resolution": dict(Counter(edge["resolution"] for edge in values)),
    }
    search = str(params.get("q") or "").strip().casefold()
    for field in ("scope", "resolution"):
        if params.get(field):
            values = [edge for edge in values if edge[field] == params[field]]
    if params.get("optional") in {"true", "false"}:
        values = [edge for edge in values if edge["optional"] == (params["optional"] == "true")]
    if search:
        values = [
            edge
            for edge in values
            if search in f"{edge['name']} {edge.get('requirement') or ''}".casefold()
        ]
    values.sort(key=lambda edge: (edge["name"].casefold(), edge["scope"], edge["id"]))
    selected, page, page_size, page_count = _page(values, params)
    return {
        "kind": "package_relationship_collection",
        "direction": direction,
        "count": len(values),
        "page": page,
        "page_size": page_size,
        "page_count": page_count,
        "facets": facets,
        "dependency_count": len(item["dependencies"]),
        "dependent_count": len(item["dependents"]),
        "coverage": "Direct relationships within the current catalog; not global dependent counts.",
        "records": selected,
    }
