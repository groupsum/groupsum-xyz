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
