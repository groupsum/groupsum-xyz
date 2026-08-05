import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listCatalog, type CatalogDataset, type CatalogQuery } from "../api/catalog";

export function useCatalogCollection(dataset: CatalogDataset, query: CatalogQuery) {
  return useQuery({
    queryKey: ["catalog", dataset, query],
    queryFn: ({ signal }) => listCatalog(dataset, query, signal),
    placeholderData: keepPreviousData,
  });
}
