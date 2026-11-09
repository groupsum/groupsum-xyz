import { catalogFetch } from "./client";
import type { RecordCollectionPageModel } from "./catalog.generated";

export * from "./catalog.generated";

export type ContributorRecord = CatalogRecord & { name: string; provider: string; login?: string; route: string; account_type: string; repository_count: number; contributions: number; rank?: number; observed_at?: string; avatar_url?: string; url?: string };
export type ContributorCollection = { kind: "contributor_collection"; count: number; page: number; page_count: number; account_types: string[]; records: ContributorRecord[] };
export async function getContributors(query: Record<string, string | number>, signal?: AbortSignal): Promise<ContributorCollection> {
  const response = await catalogFetch(`/api/v1/contributors?${new URLSearchParams(Object.entries(query).map(([key, value]) => [key, String(value)]))}`, { signal });
  if (!response.ok) throw new Error(`Contributor directory response ${response.status}`);
  return response.json();
}
export type PackageRelationship = Record<string, unknown> & { id: string; name: string; ecosystem: string; scope: string; optional: boolean; resolution: "resolved" | "ambiguous" | "external" | "unresolved"; package?: { id: string; name: string; route: string; repository?: string }; candidates: Array<{ id: string; name: string; route: string; repository?: string }> };
export type PackageRelationships = { kind: string; count: number; page: number; page_count: number; dependency_count: number; dependent_count: number; facets: { scope: Record<string, number>; resolution: Record<string, number> }; records: PackageRelationship[]; coverage: string };
export async function getPackageRelationships(routeKey: string, query: Record<string, string | number>, signal?: AbortSignal): Promise<PackageRelationships> {
  const response = await catalogFetch(`/api/v1/catalog/packages/${encodeURIComponent(routeKey)}/relationships?${new URLSearchParams(Object.entries(query).map(([key, value]) => [key, String(value)]))}`, { signal });
  if (!response.ok) throw new Error(`Package relationships response ${response.status}`);
  return response.json();
}

export type CatalogRecord = Record<string, unknown> & { id: string };
export type RepositorySummary = CatalogRecord;
export type PackageSummary = CatalogRecord;
export type CatalogResourceSummary = CatalogRecord;
export type TechnologySummary = CatalogRecord;
export type CatalogCollection = {
  generated_at?: string | null;
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  records: CatalogRecord[];
  facets: Record<string, Record<string, number>>;
  aggregates: Record<string, number>;
  resource_types?: ResourceTypeDescriptor[];
};
export type ResourceTypeDescriptor = {
  id: string;
  resource_type: string;
  label: string;
  family: string;
  icon_key: string;
  detail_schema_key: string;
  table_name: string;
  count: number;
  populated: boolean;
};
export type CatalogMember = {
  snapshot_id?: string;
  item: CatalogRecord;
  resource_type?: string;
  parent?: CatalogRecord | null;
  graph?: unknown;
  linked_sections?: unknown[];
  related_records?: CatalogRecord[];
  governance?: Record<string, unknown>;
  legal?: Record<string, unknown>;
  implementation?: Record<string, unknown>;
};

export type CatalogDataset = "repositories" | "packages" | "resources" | "technologies";
export type CatalogQuery = {
  page: number;
  page_size: number;
  q?: string;
  owner?: string;
  ecosystem?: string;
  publication_status?: string;
  resource_type?: string;
  repository_owner?: string;
  repository?: string;
  projection?: "summary";
  sort?: string;
};

export async function getRecordCollectionPageModel(
  collection: "products" | "portfolio",
  signal?: AbortSignal,
): Promise<RecordCollectionPageModel> {
  const response = await catalogFetch(`/api/v1/${collection}`, {
    signal,
    headers: { Accept: "application/json" },
    cache: "default",
  });
  if (!response.ok) throw new Error(`${collection} collection response ${response.status}`);
  return response.json() as Promise<RecordCollectionPageModel>;
}

function routeRecord(dataset: CatalogDataset, record: CatalogRecord): CatalogRecord {
  if (dataset === "repositories") return { ...record, kind: "repository", route: String(record.route || `/catalog/repositories/${encodeURIComponent(String(record.owner || ""))}/${encodeURIComponent(String(record.name || record.id))}`) };
  if (dataset === "packages") return { ...record, kind: "package", route: String(record.route || `/catalog/packages/${encodeURIComponent(String(record.ecosystem || "package"))}/${encodeURIComponent(String(record.route_key || record.id))}`) };
  if (dataset === "resources") return { ...record, kind: "resource", name: record.title, route: String(record.route || record.canonical_path || `/catalog/resources/${encodeURIComponent(String(record.resource_type || "resource"))}/${encodeURIComponent(record.id)}`) };
  return { ...record, kind: "technology", route: String(record.route || `/catalog/technologies/${encodeURIComponent(String(record.slug || record.id))}`) };
}

export async function listCatalog(dataset: CatalogDataset, query: CatalogQuery, signal?: AbortSignal): Promise<CatalogCollection> {
  const params = new URLSearchParams();
  if (dataset === "repositories") params.set("star_history", "1");
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const response = await catalogFetch(`/api/v1/catalog/${dataset}?${params}`, { signal, headers: { Accept: "application/json" }, cache: "default" });
  if (!response.ok) throw new Error(`${dataset} list response ${response.status}`);
  const payload = await response.json() as CatalogCollection;
  if (!Array.isArray(payload.records)) throw new Error(`${dataset} list response did not contain records`);
  return { ...payload, records: payload.records.map((record) => routeRecord(dataset, record)) };
}

async function getCatalogMember(path: string, label: string, signal?: AbortSignal): Promise<CatalogMember> {
  const response = await catalogFetch(path, { signal, headers: { Accept: "application/json" }, cache: "default" });
  if (!response.ok) throw new Error(`${label} member response ${response.status}`);
  const payload = await response.json() as CatalogMember;
  if (!payload.item || typeof payload.item !== "object") throw new Error(`${label} member response 404`);
  return payload;
}

export async function getCatalogRepositoryMember(owner: string, repository: string, signal?: AbortSignal) {
  return getCatalogMember(`/api/v1/catalog/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`, "repositories", signal);
}

export async function getCatalogPackageMember(routeKey: string, signal?: AbortSignal) {
  return getCatalogMember(`/api/v1/catalog/packages/${encodeURIComponent(routeKey)}`, "packages", signal);
}

export async function getCatalogResourceMember(resourceType: string, routeKey: string, signal?: AbortSignal) {
  const response = await catalogFetch(`/api/v1/catalog/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(routeKey)}`, { signal, headers: { Accept: "application/json" }, cache: "default" });
  if (!response.ok) throw new Error(`resources member response ${response.status}`);
  return await response.json() as CatalogMember;
}

export async function getCatalogReleaseMember(routeKey: string, signal?: AbortSignal): Promise<CatalogMember> {
  return getCatalogMember(`/api/v1/catalog/releases/${encodeURIComponent(routeKey)}`, "releases", signal);
}

export async function getCatalogTechnologyMember(slug: string, signal?: AbortSignal) {
  return getCatalogMember(`/api/v1/catalog/technologies/${encodeURIComponent(slug)}`, "technologies", signal);
}
