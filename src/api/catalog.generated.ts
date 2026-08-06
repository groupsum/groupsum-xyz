// Generated from backend/openapi.json. Do not edit manually.
export const OPENAPI_SHA256 = "f1a293b89b0f574441c7e29143766e8ba1f75a1c45d3723006e4e08b4bd1ef2f" as const;

export type TaxonomyItem = { slug: string; label: string; category: string | null };
export type MetricPoint = { observed_at: string; value: number };
export type CommitActivityPoint = { date: string; count: number };
export type SsotGovernanceSummary = {
  present?: boolean; governed?: boolean; valid?: boolean; registry_url?: string | null;
  source_sha256?: string | null; schema_version?: string | null; observed_at?: string | null;
  counts?: Record<string, number>; status_counts?: Record<string, Record<string, number>>;
  coverage?: Record<string, number>; limitation?: string | null;
  inventory_truncated?: Record<string, number>;
  inventory?: Record<string, Array<{
    id: string; status?: string; implementation_status?: string; title?: string;
    name?: string; statement?: string; evidence_ids?: string[]; test_ids?: string[];
    claim_ids?: string[]; feature_ids?: string[];
  }>>;
};
export type RepositoryGovernance = {
  governed: boolean; registry_url?: string | null; registry_sha256?: string | null;
  schema_version?: string | null; observed_at?: string | null; summary: SsotGovernanceSummary;
};
export type RepositorySignals = {
  repository_count?: number; metrics: Record<"stars" | "forks" | "watchers" | "contributors" | "commits", number>;
  history: Record<"stars" | "forks" | "watchers" | "contributors", MetricPoint[]>;
  commit_activity: CommitActivityPoint[]; observed_at?: string | null;
};
export type RepositoryResource = {
  id: string; owner: string; name: string; url: string; description?: string | null;
  default_branch?: string | null; is_archived: boolean; is_fork: boolean;
  observed_at?: string | null; role: string; metrics: Record<string, number>;
  history: RepositorySignals["history"]; commit_activity: CommitActivityPoint[];
  releases: ReleaseRecord[]; release_count: number; governance: RepositoryGovernance;
};
export type RepositoryMetricRecord = RepositorySignals & {
  id: string; owner: string; name: string; url: string; route: string;
  description?: string | null;
};
export type RepositoryMetricSnapshot = {
  kind: "repository_metric_snapshot"; owner?: string | null; generated_at?: string | null;
  count: number; repositories: RepositoryMetricRecord[];
};
export type PackageResource = {
  id: string; ecosystem: string; name: string; registry_url: string;
  source_url?: string | null; manifest_path?: string | null; description?: string | null;
  package_kind: string; private: boolean;
  latest_version?: string | null; published?: boolean | null; publication_status?: string | null;
  route_key?: string | null;
  published_at?: string | null; observed_at?: string | null; role: string;
  release_count: number; dependency_count: number; dependent_count: number;
  downloads?: number | null;
  repositories: Array<{ id: string; owner: string; name: string; url: string; path?: string | null }>;
  releases: ReleaseRecord[]; dependencies: DependencyObservation[]; dependents: DependencyObservation[];
  dependency_summary: { edge_count: number; unique_target_count: number; internal_edge_count: number; external_edge_count: number; by_scope: Record<string, number> };
  dependent_summary: { edge_count: number; unique_source_count: number; by_completeness: Record<string, number>; coverage: string };
};
export type LinkedCatalogResource = {
  id: string; resource_type: string; title: string; url: string;
  route_key?: string | null;
  summary?: string | null; observed_at?: string | null; role: string;
};
export type ReleaseRecord = {
  id: string; release_kind: string; version: string; url: string;
  route_key?: string | null;
  published_at?: string | null; downloads?: number | null; prerelease: boolean; draft: boolean;
  observed_at?: string | null; package_id?: string | null; repository_id?: string | null;
  package_name?: string | null; ecosystem?: string | null;
  repository_owner?: string | null; repository_name?: string | null;
};
export type ReleaseSummary = {
  release_kind: string; release_count: number; latest_at?: string | null; downloads: number;
};
export type DependencyObservation = {
  id: string; source_id: string; source_kind?: string; source_ecosystem?: string | null;
  source_name?: string | null; target_kind?: string; target_id: string;
  requirement?: string | null; scope?: string | null; origin_kind: string;
  source_url?: string | null; completeness: string; observed_at?: string | null;
};
export type DependencySummary = {
  dependencies: number; dependents: number; internal_dependencies: number;
  external_dependencies: number; dependency_rows_returned: number;
  dependent_rows_returned: number; dependent_coverage: string;
};
export type RecordSummary = {
  id: string; slug: string; record_type: string; title: string; eyebrow?: string | null;
  summary: string; maturity?: string | null; featured: boolean; canonical_url?: string | null;
  organization_id: string; organization_name: string; package_count: number;
  repository_count: number; resource_count: number; technologies: string[];
};
export type RecordCollectionPageModel = {
  kind: string; generated_at: string | null; count: number; records: RecordSummary[];
};
export type CatalogDatasetName = "repositories" | "packages" | "resources" | "technologies";
export type CatalogOverviewPageModel = {
  kind: "catalog_overview"; generated_at?: string | null;
  counts: Record<"products" | "portfolio" | CatalogDatasetName, number>;
};
export type CatalogCollectionPageModel = {
  kind: string; resource_kind: string; count: number; records: Array<Record<string, unknown>>;
};
export type CatalogEntity = {
  id: string; entity_type_id: string; type_label: string; semantic_class: string;
  organization_id?: string | null; slug: string; name: string; summary?: string | null;
  canonical_url?: string | null; route?: string | null; maturity?: string | null;
  observed_at?: string | null;
};
export type EntityRelationship = {
  id: string; relationship_type: string; role?: string | null; origin_kind: string;
  observation_id?: string | null; ssot_entity_id?: string | null;
  source_url?: string | null; confidence: string; status: string; observed_at?: string | null;
  entity_id: string; entity_type_id: string; type_label: string; semantic_class: string;
  name: string; summary?: string | null; canonical_url?: string | null; route?: string | null;
  organization_id?: string | null; direction: "outgoing" | "incoming";
};
export type EntityGraph = {
  entity: CatalogEntity; owner?: EntityRelationship | null;
  urls: Array<{ url_role: string; url: string; label?: string | null; origin_kind: string; observation_id?: string | null; observed_at?: string | null }>;
  relationships: EntityRelationship[]; outgoing: EntityRelationship[]; incoming: EntityRelationship[];
};
export type EntityPageModel = { kind: "entity_record"; graph: EntityGraph };
export type EntityCollectionPageModel = {
  kind: "entity_collection"; entity_type?: string | null; query: string; page: number;
  page_size: number; total: number; page_count: number;
  entities: Array<CatalogEntity & { relationship_count: number }>;
};
export type RecordPageModel = {
  kind: string; generated_at: string;
  record: Record<string, unknown> & { id: string; slug: string; title: string; summary: string };
  taxonomies: Record<string, TaxonomyItem[]>;
  implementation: {
    repositories: RepositoryResource[]; packages: PackageResource[]; resources: LinkedCatalogResource[];
    deployments: Array<Record<string, unknown>>;
  };
  relations: Array<Record<string, unknown>>;
  editorial: {
    observations: Array<Record<string, unknown>>; limitations: Array<Record<string, unknown>>;
    ssot_claim_rooting: { status: string; limitation?: string | null };
  };
  governance: {
    repositories: Array<RepositoryGovernance & { repository_id: string; repository: string; role: string }>;
  };
  graph?: EntityGraph | null;
  linked_sections?: LinkedResourceSection[];
};

export type LinkedResourceSection = {
  type_key: string; label: string; family: string; icon_key?: string | null;
  detail_schema_key?: string | null; count: number;
  members: Array<Record<string, unknown>>;
};

export async function getRecordPageModel(path: string, signal?: AbortSignal): Promise<RecordPageModel> {
  const response = await fetch(path, {
    signal,
    headers: { Accept: "application/json" },
    cache: "default",
  });
  if (!response.ok) throw new Error(`Catalog API response ${response.status}`);
  return response.json() as Promise<RecordPageModel>;
}

export async function getCatalogOverview(signal?: AbortSignal): Promise<CatalogOverviewPageModel> {
  const response = await fetch("/api/v1/catalog", { signal, headers: { Accept: "application/json" }, cache: "default" });
  if (!response.ok) throw new Error(`Catalog overview response ${response.status}`);
  return response.json() as Promise<CatalogOverviewPageModel>;
}

export async function getCatalogCollection(dataset: CatalogDatasetName, signal?: AbortSignal): Promise<CatalogCollectionPageModel> {
  const response = await fetch(`/api/v1/catalog/${dataset}`, { signal, headers: { Accept: "application/json" }, cache: "default" });
  if (!response.ok) throw new Error(`Catalog collection response ${response.status}`);
  return response.json() as Promise<CatalogCollectionPageModel>;
}

export async function getCatalogRepository(owner: string, repository: string, signal?: AbortSignal): Promise<Record<string, unknown>> {
  const response = await fetch(`/api/v1/catalog/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`, { signal, headers: { Accept: "application/json" }, cache: "default" });
  if (!response.ok) throw new Error(`Catalog repository response ${response.status}`);
  return response.json() as Promise<Record<string, unknown>>;
}

export async function getCatalogTechnology(slug: string, signal?: AbortSignal): Promise<Record<string, unknown>> {
  const response = await fetch(`/api/v1/catalog/technologies/${encodeURIComponent(slug)}`, { signal, headers: { Accept: "application/json" }, cache: "default" });
  if (!response.ok) throw new Error(`Catalog technology response ${response.status}`);
  return response.json() as Promise<Record<string, unknown>>;
}

export async function getRepositoryMetricSnapshot(owner = "", signal?: AbortSignal): Promise<RepositoryMetricSnapshot> {
  const query = owner ? `?owner=${encodeURIComponent(owner)}` : "";
  const response = await fetch(`/api/v1/repository-metrics${query}`, {
    signal,
    headers: { Accept: "application/json" },
    cache: "default",
  });
  if (!response.ok) throw new Error(`Repository metric response ${response.status}`);
  return response.json() as Promise<RepositoryMetricSnapshot>;
}

export async function getEntityPageModel(entityId: string, signal?: AbortSignal): Promise<EntityPageModel> {
  const response = await fetch(`/api/v1/entities/${encodeURIComponent(entityId)}`, {
    signal, headers: { Accept: "application/json" }, cache: "default",
  });
  if (!response.ok) throw new Error(`Entity API response ${response.status}`);
  return response.json() as Promise<EntityPageModel>;
}
