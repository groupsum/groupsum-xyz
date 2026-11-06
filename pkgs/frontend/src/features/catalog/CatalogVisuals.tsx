import React from "react";
import { PageTitle, SectionTitle } from "../../components/typography/Typography";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Box,
  Braces,
  Building2,
  CalendarDays,
  CircleDot,
  Code2,
  Download,
  ExternalLink,
  FileCode2,
  GitBranch,
  GitCommitHorizontal,
  GitFork,
  Package,
  Scale,
  Star,
  Users,
} from "lucide-react";

export type CatalogIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const metricIcons: Record<string, CatalogIcon> = {
  stars: Star,
  forks: GitFork,
  watchers: CircleDot,
  contributors: Users,
  commits: GitCommitHorizontal,
  releases: Box,
  release_count: Box,
  dependencies: GitBranch,
  dependency_count: GitBranch,
  dependents: Activity,
  downstream: Activity,
  downstream_count: Activity,
  downloads: Download,
  packages: Package,
  related_resources: Braces,
  repositories: Code2,
  repository_count: Code2,
  observed_bytes: FileCode2,
};

export function compactNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function CatalogPill({ children, tone = "neutral", Icon, compact = false }: { children: React.ReactNode; tone?: "neutral" | "accent" | "signal"; Icon?: CatalogIcon; compact?: boolean }) {
  const tones = {
    neutral: "border-[var(--color-border-muted)] text-ink-muted bg-[var(--color-surface)]",
    accent: "border-[var(--color-border-accent-soft)] text-accent bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface))]",
    signal: "border-[color-mix(in_srgb,var(--color-signal)_28%,transparent)] text-[color-mix(in_srgb,var(--color-signal)_78%,var(--color-ink))] bg-[var(--color-signal-soft)]/35",
  };
  const sizing = compact
    ? "min-h-5 max-w-full gap-1 px-1.5 py-0.5 text-[10px] leading-tight"
    : "min-h-6 gap-1.5 px-2.5 py-1 text-[11px]";
  return <span className={`type-ui-label inline-flex w-fit cursor-default select-none items-center rounded-[3px] border ${sizing} ${tones[tone]}`}>{Icon && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}{children}</span>;
}

export type MetricItem = { label: string; value: number | string; icon?: CatalogIcon; note?: string; tone?: "accent" | "signal"; color?: string };

export function MetricBand({ items, label = "Record summary" }: { items: MetricItem[]; label?: string }) {
  if (!items.length) return null;
  return <dl aria-label={label} className="metric-strip pt-2">
    {items.map((item) => {
      const Icon = item.icon || metricIcons[item.label.toLowerCase().replace(/\s+/g, "_")] || Activity;
      return <div key={item.label} className="flex min-w-0 flex-col justify-between space-y-1">
        <dt className="type-body-sm flex items-center justify-between gap-1.5 text-ink-muted"><span className="truncate">{item.label}</span><Icon className={`h-4 w-4 shrink-0 ${item.color || (item.tone === "signal" ? "text-signal" : "text-accent")}`} aria-hidden="true" /></dt>
        <dd className="type-metric font-bold tracking-tight text-ink">{typeof item.value === "number" ? item.value.toLocaleString() : item.value}</dd>
        {item.note && <dd className="type-body-sm mt-1 text-ink-muted">{item.note}</dd>}
      </div>;
    })}
  </dl>;
}

export function FactPanel({ items, label = "Record facts" }: { items: Array<{ label: string; value: React.ReactNode; icon?: CatalogIcon }>; label?: string }) {
  const visible = items.filter((item) => item.value !== null && item.value !== undefined && item.value !== "");
  if (!visible.length) return null;
  return <dl aria-label={label} className="fact-list sm:grid-cols-2">
    {visible.map((item) => {
      const Icon = item.icon || CircleDot;
      return <div key={item.label} className="min-w-0">
        <dt className="type-ui-label flex items-center gap-1.5 text-ink-muted"><Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />{item.label}</dt>
        <dd className="type-body-md mt-2 break-words font-medium text-ink">{item.value}</dd>
      </div>;
    })}
  </dl>;
}

export function EvidenceRow({ eyebrow, title, description, href, action = "View evidence", onNavigate }: { eyebrow: string; title: string; description?: string; href?: string; action?: string; onNavigate?: (path: string) => void }) {
  const internal = Boolean(href?.startsWith("/"));
  return <li className="group grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
    <div className="min-w-0">
      <span className="type-ui-label text-accent">{eyebrow}</span>
      <p className="type-body-md mt-1 break-words font-semibold text-ink">{title}</p>
      {description && <p className="type-body-sm mt-1 break-words text-ink-muted">{description}</p>}
    </div>
    {href && (internal && onNavigate ? <a href={href} onClick={(event) => { event.preventDefault(); onNavigate(href); }} className="type-control inline-flex min-h-11 items-center gap-1 self-start text-accent hover:underline sm:self-auto">{action}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></a> : <a href={href} target="_blank" rel="noreferrer" className="type-control inline-flex min-h-11 items-center gap-1 self-start text-accent hover:underline sm:self-auto">{action}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>)}
  </li>;
}

export function CollectionHeader({
  eyebrow,
  title,
  description,
  observedAt,
  facts,
  exportHref,
}: {
  eyebrow: string;
  title: string;
  description: string;
  observedAt?: string | null;
  facts: MetricItem[];
  exportHref?: string;
}) {
  const observedLabel = observedAt ? (() => {
    const date = new Date(observedAt);
    return Number.isNaN(date.valueOf()) ? observedAt : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
  })() : null;
  return <header className="space-y-6 border-b border-[var(--color-border-soft)] pb-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-3xl space-y-2">
        <span className="type-ui-label inline-flex items-center gap-2 text-accent"><span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />{eyebrow}</span>
        <PageTitle>{title}</PageTitle>
        <p className="type-body-lg max-w-3xl text-ink-muted">{description}</p>
      </div>
      <div className="flex flex-col items-start space-y-2 md:items-end">
        {observedLabel && <span className="type-technical inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border-soft)] bg-surface px-2.5 py-1 text-ink-muted"><CalendarDays className="h-3.5 w-3.5 text-accent" aria-hidden="true" />Observed: {observedLabel}</span>}
        {exportHref && <a href={exportHref} className="type-control inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[var(--color-border-soft)] bg-surface-raised px-3 py-1.5 text-ink shadow-sm transition-all hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"><Download className="h-3.5 w-3.5 text-accent" aria-hidden="true" />Export JSON Dataset</a>}
      </div>
    </div>
    <MetricBand label={`${title} collection summary`} items={facts} />
  </header>;
}

export function MemberRowCard({
  title,
  summary,
  eyebrow,
  owner,
  route,
  onNavigate,
  Icon = Box,
  pills = [],
  badge,
  facts = [],
}: {
  title: string;
  summary: string;
  eyebrow: string;
  owner: string;
  route: string;
  onNavigate: (path: string) => void;
  Icon?: CatalogIcon;
  pills?: string[];
  badge?: React.ReactNode;
  facts?: Array<{ label: string; value: number }>;
}) {
  return <article className="catalog-density-card group relative flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-4 rounded-xl border border-[var(--color-border-soft)] bg-surface-raised p-5 shadow-sm transition-all duration-200 hover:border-accent-hover hover:bg-canvas">
    <div className="flex min-w-0 flex-[3_1_28rem] items-start gap-3.5">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[var(--color-border-soft)] bg-surface text-accent transition-colors group-hover:bg-surface-raised"><Icon className="h-5 w-5" aria-hidden="true" /></div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="type-heading-sm"><a href={route} onClick={(event) => { event.preventDefault(); onNavigate(route); }} className="break-words transition-colors hover:text-accent-hover before:absolute before:inset-0 before:content-['']">{title}</a></h2>
          {badge || <span className="type-ui-label text-accent">{eyebrow}</span>}
          {pills.map((pill) => <CatalogPill key={pill}>{pill}</CatalogPill>)}
        </div>
        <p className="type-body-sm mt-1 line-clamp-2 text-ink-muted">{summary}</p>
        <span className="type-body-sm mt-2 inline-flex items-center gap-1 text-ink-muted"><Building2 className="h-3 w-3" aria-hidden="true" />{owner}</span>
      </div>
    </div>
    {facts.length > 0 && <dl className="flex min-w-0 flex-[1_1_16rem] flex-wrap gap-x-6 gap-y-3">{facts.map((fact) => <div key={fact.label} className="min-w-[5rem]"><dt className="type-ui-label text-ink-muted">{fact.label}</dt><dd className="type-metric mt-1 font-bold text-ink">{compactNumber(fact.value)}</dd></div>)}</dl>}
    <span className="type-control relative z-[1] inline-flex min-h-9 shrink-0 items-center gap-1 text-accent-hover group-hover:underline">Inspect Member Record<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
  </article>;
}

export function RecordIdentityCard({
  eyebrow,
  title,
  summary,
  Icon = Box,
  pills = [],
  actions,
  facts,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  Icon?: CatalogIcon;
  pills?: Array<{ label: string; tone?: "neutral" | "accent" | "signal" }>;
  actions?: React.ReactNode;
  facts: MetricItem[];
}) {
  return <header className="record-header space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div className="flex min-w-0 flex-[1_1_34rem] items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--radius-md)] border border-[var(--color-border-accent-soft)] bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))] text-accent"><Icon className="h-7 w-7" aria-hidden="true" /></div>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2"><CatalogPill tone="accent">{eyebrow}</CatalogPill>{pills.map((pill) => <CatalogPill key={pill.label} tone={pill.tone}>{pill.label}</CatalogPill>)}</div>
          <PageTitle className="break-words">{title}</PageTitle>
          <p className="type-body-md max-w-4xl text-ink-muted">{summary}</p>
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
    <MetricBand label={`${title} identity summary`} items={facts} />
  </header>;
}

export function SurfaceCard({ title, Icon = CircleDot, children, intro, id }: { title: string; Icon?: CatalogIcon; children: React.ReactNode; intro?: string; id?: string }) {
  return <section id={id} className="document-section scroll-mt-28 space-y-3">
    <div className="space-y-1"><SectionTitle className="flex items-center gap-2"><Icon className="h-4.5 w-4.5 text-accent" aria-hidden="true" />{title}</SectionTitle>{intro && <p className="type-body-sm text-ink-muted">{intro}</p>}</div>
    {children}
  </section>;
}

export function ContextRailCard({ title, Icon = CircleDot, children }: { title: string; Icon?: CatalogIcon; children: React.ReactNode }) {
  return <section className="document-section space-y-3"><h2 className="type-ui-label flex items-center gap-2 text-ink"><Icon className="h-4 w-4 text-accent" aria-hidden="true" />{title}</h2>{children}</section>;
}

export const factIcons = {
  owner: Users,
  branch: GitBranch,
  license: Scale,
  created: CalendarDays,
  updated: Activity,
  status: BadgeCheck,
  ecosystem: Package,
  source: Code2,
};
