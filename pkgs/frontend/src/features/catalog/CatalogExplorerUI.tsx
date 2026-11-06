import React from "react";
import { ArrowUpDown, Search, X } from "lucide-react";
import { CatalogPill } from "./CatalogVisuals";

export type ExplorerFilters = {
  search: string;
  owner: string;
  ecosystem: string;
  publication: string;
  resourceType: string;
  sort: string;
};

type Option = { label: string; value: string };

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  if (!options.length) return null;
  return <label>
    <span className="sr-only">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="type-control w-full rounded-lg border border-[var(--color-border-soft)] bg-surface-raised px-3 py-2 text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent">
      <option value="">{label}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>;
}

export function ExplorerFilterToolbar({ filters, onChange, owners = [], ecosystems = [], publications = [], resourceTypes = [], sortOptions, total, statusDetail = "Filtered projection", statusActions }: { filters: ExplorerFilters; onChange: (next: ExplorerFilters) => void; owners?: string[]; ecosystems?: string[]; publications?: string[]; resourceTypes?: string[]; sortOptions: Option[]; total: number; statusDetail?: string; statusActions?: React.ReactNode }) {
  const update = (patch: Partial<ExplorerFilters>) => onChange({ ...filters, ...patch });
  const active = [filters.owner, filters.ecosystem, filters.publication, filters.resourceType].filter(Boolean);
  return <div className="space-y-3 py-4">
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border-soft)] bg-canvas p-3">
      <label className="relative min-w-[200px] flex-1">
        <span className="sr-only">Search catalog records</span>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        <input value={filters.search} onChange={(event) => update({ search: event.target.value })} placeholder="Search by name, summary, owner, language..." className="type-control w-full rounded-lg border border-[var(--color-border-soft)] bg-surface-raised py-2 pl-9 pr-8 text-ink placeholder:font-normal placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent" />
        {filters.search && <button type="button" onClick={() => update({ search: "" })} className="absolute right-2 top-2 grid h-5 w-5 cursor-pointer place-items-center text-ink-muted hover:text-ink" aria-label="Clear search"><X className="h-3 w-3" /></button>}
      </label>
      <SelectFilter label="All Owners / Orgs" value={filters.owner} options={owners} onChange={(value) => update({ owner: value })} />
      <SelectFilter label="All Ecosystems" value={filters.ecosystem} options={ecosystems} onChange={(value) => update({ ecosystem: value })} />
      <SelectFilter label="All Publication States" value={filters.publication} options={publications} onChange={(value) => update({ publication: value })} />
      <SelectFilter label="All Resource Types" value={filters.resourceType} options={resourceTypes} onChange={(value) => update({ resourceType: value })} />
      <label className="relative ml-auto flex items-center gap-1">
        <ArrowUpDown className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
        <span className="sr-only">Sort records</span>
        <select value={filters.sort} onChange={(event) => update({ sort: event.target.value })} className="type-control rounded-lg border border-[var(--color-border-soft)] bg-surface-raised px-3 py-2 text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent">
          {sortOptions.map((option) => <option key={option.value} value={option.value}>Sort: {option.label}</option>)}
        </select>
      </label>
    </div>
    {(filters.search || active.length > 0) && <div className="type-body-sm flex flex-wrap items-center gap-1.5 pt-1">
        <span className="font-medium text-ink-muted">Active Filters:</span>
        {filters.search && <CatalogPill>Query: {filters.search}</CatalogPill>}
        {active.map((value) => <CatalogPill key={value}>{value}</CatalogPill>)}
        <button type="button" onClick={() => onChange({ ...filters, search: "", owner: "", ecosystem: "", publication: "", resourceType: "" })} className="min-h-7 cursor-pointer px-2 font-semibold text-accent hover:underline">Clear all</button>
      </div>}
    <div className="type-body-sm flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border-soft)] pb-2 text-ink-muted">
      <span>Showing <strong className="text-ink">{total.toLocaleString()}</strong> matching records</span>
      <div className="ml-auto flex items-center gap-2 text-ink-muted"><span aria-live="polite">{statusDetail}</span>{statusActions}</div>
    </div>
  </div>;
}

export function TypeBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase().replace(/\s+/g, "_");
  const tones: Record<string, string> = {
    website: "border-[var(--color-border-soft)] bg-surface text-accent",
    documentation: "border-[var(--color-border-soft)] bg-surface text-accent",
    api: "border-[var(--color-border-soft)] bg-surface text-accent",
    api_definition: "border-[var(--color-border-soft)] bg-surface text-accent",
    api_source: "border-[var(--color-border-soft)] bg-surface text-accent",
    demo: "border-[var(--color-border-soft)] bg-surface text-signal",
    example: "border-[var(--color-border-soft)] bg-surface text-success",
    showcase: "border-[var(--color-border-soft)] bg-surface text-accent",
    ui: "border-[var(--color-border-soft)] bg-surface text-accent",
  };
  return <span className={`type-ui-label inline-flex min-h-5 cursor-default select-none items-center rounded-[3px] border px-1.5 ${tones[normalized] || "border-[var(--color-border-muted)] bg-surface-raised text-ink-muted"}`}>{value}</span>;
}
