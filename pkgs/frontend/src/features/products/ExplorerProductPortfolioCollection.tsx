import React, { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Box,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Download,
  GitBranch,
  Layers,
  Package,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

export type ExplorerCollectionRecord = {
  id: string;
  slug: string;
  recordType: "product" | "portfolio";
  kind: string;
  title: string;
  summary: string;
  maturity: string;
  organization: string;
  audience: string[];
  technologies: string[];
  featured: boolean;
  repositoryCount: number;
  packageCount: number;
  resourceCount: number;
};

type Navigate = (route: string) => void;
type Mode = "products" | "portfolio";

const organizationNames: Record<string, string> = {
  groupsum: "GroupSum",
  tigrbl: "Tigrbl",
  swarmauri: "Swarmauri",
};

function formatObserved(value?: string | null): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

function maturityBadge(value: string) {
  const normalized = value.toLowerCase();
  const palette = {
    production: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    released: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    maintained: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    usable: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    active: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    "active-development": "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    beta: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    experimental: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    exploratory: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    concept: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    deprecated: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    archived: "border-[var(--color-border-soft)] bg-surface text-ink-muted",
    "observed-public": "border-[var(--color-border-soft)] bg-surface text-ink-muted",
  }[normalized] || "border-[var(--color-border-soft)] bg-surface text-ink-muted";
  const label = value.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return <span className={`inline-flex items-center gap-1 rounded-[3px] border px-2 py-0.5 font-mono text-[10px] font-semibold leading-4 ${palette}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {label}
  </span>;
}

function SummaryHeader({ mode, records, observedAt }: { mode: Mode; records: ExplorerCollectionRecord[]; observedAt?: string | null }) {
  const isProducts = mode === "products";
  const facts = isProducts
    ? [
        { label: "Products", value: records.length, icon: <Box className="h-4 w-4 text-ink-muted" /> },
        { label: "Reviewed records", value: records.filter((record) => !record.maturity.includes("observed-public")).length, icon: <CheckCircle2 className="h-4 w-4 text-ink-muted" /> },
        { label: "Total repositories", value: records.reduce((total, record) => total + record.repositoryCount, 0), icon: <Layers className="h-4 w-4 text-ink-muted" /> },
        { label: "Contained packages", value: records.reduce((total, record) => total + record.packageCount, 0), icon: <ShieldCheck className="h-4 w-4 text-ink-muted" /> },
      ]
    : [
        { label: "Portfolio records", value: records.length, icon: <Layers className="h-4 w-4 text-ink-muted" /> },
        { label: "Organizations", value: new Set(records.map((record) => record.organization)).size, icon: <Building2 className="h-4 w-4 text-ink-muted" /> },
        { label: "Repositories", value: records.reduce((total, record) => total + record.repositoryCount, 0), icon: <GitBranch className="h-4 w-4 text-ink-muted" /> },
        { label: "Packages", value: records.reduce((total, record) => total + record.packageCount, 0), icon: <Package className="h-4 w-4 text-ink-muted" /> },
      ];
  return <div className="space-y-6 border-b border-[var(--color-border-soft)] pb-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center space-x-2 font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
          <span className="h-2 w-2 rounded-full bg-surface" />
          <span>{isProducts ? "Primary Product Evaluation Collection" : "Primary Portfolio Evaluation Collection"}</span>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink-muted sm:text-4xl">
          {isProducts ? "GroupSum Products" : "GroupSum Portfolios"}
        </h1>
        <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
          {isProducts
            ? "Public software products reviewed for purpose, target audience, maturity, capabilities, and underlying implementation evidence."
            : "Strategic groupings of products, infrastructure capabilities, and governance domain areas."}
        </p>
      </div>
      <div className="flex flex-col items-start space-y-2 font-mono text-xs md:items-end">
        <div className="inline-flex items-center space-x-1.5 rounded-md border border-[var(--color-border-soft)] bg-surface px-2.5 py-1 text-ink-muted">
          <Calendar className="h-3.5 w-3.5" />
          <span>Observed: {formatObserved(observedAt)}</span>
        </div>
        <a href="/catalog/catalog.json" className="inline-flex min-h-9 items-center space-x-1.5 rounded-lg border border-[var(--color-border-soft)] bg-surface-raised px-3 py-1.5 font-medium text-ink-muted shadow-sm transition-all hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent">
          <Download className="h-3.5 w-3.5 text-ink-muted" />
          <span>Export JSON Dataset</span>
        </a>
      </div>
    </div>
    <div className="metric-strip pt-2">
      {facts.map((fact) => <div key={fact.label} className="flex flex-col justify-between space-y-1">
        <div className="flex items-center justify-between font-mono text-xs text-ink-muted"><span className="truncate">{fact.label}</span>{fact.icon}</div>
        <div className="font-mono text-xl font-bold tabular-nums tracking-tight text-ink-muted">{fact.value.toLocaleString()}</div>
      </div>)}
    </div>
  </div>;
}

export function ExplorerProductPortfolioCollection({ mode, records, observedAt, organization, onNavigate }: {
  mode: Mode;
  records: ExplorerCollectionRecord[];
  observedAt?: string | null;
  organization?: string;
  onNavigate: Navigate;
}) {
  const [search, setSearch] = useState("");
  const [owner, setOwner] = useState(organization || "");
  const [maturity, setMaturity] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const owners = useMemo(() => [...new Set(records.map((record) => record.organization))].sort(), [records]);
  const maturities = useMemo(() => [...new Set(records.map((record) => record.maturity))].sort(), [records]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records
      .filter((record) => !owner || record.organization === owner)
      .filter((record) => !maturity || record.maturity === maturity)
      .filter((record) => !query || [record.title, record.summary, record.organization, ...record.audience].join(" ").toLowerCase().includes(query))
      .sort((left, right) => sortBy === "activity"
        ? right.repositoryCount + right.packageCount - left.repositoryCount - left.packageCount
        : sortBy === "recent"
          ? Number(right.featured) - Number(left.featured) || left.title.localeCompare(right.title)
          : left.title.localeCompare(right.title));
  }, [maturity, owner, records, search, sortBy]);
  const hasFilters = Boolean(search || (!organization && owner) || maturity);
  return <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <SummaryHeader mode={mode} records={records} observedAt={observedAt} />
    <div className="space-y-3 py-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border-soft)] bg-surface p-3">
        <label className="relative min-w-[200px] flex-1">
          <span className="sr-only">Search collection</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input type="search" placeholder="Search by name, summary, owner, language..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-lg border border-[var(--color-border-soft)] bg-surface-raised py-2 pl-9 pr-8 font-mono text-xs text-ink-muted placeholder-[#A3A8A2] focus:outline-none focus:ring-2 focus:ring-accent" />
          {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-muted"><X className="h-3.5 w-3.5" /></button>}
        </label>
        {!organization && <select aria-label="Filter by owner or organization" value={owner} onChange={(event) => setOwner(event.target.value)} className="min-h-9 rounded-lg border border-[var(--color-border-soft)] bg-surface-raised px-3 py-2 font-mono text-xs text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="">All Owners / Orgs</option>{owners.map((value) => <option key={value} value={value}>{organizationNames[value] || value}</option>)}
        </select>}
        <select aria-label="Filter by maturity" value={maturity} onChange={(event) => setMaturity(event.target.value)} className="min-h-9 rounded-lg border border-[var(--color-border-soft)] bg-surface-raised px-3 py-2 font-mono text-xs text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="">All Maturity States</option>{maturities.map((value) => <option key={value} value={value}>{value.replace(/[-_]+/g, " ")}</option>)}
        </select>
        <div className="ml-auto flex items-center space-x-1"><ArrowUpDown className="h-3.5 w-3.5 text-ink-muted" /><select aria-label="Sort collection" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-h-9 rounded-lg border border-[var(--color-border-soft)] bg-surface-raised px-3 py-2 font-mono text-xs text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"><option value="name">Sort: Name (A-Z)</option><option value="activity">Sort: Most Activity</option><option value="recent">Sort: Featured First</option></select></div>
      </div>
      {hasFilters && <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs"><span className="font-medium text-ink-muted">Active Filters:</span>{search && <span className="rounded-full border border-[var(--color-border-soft)] bg-surface-raised px-2.5 py-1 text-ink-muted">Query: <strong>{search}</strong></span>}{owner && !organization && <span className="rounded-full border border-[var(--color-border-soft)] bg-surface-raised px-2.5 py-1 text-ink-muted">Owner: <strong>{organizationNames[owner] || owner}</strong></span>}{maturity && <span className="rounded-full border border-[var(--color-border-soft)] bg-surface-raised px-2.5 py-1 text-ink-muted">Maturity: <strong>{maturity}</strong></span>}<button type="button" onClick={() => { setSearch(""); if (!organization) setOwner(""); setMaturity(""); }} className="ml-2 font-semibold text-ink-muted hover:underline">Clear all</button></div>}
      <div className="flex justify-between border-b border-[var(--color-border-soft)]/60 pb-2 font-mono text-xs text-ink-muted"><span>Showing <strong className="font-bold text-ink-muted">{filtered.length}</strong> matching records</span><span className="hidden text-ink-muted sm:inline">Filtered projection</span></div>
    </div>
    <div className="space-y-3">
      {filtered.map((record) => {
        const route = record.recordType === "portfolio" ? `/portfolio/records/${record.slug}` : `/products/records/${record.slug}`;
        const visibleTechnologies = record.technologies.slice(0, 3);
        return <div key={record.id} role="link" tabIndex={0} onClick={() => onNavigate(route)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onNavigate(route); } }} className="product-portfolio-card catalog-density-card group flex cursor-pointer flex-col justify-between gap-4 rounded-xl border border-[var(--color-border-soft)] bg-surface-raised p-5 shadow-sm transition-all duration-200 hover:border-[var(--color-border-soft)] hover:bg-surface md:flex-row md:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-3"><div className="shrink-0 rounded-[3px] border border-[var(--color-border-soft)] bg-surface p-2 transition-colors group-hover:bg-surface-raised">{record.recordType === "portfolio" ? <Layers className="h-4 w-4 text-ink-muted" /> : <Box className="h-4 w-4 text-ink-muted" />}</div><div className="min-w-0 flex-1 space-y-1"><div className="flex flex-wrap items-center gap-2"><span className="truncate font-serif text-base font-bold text-ink-muted transition-colors group-hover:text-ink-muted">{record.title}</span>{maturityBadge(record.maturity)}</div><p className="line-clamp-2 text-xs leading-5 text-ink-muted md:line-clamp-1">{record.summary}</p><div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-ink-muted"><span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /><span>{organizationNames[record.organization] || record.organization}</span></span><span className="text-ink-muted">•</span><span className="inline-flex items-center gap-1 font-medium text-ink-muted"><Cpu className="h-3 w-3" />{visibleTechnologies.length ? visibleTechnologies.join(" · ") : "Tech not reported"}</span><span className="text-ink-muted">•</span><span className="inline-flex items-center gap-1 text-ink-muted"><GitBranch className="h-3 w-3" />{record.repositoryCount} repos</span><span className="text-ink-muted">•</span><span className="font-semibold text-ink-muted">{record.packageCount} packages</span></div></div></div>
          <div className="flex shrink-0 items-center justify-end border-t border-[var(--color-border-soft)]/60 pt-2 md:border-t-0 md:pt-0"><span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-ink-muted group-hover:underline">Inspect Member Record<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span></div>
        </div>;
      })}
      {filtered.length === 0 && <div className="rounded-xl border border-[var(--color-border-soft)] bg-surface-raised p-8 text-center font-mono text-xs text-ink-muted">No records match the active filter criteria. Try adjusting search terms or clearing filters.</div>}
    </div>
  </div>;
}
