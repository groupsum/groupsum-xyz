import { catalogFetch } from "./client";

export type CatalogRecord = Record<string, unknown> & { id: string };
export type RepositorySummary = CatalogRecord;
export type PackageSummary = CatalogRecord;
export type TypedResourceSummary = CatalogRecord;
export type TechnologySummary = CatalogRecord;
export type CatalogCollection = {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  records: CatalogRecord[];
  facets: Record<string, Record<string, number>>;
};
export type CatalogMember = {
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
  sort?: string;
};

const nativeResources: Record<CatalogDataset, string> = {
  repositories: "repository",
  packages: "package",
  resources: "typedresource",
  technologies: "technology",
};

async function listNative(resource: string, signal?: AbortSignal): Promise<CatalogRecord[]> {
  const response = await catalogFetch(`/${resource}`, { signal, headers: { Accept: "application/json" }, cache: "default" });
  if (!response.ok) throw new Error(`${resource} list response ${response.status}`);
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error(`${resource} list response was not an array`);
  return payload.filter((item): item is CatalogRecord => Boolean(item) && typeof item === "object" && typeof (item as CatalogRecord).id === "string");
}

function routeRecord(dataset: CatalogDataset, record: CatalogRecord): CatalogRecord {
  if (dataset === "repositories") return { ...record, kind: "repository", route: `/catalog/repositories/${encodeURIComponent(String(record.owner || ""))}/${encodeURIComponent(String(record.name || record.id))}` };
  if (dataset === "packages") return { ...record, kind: "package", route: `/catalog/packages/${encodeURIComponent(String(record.route_key || record.id))}` };
  if (dataset === "resources") return { ...record, kind: "resource", name: record.title, route: String(record.canonical_path || `/catalog/resources/${encodeURIComponent(String(record.resource_type || "resource"))}/${encodeURIComponent(record.id)}`) };
  return { ...record, kind: "technology", route: `/catalog/technologies/${encodeURIComponent(String(record.slug || record.id))}` };
}

function facet(records: CatalogRecord[], key: string): Record<string, number> {
  return records.reduce<Record<string, number>>((values, record) => {
    const value = record[key];
    if (value !== null && value !== undefined && String(value)) values[String(value)] = (values[String(value)] || 0) + 1;
    return values;
  }, {});
}

function basicMember(item: CatalogRecord, resourceType?: string): CatalogMember {
  return {
    item,
    resource_type: resourceType,
    graph: null,
    linked_sections: [],
    legal: { license_expression: item.license_expression, status: item.license_expression ? "observed" : "not_observed", observations: [] },
    implementation: { repositories: [], packages: [], resources: [], releases: [], languages: [], technologies: [], dependencies: [], dependents: [], downloads: {} },
  };
}

async function findMember(dataset: CatalogDataset, predicate: (record: CatalogRecord) => boolean, signal?: AbortSignal): Promise<CatalogRecord> {
  const record = (await listNative(nativeResources[dataset], signal)).map((item) => routeRecord(dataset, item)).find(predicate);
  if (!record) throw new Error(`${dataset} member response 404`);
  return record;
}

export async function listCatalog(dataset: CatalogDataset, query: CatalogQuery, signal?: AbortSignal): Promise<CatalogCollection> {
  let records = (await listNative(nativeResources[dataset], signal)).map((record) => routeRecord(dataset, record));
  const q = query.q?.trim().toLocaleLowerCase();
  if (q) records = records.filter((record) => [record.name, record.title, record.description, record.summary, record.owner].some((value) => String(value || "").toLocaleLowerCase().includes(q)));
  if (query.owner) records = records.filter((record) => record.owner === query.owner);
  if (query.ecosystem) records = records.filter((record) => record.ecosystem === query.ecosystem);
  if (query.publication_status) records = records.filter((record) => record.publication_status === query.publication_status);
  if (query.resource_type) records = records.filter((record) => record.resource_type === query.resource_type);
  if (query.repository_owner) records = records.filter((record) => record.repository_owner === query.repository_owner);
  records.sort((left, right) => String(left.name || left.title || left.id).localeCompare(String(right.name || right.title || right.id)));
  if (query.sort === "recent") records.reverse();
  const count = records.length;
  const pageSize = Math.max(1, query.page_size);
  const pageCount = Math.max(1, Math.ceil(count / pageSize));
  const page = Math.min(Math.max(1, query.page), pageCount);
  const start = (page - 1) * pageSize;
  return {
    count,
    page,
    page_count: pageCount,
    page_size: pageSize,
    records: records.slice(start, start + pageSize),
    facets: {
      owner: facet(records, "owner"),
      repository_owner: facet(records, "repository_owner"),
      ecosystem: facet(records, "ecosystem"),
      publication_status: facet(records, "publication_status"),
      resource_type: facet(records, "resource_type"),
    },
  };
}

export async function getCatalogRepositoryMember(owner: string, repository: string, signal?: AbortSignal) {
  const item = await findMember("repositories", (record) => record.owner === owner && record.name === repository, signal);
  const governance = item.ssot_governed ? { ...((item.ssot_summary as Record<string, unknown> | null) || {}), governed: true, registry_url: item.ssot_registry_url, source_sha256: item.ssot_registry_sha256, schema_version: item.ssot_schema_version, observed_at: item.ssot_observed_at } : {};
  return { ...basicMember(item), governance };
}

export async function getCatalogPackageMember(routeKey: string, signal?: AbortSignal) {
  const item = await findMember("packages", (record) => record.route_key === routeKey || record.id === routeKey, signal);
  return basicMember(item);
}

export async function getCatalogResourceMember(resourceType: string, routeKey: string, signal?: AbortSignal) {
  const item = await findMember("resources", (record) => record.id === routeKey || String(record.canonical_path || "").endsWith(`/${routeKey}`), signal);
  return basicMember(item, String(item.resource_type || resourceType));
}

export async function getCatalogReleaseMember(routeKey: string, _signal?: AbortSignal): Promise<CatalogMember> {
  throw new Error(`releases member response 404: ${routeKey}`);
}

export async function getCatalogTechnologyMember(slug: string, signal?: AbortSignal) {
  const item = await findMember("technologies", (record) => record.slug === slug || record.id === slug, signal);
  return { ...basicMember(item), related_records: [] };
}
