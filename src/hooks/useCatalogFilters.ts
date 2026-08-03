import { useMemo, useState } from "react";
import { useSearchParams } from "../router";
import { CatalogView, PortfolioEntity } from "../types";

export function useCatalogFilters(entities: PortfolioEntity[]) {
  const [params, setParams] = useSearchParams();
  const [query, setQueryState] = useState(params.get("query") || "");
  const [view, setViewState] = useState<CatalogView>((params.get("view") as CatalogView) === "cards" ? "cards" : "rows");
  const filters = {
    organization: params.get("organization") || "all",
    capability: params.get("capability") || "all",
    kind: params.get("kind") || "all",
    maturity: params.get("maturity") || "all",
    evidence: params.get("evidence") || "all",
  };
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  };
  const setQuery = (value: string) => { setQueryState(value); update("query", value); };
  const setView = (value: CatalogView) => { setViewState(value); update("view", value); };
  const clear = () => { setQueryState(""); setViewState("rows"); setParams({}, { replace: true }); };
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entities.filter((entity) => {
      const searchable = `${entity.displayName} ${entity.summary} ${entity.sourceName} ${entity.technologies.join(" ")}`.toLowerCase();
      return (!q || searchable.includes(q)) &&
        (filters.organization === "all" || entity.organization === filters.organization) &&
        (filters.capability === "all" || entity.capabilityIds.includes(filters.capability)) &&
        (filters.kind === "all" || entity.kind === filters.kind) &&
        (filters.maturity === "all" || entity.maturity === filters.maturity) &&
        (filters.evidence === "all" || entity.evidence.some((item) => item.kind === filters.evidence));
    });
  }, [entities, query, filters.organization, filters.capability, filters.kind, filters.maturity, filters.evidence]);
  return { query, setQuery, view, setView, filters, update, clear, filtered };
}
