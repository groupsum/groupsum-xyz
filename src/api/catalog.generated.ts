// Generated from backend/openapi.json. Do not edit manually.
export const OPENAPI_SHA256 = "76e3f154ab21e8cbb3b16360fa95e05c05646c9918d82fa010525fd90d823490" as const;

export type TaxonomyItem = { slug: string; label: string; category: string | null };
export type MetricPoint = { observed_at: string; value: number };
export type CommitActivityPoint = { date: string; count: number };
export type SsotGovernanceSummary = {
  present?: boolean; governed?: boolean; valid?: boolean; registry_url?: string | null;
  source_sha256?: string | null; schema_version?: string | null; observed_at?: string | null;
  counts?: Record<string, number>; status_counts?: Record<string, Record<string, number>>;
  coverage?: Record<string, number>; limitation?: string | null;
};
export type RepositorySignals = {
  repository_count?: number; metrics: Record<"stars" | "forks" | "watchers" | "contributors" | "commits", number>;
  history: Record<"stars" | "forks" | "watchers" | "contributors", MetricPoint[]>;
  commit_activity: CommitActivityPoint[]; observed_at?: string | null;
};
export type RepositoryEvidence = {
  id: string; owner: string; name: string; url: string; description?: string | null;
  default_branch?: string | null; is_archived: boolean; is_fork: boolean;
  observed_at?: string | null; role: string; metrics: Record<string, number>;
  history: RepositorySignals["history"]; commit_activity: CommitActivityPoint[];
  ssot_governed?: boolean; ssot_registry_url?: string | null;
  ssot_schema_version?: string | null; ssot_summary?: SsotGovernanceSummary;
};
export type RepositoryMetricRecord = RepositorySignals & {
  id: string; owner: string; name: string; url: string; route: string;
  description?: string | null;
};
export type RepositoryMetricSnapshot = {
  kind: "repository_metric_snapshot"; owner?: string | null; generated_at?: string | null;
  count: number; repositories: RepositoryMetricRecord[];
};
export type PackageEvidence = {
  id: string; ecosystem: string; name: string; registry_url: string;
  source_url?: string | null; manifest_path?: string | null; description?: string | null;
  latest_version?: string | null; published?: boolean | null; publication_status?: string | null;
  route_key?: string | null;
  published_at?: string | null; observed_at?: string | null; role: string;
  release_count: number; dependency_count: number; dependent_count: number;
  downloads?: number | null;
};
export type ResourceEvidence = {
  id: string; resource_type: string; title: string; url: string;
  route_key?: string | null;
  summary?: string | null; observed_at?: string | null; role: string;
};
export type ReleaseEvidence = {
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
export type DependencyEvidence = {
  id: string; source_id: string; source_kind?: string; source_ecosystem?: string | null;
  source_name?: string | null; target_kind?: string; target_id: string;
  requirement?: string | null; scope?: string | null; evidence_type: string;
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
  repository_count: number; resource_count: number; release_count: number;
  dependency_count: number; dependent_count: number; technologies: string[];
  signals: RepositorySignals;
};
export type RecordCollectionPageModel = {
  kind: string; generated_at: string | null; count: number; records: RecordSummary[];
};
export type RecordPageModel = {
  kind: string; generated_at: string;
  record: Record<string, unknown> & { id: string; slug: string; title: string; summary: string };
  taxonomies: Record<string, TaxonomyItem[]>;
  implementation: {
    repositories: RepositoryEvidence[]; packages: PackageEvidence[]; resources: ResourceEvidence[];
    releases: ReleaseEvidence[]; release_summary: ReleaseSummary[];
    deployments: Array<Record<string, unknown>>; dependencies: DependencyEvidence[];
    dependents: DependencyEvidence[]; dependency_summary: DependencySummary;
    signals: RepositorySignals;
  };
  relations: Array<Record<string, unknown>>;
  governance: {
    features: Array<Record<string, unknown>>;
    claims: Array<Record<string, unknown>>;
    evidence: Array<Record<string, unknown>>;
    limitations: Array<Record<string, unknown>>;
    claim_rooting: { total: number; rooted: number; unrooted: number; status: string; limitation?: string | null };
    ssot_registries: Array<{
      repository_id: string; repository: string; governed: boolean;
      registry_url?: string | null; schema_version?: string | null; observed_at?: string | null;
      summary: SsotGovernanceSummary;
    }>;
  };
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
