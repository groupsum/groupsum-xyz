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
  return <label className="min-w-[9.5rem] flex-1 sm:flex-none">
    <span className="sr-only">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-9 w-full rounded-lg border border-[var(--color-border-soft)] bg-white px-3 py-2 font-mono text-xs text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent">
      <option value="">{label}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>;
}

export function ExplorerFilterToolbar({ filters, onChange, owners = [], ecosystems = [], publications = [], resourceTypes = [], sortOptions, total }: { filters: ExplorerFilters; onChange: (next: ExplorerFilters) => void; owners?: string[]; ecosystems?: string[]; publications?: string[]; resourceTypes?: string[]; sortOptions: Option[]; total: number }) {
  const update = (patch: Partial<ExplorerFilters>) => onChange({ ...filters, ...patch });
  const active = [filters.owner, filters.ecosystem, filters.publication, filters.resourceType].filter(Boolean);
  return <div className="space-y-3 py-4">
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border-soft)] bg-canvas p-3">
      <label className="relative min-w-[15rem] flex-[2_1_22rem]">
        <span className="sr-only">Search catalog records</span>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        <input value={filters.search} onChange={(event) => update({ search: event.target.value })} placeholder="Search name, summary, owner, or type" className="min-h-9 w-full rounded-lg border border-[var(--color-border-soft)] bg-white py-2 pl-9 pr-8 font-mono text-xs text-ink placeholder:text-[#A3A8A2] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent" />
        {filters.search && <button type="button" onClick={() => update({ search: "" })} className="absolute right-2 top-2 grid h-5 w-5 cursor-pointer place-items-center text-ink-muted hover:text-ink" aria-label="Clear search"><X className="h-3 w-3" /></button>}
      </label>
      <SelectFilter label="All owners" value={filters.owner} options={owners} onChange={(value) => update({ owner: value })} />
      <SelectFilter label="All ecosystems" value={filters.ecosystem} options={ecosystems} onChange={(value) => update({ ecosystem: value })} />
      <SelectFilter label="All publication states" value={filters.publication} options={publications} onChange={(value) => update({ publication: value })} />
      <SelectFilter label="All resource types" value={filters.resourceType} options={resourceTypes} onChange={(value) => update({ resourceType: value })} />
      <label className="relative min-w-[10rem] flex-1 sm:flex-none">
        <ArrowUpDown className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
        <span className="sr-only">Sort records</span>
        <select value={filters.sort} onChange={(event) => update({ sort: event.target.value })} className="min-h-9 w-full rounded-lg border border-[var(--color-border-soft)] bg-white py-2 pl-8 pr-3 font-mono text-xs text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent">
          {sortOptions.map((option) => <option key={option.value} value={option.value}>Sort: {option.label}</option>)}
        </select>
      </label>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border-soft)] pb-2 font-mono text-xs text-ink-muted">
      <span><strong className="text-ink">{total.toLocaleString()}</strong> matching records</span>
      {(filters.search || active.length > 0) && <div className="flex flex-wrap items-center gap-1.5">
        {filters.search && <CatalogPill>Query: {filters.search}</CatalogPill>}
        {active.map((value) => <CatalogPill key={value}>{value}</CatalogPill>)}
        <button type="button" onClick={() => onChange({ ...filters, search: "", owner: "", ecosystem: "", publication: "", resourceType: "" })} className="min-h-7 cursor-pointer px-2 font-semibold text-accent hover:underline">Clear all</button>
      </div>}
    </div>
  </div>;
}

export function TypeBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase().replace(/\s+/g, "_");
  const tones: Record<string, string> = {
    website: "border-sky-200 bg-sky-50 text-sky-800",
    documentation: "border-indigo-200 bg-indigo-50 text-indigo-800",
    api: "border-pink-200 bg-pink-50 text-pink-800",
    api_definition: "border-pink-200 bg-pink-50 text-pink-800",
    api_source: "border-pink-200 bg-pink-50 text-pink-800",
    demo: "border-amber-200 bg-amber-50 text-amber-800",
    example: "border-green-200 bg-green-50 text-green-800",
    showcase: "border-violet-200 bg-violet-50 text-violet-800",
    ui: "border-purple-200 bg-purple-50 text-purple-800",
  };
  return <span className={`inline-flex min-h-5 cursor-default select-none items-center rounded-[3px] border px-1.5 text-[9px] font-mono font-semibold uppercase tracking-wide ${tones[normalized] || "border-[var(--color-border-muted)] bg-white text-ink-muted"}`}>{value}</span>;
}
