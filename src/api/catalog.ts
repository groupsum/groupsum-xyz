import type { components } from "./schema.generated";
import { catalogApi } from "./client";

export type CatalogCollection = components["schemas"]["CatalogCollection"];
export type CatalogMember = components["schemas"]["CatalogMember"];
export type RepositorySummary = components["schemas"]["RepositorySummary"];
export type PackageSummary = components["schemas"]["PackageSummary"];
export type TypedResourceSummary = components["schemas"]["TypedResourceSummary"];
export type TechnologySummary = components["schemas"]["TechnologySummary"];

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

export async function listCatalog(dataset: CatalogDataset, query: CatalogQuery, signal?: AbortSignal) {
  const path = `/api/v1/catalog/${dataset}` as const;
  const { data, error, response } = await catalogApi.GET(path, {
    params: { query },
    signal,
  });
  if (error || !data) throw new Error(`Catalog ${dataset} response ${response.status}`);
  return data;
}

export async function getCatalogRepositoryMember(owner: string, repository: string, signal?: AbortSignal) {
  const { data, error, response } = await catalogApi.GET("/api/v1/catalog/repositories/{owner}/{repository}", {
    params: { path: { owner, repository } },
    signal,
  });
  if (error || !data) throw new Error(`Repository member response ${response.status}`);
  return data;
}

export async function getCatalogPackageMember(routeKey: string, signal?: AbortSignal) {
  const { data, error, response } = await catalogApi.GET("/api/v1/catalog/packages/{route_key}", {
    params: { path: { route_key: routeKey } },
    signal,
  });
  if (error || !data) throw new Error(`Package member response ${response.status}`);
  return data;
}

export async function getCatalogResourceMember(routeKey: string, signal?: AbortSignal) {
  const { data, error, response } = await catalogApi.GET("/api/v1/catalog/resources/{route_key}", {
    params: { path: { route_key: routeKey } },
    signal,
  });
  if (error || !data) throw new Error(`Typed resource member response ${response.status}`);
  return data;
}

export async function getCatalogReleaseMember(routeKey: string, signal?: AbortSignal) {
  const { data, error, response } = await catalogApi.GET("/api/v1/catalog/releases/{route_key}", {
    params: { path: { route_key: routeKey } },
    signal,
  });
  if (error || !data) throw new Error(`Release member response ${response.status}`);
  return data;
}

export async function getCatalogTechnologyMember(slug: string, signal?: AbortSignal) {
  const { data, error, response } = await catalogApi.GET("/api/v1/catalog/technologies/{slug}", {
    params: { path: { slug } },
    signal,
  });
  if (error || !data) throw new Error(`Technology member response ${response.status}`);
  return data;
}
