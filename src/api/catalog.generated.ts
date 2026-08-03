// Generated from backend/openapi.json. Do not edit manually.
export const OPENAPI_SHA256 = "1039409c029e6764b429e71798b24abfb618be025b8cee089a8f5eec43dae3d8" as const;

export type TaxonomyItem = { slug: string; label: string; category: string | null };
export type RepositoryEvidence = {
  id: string; owner: string; name: string; url: string; description?: string | null;
  default_branch?: string | null; is_archived: boolean; is_fork: boolean;
  observed_at?: string | null; role: string; metrics: Record<string, number>;
};
export type PackageEvidence = {
  id: string; ecosystem: string; name: string; registry_url: string;
  description?: string | null; latest_version?: string | null;
  published_at?: string | null; observed_at?: string | null; role: string;
};
export type ResourceEvidence = {
  id: string; resource_type: string; title: string; url: string;
  summary?: string | null; observed_at?: string | null; role: string;
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
export type RecordPageModel = {
  kind: string; generated_at: string;
  record: Record<string, unknown> & { id: string; slug: string; title: string; summary: string };
  taxonomies: Record<string, TaxonomyItem[]>;
  implementation: {
    repositories: RepositoryEvidence[]; packages: PackageEvidence[]; resources: ResourceEvidence[];
    releases: Array<Record<string, unknown>>; deployments: Array<Record<string, unknown>>;
  };
  relations: Array<Record<string, unknown>>;
  governance: {
    features: Array<Record<string, unknown>>;
    evidence: Array<Record<string, unknown>>;
    limitations: Array<Record<string, unknown>>;
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
