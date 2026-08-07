from __future__ import annotations

import hashlib
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from ..tables.catalog_entry import CatalogEntry
from ..tables.organization import Organization
from ..tables.portfolio import Portfolio
from ..tables.portfolio_product import PortfolioProduct
from ..tables.product import Product
from ..tables.registry import ALL_TABLES


def stable_id(namespace: str, *parts: object) -> str:
    material = "\x1f".join(str(part) for part in parts)
    digest = hashlib.sha256(material.encode("utf-8")).hexdigest()[:20]
    return f"{namespace}:{digest}"


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


def merge_catalog_entry(session, *, kind: str, item: object, observed_at: datetime) -> None:
    source_id = str(item.id)
    session.merge(
        CatalogEntry(
            id=f"{kind}:{source_id}",
            kind=kind,
            source_id=source_id,
            organization_id=getattr(item, "organization_id", None),
            slug=str(getattr(item, "slug", source_id)),
            name=str(getattr(item, "name", source_id)),
            summary=getattr(item, "summary", None) or getattr(item, "description", None),
            canonical_url=getattr(item, "canonical_url", None)
            or getattr(item, "url", None)
            or getattr(item, "registry_url", None),
            visibility=getattr(item, "visibility", "public") or "public",
            maturity=getattr(item, "maturity", None),
            observed_at=observed_at,
        )
    )


def clear_catalog(session) -> None:
    for table in reversed(ALL_TABLES):
        session.query(table).delete(synchronize_session=False)
    session.flush()


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
    counts = {"products": 0, "portfolios": 0}
    by_slug: dict[str, object] = {}
    for row in editorial.get("records", []):
        if row.get("record_type") not in {"product", "portfolio"}:
            continue
        table = Product if row["record_type"] == "product" else Portfolio
        item = table(
            id=row["id"],
            organization_id=row["organization_id"],
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
        merge_catalog_entry(session, kind=row["record_type"], item=item, observed_at=observed_at)
        counts[f"{row['record_type']}s"] += 1
        by_slug[row["slug"]] = item

    for row in editorial.get("records", []):
        if row.get("record_type") != "portfolio":
            continue
        for position, slug in enumerate(row.get("related_slugs", [])):
            target = by_slug.get(slug)
            if isinstance(target, Product):
                session.merge(
                    PortfolioProduct(
                        id=stable_id("portfolio-product", row["id"], target.id),
                        portfolio_id=row["id"],
                        product_id=target.id,
                        role="member",
                        sort_order=position,
                        observed_at=observed_at,
                    )
                )
    return counts
