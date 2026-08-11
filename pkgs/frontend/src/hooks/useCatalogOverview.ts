import { useQuery } from "@tanstack/react-query";
import { getCatalogOverview } from "../api/catalog";

export function useCatalogOverview() {
  return useQuery({
    queryKey: ["catalog", "overview"],
    queryFn: ({ signal }) => getCatalogOverview(signal),
  });
}
