import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listCatalog, type CatalogDataset, type CatalogQuery, type CatalogCollection } from "../api/catalog";
import { useCatalogVersion } from "../api/catalog-version";

export function useCatalogCollection(dataset: CatalogDataset, query: CatalogQuery) {
  const version = useCatalogVersion();
  const snapshot = globalThis.__GROUPSUM_API_SNAPSHOT__ as (CatalogCollection & { static_path?: string; static_snapshot_id?: string }) | undefined;
  const initial = snapshot?.static_path === `/catalog/${dataset}` && version.snapshot_id === snapshot.static_snapshot_id && query.page === 1 && query.page_size === snapshot.page_size && !query.q && !query.owner && !query.ecosystem && !query.publication_status && !query.resource_type && !query.repository && (!query.sort || query.sort === "recent") ? snapshot : undefined;
  return useQuery({
    queryKey: ["catalog", dataset, query, version.snapshot_id],
    queryFn: ({ signal }) => listCatalog(dataset, query, signal),
    placeholderData: keepPreviousData,
    initialData: initial,
  });
}
