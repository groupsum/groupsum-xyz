from __future__ import annotations

import hashlib
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from .domain.resources.ontology import RECORD_RESOURCE_TYPES
from .domain.resources.relationship_types import RELATIONSHIP_TYPES
from .tables.association import Association
from .tables.organization import Organization
from .tables.portfolio import Portfolio
from .tables.registry import ENTITY_TABLES


def stable_id(namespace: str, *parts: object) -> str:
    material = "\x1f".join(str(part) for part in parts)
    digest = hashlib.sha256(material.encode("utf-8")).hexdigest()[:20]
    return f"{namespace}:{digest}"


def merge_association(
    session,
    *,
    source_type: str,
    source_id: object,
    relationship_type: str,
    target_type: str,
    target_id: object,
    observed_at: datetime,
    role: str = "",
    sort_order: int = 0,
    attributes: dict[str, Any] | None = None,
) -> Association:
    """Create or update one directed edge in a compiled catalog graph."""

    if source_type not in ENTITY_TABLES:
        raise ValueError(f"Unknown association source type: {source_type}")
    if target_type not in ENTITY_TABLES:
        raise ValueError(f"Unknown association target type: {target_type}")
    if relationship_type not in RELATIONSHIP_TYPES:
        raise ValueError(f"Unknown relationship type: {relationship_type}")
    source_id, target_id = str(source_id), str(target_id)
    edge = Association(
        id=stable_id(
            "association",
            source_type,
            source_id,
            relationship_type,
            target_type,
            target_id,
            role,
        ),
        source_type=source_type,
        source_id=source_id,
        relationship_type=relationship_type,
        target_type=target_type,
        target_id=target_id,
        role=role,
        sort_order=sort_order,
        attributes=attributes or None,
        observed_at=observed_at,
    )
    session.merge(edge)
    return edge


def parse_datetime(value: object) -> datetime | None:
    if not value:
        return None
    if isinstance(value, datetime):
        return value
    text = str(value).replace("Z", "+00:00")
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)


def route_slug(route: object, fallback: str) -> str:
    value = str(route or "").strip("/").rsplit("/", 1)[-1]
    return value or fallback


def load_inputs(repo_root: Path) -> tuple[dict[str, Any], list[dict], list[dict], list[dict]]:
    editorial = json.loads((repo_root / "catalog/content/records.json").read_text(encoding="utf-8"))
    generated = repo_root / "catalog/generated/site"
    repositories = json.loads((generated / "repositories.json").read_text(encoding="utf-8"))
    packages = json.loads((generated / "packages.json").read_text(encoding="utf-8"))
    technologies = json.loads((generated / "technologies.json").read_text(encoding="utf-8"))
    return editorial, repositories, packages, technologies


def import_organizations(session, editorial: dict, observed_at: datetime) -> int:
    for row in editorial.get("organizations", []):
        session.merge(
            Organization(
                id=row["id"],
                slug=row["slug"],
                name=row["name"],
                summary=row.get("summary"),
                website_url=row.get("website_url"),
                source_url=row.get("source_url"),
                observed_at=observed_at,
            )
        )
    return len(editorial.get("organizations", []))


def import_editorial(session, editorial: dict, observed_at: datetime) -> dict[str, int]:
    counts = {
        "products": 0,
        "portfolios": 0,
        "solutions": 0,
        "services": 0,
        "insights": 0,
    }
    by_slug: dict[str, tuple[str, object]] = {}
    for row in editorial.get("records", []):
        record_type = row.get("record_type")
        entity_type = RECORD_RESOURCE_TYPES.get(str(record_type))
        if entity_type not in ENTITY_TABLES:
            continue
        table = ENTITY_TABLES[entity_type]
        if record_type == "insight":
            item = table(
                id=row["id"],
                slug=row["slug"],
                title=row["title"],
                summary=row.get("summary"),
                body_url=row.get("canonical_url"),
                author=row.get("author"),
                visibility=row.get("visibility", "public"),
                published_at=parse_datetime(row.get("published_at")),
                observed_at=observed_at,
                source_payload=row,
            )
        else:
            item = table(
                id=row["id"],
                slug=row["slug"],
                name=row["title"],
                eyebrow=row.get("eyebrow"),
                summary=row["summary"],
                body_markdown=row.get("body_markdown"),
                maturity=row.get("maturity"),
                visibility=row.get("visibility", "public"),
                featured=bool(row.get("featured")),
                canonical_url=row.get("canonical_url"),
                source_url=row.get("source_url"),
                published_at=parse_datetime(row.get("published_at")),
                updated_at=parse_datetime(row.get("updated_at")),
                content_revision=int(row.get("content_revision", 1)),
                **(
                    {"focus": row.get("focus") or row.get("claim_boundary")}
                    if table is Portfolio
                    else {}
                ),
            )
        session.merge(item)
        merge_association(
            session,
            source_type=entity_type,
            source_id=row["id"],
            relationship_type="owned_by",
            target_type=Organization.ENTITY_TYPE,
            target_id=row["organization_id"],
            observed_at=observed_at,
        )
        count_key = "portfolios" if record_type == "portfolio" else f"{record_type}s"
        counts[count_key] += 1
        by_slug[row["slug"]] = (entity_type, item)

    for row in editorial.get("records", []):
        if row.get("record_type") != "portfolio":
            continue
        for position, slug in enumerate(row.get("related_slugs", [])):
            target = by_slug.get(slug)
            if target is not None:
                target_type, target_item = target
                merge_association(
                    session,
                    source_type=Portfolio.ENTITY_TYPE,
                    source_id=row["id"],
                    relationship_type="contains",
                    target_type=target_type,
                    target_id=target_item.id,
                    role="member",
                    sort_order=position,
                    observed_at=observed_at,
                )
    return counts
