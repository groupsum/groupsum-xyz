import React from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Box,
  Braces,
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

export function CatalogPill({ children, tone = "neutral", Icon }: { children: React.ReactNode; tone?: "neutral" | "accent" | "signal"; Icon?: CatalogIcon }) {
  const tones = {
    neutral: "border-[var(--color-border-muted)] text-ink-muted bg-[var(--color-surface)]",
    accent: "border-[var(--color-border-accent-soft)] text-accent bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface))]",
    signal: "border-[color-mix(in_srgb,var(--color-signal)_28%,transparent)] text-[color-mix(in_srgb,var(--color-signal)_78%,var(--color-ink))] bg-[var(--color-signal-soft)]/35",
  };
  return <span className={`inline-flex min-h-6 cursor-default select-none items-center gap-1.5 rounded-[3px] border px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wide ${tones[tone]}`}>{Icon && <Icon className="h-3 w-3" aria-hidden="true" />}{children}</span>;
}

export type MetricItem = { label: string; value: number | string; icon?: CatalogIcon; note?: string; tone?: "accent" | "signal"; color?: string };

export function MetricBand({ items, label = "Record summary" }: { items: MetricItem[]; label?: string }) {
  if (!items.length) return null;
  return <dl aria-label={label} className="grid grid-cols-2 gap-x-5 gap-y-3 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface-raised)] p-3 sm:grid-cols-3 lg:grid-cols-4">
    {items.map((item) => {
      const Icon = item.icon || metricIcons[item.label.toLowerCase().replace(/\s+/g, "_")] || Activity;
      return <div key={item.label} className="min-w-0">
        <dt className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wide text-ink-muted"><Icon className={`h-3.5 w-3.5 ${item.color || (item.tone === "signal" ? "text-signal" : "text-accent")}`} aria-hidden="true" />{item.label}</dt>
        <dd className="mt-1 font-serif text-xl font-bold tabular-nums text-ink">{typeof item.value === "number" ? compactNumber(item.value) : item.value}</dd>
        {item.note && <dd className="mt-1 text-[10px] leading-snug text-ink-muted">{item.note}</dd>}
      </div>;
    })}
  </dl>;
}

export function FactPanel({ items, label = "Record facts" }: { items: Array<{ label: string; value: React.ReactNode; icon?: CatalogIcon }>; label?: string }) {
  const visible = items.filter((item) => item.value !== null && item.value !== undefined && item.value !== "");
  if (!visible.length) return null;
  return <dl aria-label={label} className="grid gap-x-8 gap-y-5 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface-raised)] p-4 sm:grid-cols-2 sm:p-5">
    {visible.map((item) => {
      const Icon = item.icon || CircleDot;
      return <div key={item.label} className="min-w-0">
        <dt className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wide text-ink-muted"><Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />{item.label}</dt>
        <dd className="mt-2 break-words text-sm font-medium text-ink">{item.value}</dd>
      </div>;
    })}
  </dl>;
}

export function EvidenceRow({ eyebrow, title, description, href, action = "View evidence", onNavigate }: { eyebrow: string; title: string; description?: string; href?: string; action?: string; onNavigate?: (path: string) => void }) {
  const internal = Boolean(href?.startsWith("/"));
  return <li className="group grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
    <div className="min-w-0">
      <span className="text-[10px] font-mono font-semibold uppercase tracking-wide text-accent">{eyebrow}</span>
      <p className="mt-1 break-words text-sm font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 break-words text-xs leading-relaxed text-ink-muted">{description}</p>}
    </div>
    {href && (internal && onNavigate ? <a href={href} onClick={(event) => { event.preventDefault(); onNavigate(href); }} className="inline-flex min-h-11 items-center gap-1 self-start text-xs font-mono font-semibold text-accent hover:underline sm:self-auto">{action}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></a> : <a href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 self-start text-xs font-mono font-semibold text-accent hover:underline sm:self-auto">{action}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>)}
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
  return <header className="space-y-4 border-b border-[var(--color-border-soft)] pb-5">
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-3xl space-y-2">
        <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-accent"><span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />{eyebrow}</span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="max-w-3xl text-xs leading-relaxed text-ink-muted sm:text-sm">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
        {observedLabel && <span className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 text-ink-muted"><CalendarDays className="h-3.5 w-3.5 text-accent" aria-hidden="true" />Observed {observedLabel}</span>}
        {exportHref && <a href={exportHref} className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border-muted)] bg-[var(--color-surface-raised)] px-3 font-semibold text-ink hover:border-accent hover:text-accent"><Download className="h-3.5 w-3.5" aria-hidden="true" />Export dataset</a>}
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
  return <article className="group relative flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-2.5 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-3 transition-colors hover:border-accent hover:bg-[color-mix(in_srgb,var(--color-accent)_3%,var(--color-surface))]">
    <div className="flex min-w-0 flex-[3_1_28rem] items-start gap-3.5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[3px] border border-[var(--color-border-soft)] bg-canvas text-accent"><Icon className="h-4.5 w-4.5" aria-hidden="true" /></div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">{badge || <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-accent">{eyebrow}</span>}{pills.map((pill) => <CatalogPill key={pill}>{pill}</CatalogPill>)}</div>
        <h2 className="mt-0.5 font-serif text-[17px] font-bold leading-tight text-ink"><a href={route} onClick={(event) => { event.preventDefault(); onNavigate(route); }} className="break-words hover:text-accent before:absolute before:inset-0 before:content-['']">{title}</a></h2>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-ink-muted">{summary}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-ink-muted"><Users className="h-3 w-3" aria-hidden="true" />{owner}</span>
      </div>
    </div>
    {facts.length > 0 && <dl className="flex min-w-0 flex-[1_1_16rem] flex-wrap gap-x-6 gap-y-3">{facts.map((fact) => <div key={fact.label} className="min-w-[5rem]"><dt className="text-[9px] font-mono uppercase tracking-wide text-ink-muted">{fact.label}</dt><dd className="mt-1 font-serif text-lg font-bold tabular-nums text-ink">{compactNumber(fact.value)}</dd></div>)}</dl>}
    <span className="relative z-[1] inline-flex min-h-9 shrink-0 items-center gap-1 text-[10px] font-mono font-semibold text-accent">Inspect member record<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
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
  return <header className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div className="flex min-w-0 flex-[1_1_34rem] items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--radius-md)] border border-[var(--color-border-accent-soft)] bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))] text-accent"><Icon className="h-7 w-7" aria-hidden="true" /></div>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2"><CatalogPill tone="accent">{eyebrow}</CatalogPill>{pills.map((pill) => <CatalogPill key={pill.label} tone={pill.tone}>{pill.label}</CatalogPill>)}</div>
          <h1 className="break-words font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="max-w-4xl text-xs leading-relaxed text-ink-muted sm:text-sm">{summary}</p>
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
    <MetricBand label={`${title} identity summary`} items={facts} />
  </header>;
}

export function SurfaceCard({ title, Icon = CircleDot, children, intro, id }: { title: string; Icon?: CatalogIcon; children: React.ReactNode; intro?: string; id?: string }) {
  return <section id={id} className="scroll-mt-28 space-y-3 rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-4 sm:p-5">
    <div className="space-y-1"><h2 className="flex items-center gap-2 font-serif text-xl font-bold text-ink"><Icon className="h-4.5 w-4.5 text-accent" aria-hidden="true" />{title}</h2>{intro && <p className="text-[11px] leading-relaxed text-ink-muted sm:text-xs">{intro}</p>}</div>
    {children}
  </section>;
}

export function ContextRailCard({ title, Icon = CircleDot, children }: { title: string; Icon?: CatalogIcon; children: React.ReactNode }) {
  return <section className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5"><h2 className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-ink"><Icon className="h-4 w-4 text-accent" aria-hidden="true" />{title}</h2>{children}</section>;
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
