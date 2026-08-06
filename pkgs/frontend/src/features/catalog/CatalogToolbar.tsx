import React from "react";
import { Search, SlidersHorizontal, Rows3, Grid2X2, X } from "lucide-react";
import { CatalogView, PortfolioEntity } from "../../types";

interface Props { query: string; setQuery: (value: string) => void; view: CatalogView; setView: (value: CatalogView) => void; filters: Record<string, string>; update: (key: string, value: string) => void; clear: () => void; entities: PortfolioEntity[]; mobileFiltersOpen: boolean; setMobileFiltersOpen: (value: boolean) => void; }

export const CatalogToolbar: React.FC<Props> = ({ query, setQuery, view, setView, filters, update, clear, entities, mobileFiltersOpen, setMobileFiltersOpen }) => {
  const kinds = [...new Set(entities.map((entity) => entity.kind))].sort();
  const maturities = [...new Set(entities.map((entity) => entity.maturity))].sort();
  const capabilities = [...new Set(entities.flatMap((entity) => entity.capabilityIds))].sort();
  const hasFilters = query || Object.values(filters).some((value) => value !== "all");
  return <div className="sticky top-16 z-20 space-y-3 py-4 bg-canvas/95 backdrop-blur-sm border-b border-[var(--color-border-soft)]">
    <div className="flex flex-col sm:flex-row gap-2">
      <label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" /><span className="sr-only">Search catalog</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, projects, packages..." className="w-full pl-10 pr-3 py-2.5 text-sm bg-surface border border-[var(--color-border-soft)] rounded-[var(--radius-sm)] text-ink focus:outline-none focus:border-accent" /></label>
      <button type="button" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="sm:hidden inline-flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-wider text-ink-muted bg-surface border border-[var(--color-border-soft)] rounded-[var(--radius-sm)]"><SlidersHorizontal className="w-4 h-4" /> Filters</button>
      <div className="hidden sm:flex items-center gap-1 p-1 bg-surface border border-[var(--color-border-soft)] rounded-[var(--radius-sm)]"><button type="button" aria-pressed={view === "rows"} onClick={() => setView("rows")} className={`p-2 rounded ${view === "rows" ? "bg-accent text-white" : "text-ink-muted"}`}><Rows3 className="w-4 h-4" /></button><button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")} className={`p-2 rounded ${view === "cards" ? "bg-accent text-white" : "text-ink-muted"}`}><Grid2X2 className="w-4 h-4" /></button></div>
    </div>
    <div className={`${mobileFiltersOpen ? "grid" : "hidden"} sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2`}>
      <select value={filters.organization} onChange={(event) => update("organization", event.target.value)} aria-label="Organization" className="px-2.5 py-2 text-xs font-mono bg-surface border border-[var(--color-border-soft)] rounded"><option value="all">All organizations</option><option value="groupsum">Groupsum</option><option value="tigrbl">Tigrbl</option><option value="swarmauri">Swarmauri</option></select>
      <select value={filters.capability} onChange={(event) => update("capability", event.target.value)} aria-label="Capability" className="px-2.5 py-2 text-xs font-mono bg-surface border border-[var(--color-border-soft)] rounded"><option value="all">All capabilities</option>{capabilities.map((value) => <option key={value} value={value}>{value}</option>)}</select>
      <select value={filters.kind} onChange={(event) => update("kind", event.target.value)} aria-label="Entity type" className="px-2.5 py-2 text-xs font-mono bg-surface border border-[var(--color-border-soft)] rounded"><option value="all">All entity types</option>{kinds.map((value) => <option key={value} value={value}>{value}</option>)}</select>
      <select value={filters.maturity} onChange={(event) => update("maturity", event.target.value)} aria-label="Maturity" className="px-2.5 py-2 text-xs font-mono bg-surface border border-[var(--color-border-soft)] rounded"><option value="all">All maturity</option>{maturities.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    </div>
    <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted"><span aria-live="polite">{entities.length} catalog records · {hasFilters ? "filtered" : "all records"}</span>{hasFilters && <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-accent hover:underline">Clear <X className="w-3 h-3" /></button>}</div>
  </div>;
};
