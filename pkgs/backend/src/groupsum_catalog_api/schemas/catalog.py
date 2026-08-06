from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class ApiModel(BaseModel):
    model_config = ConfigDict(extra="allow")


class CatalogOverview(ApiModel):
    kind: Literal["catalog_overview"]
    generated_at: datetime | None = None
    counts: dict[str, int]


class MetricPoint(ApiModel):
    observed_at: datetime | None = None
    value: float


class CommitPoint(ApiModel):
    date: str
    count: int


class RepositorySummary(ApiModel):
    id: str
    owner: str
    name: str
    url: str
    description: str | None = None
    route: str
    package_count: int = 0
    resource_count: int = 0
    release_count: int = 0
    metrics: dict[str, float] = Field(default_factory=dict)
    history: dict[str, list[MetricPoint]] = Field(default_factory=dict)
    commit_activity: list[CommitPoint] = Field(default_factory=list)
    observed_at: datetime | None = None


class PackageSummary(ApiModel):
    id: str
    ecosystem: str
    name: str
    registry_url: str
    route_key: str | None = None
    route: str
    package_kind: str
    publication_status: str | None = None
    latest_version: str | None = None
    release_count: int = 0
    dependency_count: int = 0
    dependent_count: int = 0
    observed_at: datetime | None = None


class TypedResourceSummary(ApiModel):
    id: str
    resource_type: str
    route_key: str | None = None
    title: str
    url: str
    summary: str | None = None
    route: str
    repository_owner: str | None = None
    repository_name: str | None = None
    observed_at: datetime | None = None
    type_label: str | None = None
    resource_family: str | None = None
    icon_key: str | None = None


class TechnologySummary(ApiModel):
    id: str
    slug: str
    name: str
    category: str | None = None
    description: str | None = None
    record_count: int = 0
    route: str


class CatalogCollection(ApiModel):
    kind: str
    resource_kind: Literal["repository", "package", "resource", "technology"]
    count: int
    page: int = 1
    page_size: int = 50
    page_count: int = 1
    facets: dict[str, dict[str, int]] = Field(default_factory=dict)
    generated_at: datetime | None = None
    records: list[RepositorySummary | PackageSummary | TypedResourceSummary | TechnologySummary]


class CatalogMember(ApiModel):
    kind: str
    resource_type: str | None = None
    item: dict[str, Any]
    graph: dict[str, Any] | None = None
    linked_sections: list[dict[str, Any]] = Field(default_factory=list)
    parent: dict[str, Any] | None = None
    implementation: dict[str, Any] = Field(default_factory=dict)
    governance: dict[str, Any] = Field(default_factory=dict)
    legal: dict[str, Any] = Field(default_factory=dict)
    related_records: list[dict[str, Any]] = Field(default_factory=list)
