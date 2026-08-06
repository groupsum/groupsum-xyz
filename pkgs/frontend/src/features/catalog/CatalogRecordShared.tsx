import React, { useEffect, useMemo, useState } from "react";
import {
  catalogDatasetManifest,
  catalogOrganizations,
  catalogSummary,
} from "../../data/catalog.generated";
import { EntityGraph, getCatalogOverview, getRepositoryMetricSnapshot, RepositoryMetricRecord, type RepositorySignals } from "../../api/catalog.generated";
import { getCatalogPackageMember, getCatalogReleaseMember, getCatalogRepositoryMember, getCatalogResourceMember, getCatalogTechnologyMember } from "../../api/catalog";
import { Activity, ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Boxes, Braces, CalendarDays, Code2, ExternalLink, FileCode2, GitBranch, Globe2, Package, Scale, ServerCog, ShieldCheck } from "lucide-react";
import { RepositorySignalStrip } from "./RepositorySignals";
import { EntityOwnership } from "./EntityIdentity";
import { CatalogPill, CollectionHeader, ContextRailCard, FactPanel, MemberRowCard, RecordIdentityCard, SurfaceCard, factIcons, MetricBand, metricIcons, type MetricItem } from "./CatalogVisuals";
import { ExplorerFilterToolbar, TypeBadge, type ExplorerFilters } from "./CatalogExplorerUI";
import { useCatalogCollection } from "../../hooks/useCatalogCollection";
import type { CatalogViewRecord } from "../../types/catalog-view";

export type CatalogRecord = CatalogViewRecord;

export const datasetOrder = ["repositories", "packages", "resources", "technologies"] as const;
export type DatasetName = (typeof datasetOrder)[number];
export type DetailDatasetName = DatasetName | "releases";

export const labels: Record<DatasetName, string> = {
  repositories: "Repositories",
  packages: "Packages",
  resources: "Typed resources",
  technologies: "Technologies",
};

export const datasetDetails: Record<DatasetName, { description: string; Icon: typeof Code2 }> = {
  repositories: { description: "Source repositories with repository-owned activity, packages, governance, and typed resources.", Icon: Code2 },
  packages: { description: "Manifest and registry-backed packages grouped independently from their containing repositories.", Icon: Package },
  resources: { description: "Public resources classified by one canonical type and connected through observed relationships.", Icon: Braces },
  technologies: { description: "Categorical stack evidence observed from public source and package metadata.", Icon: ServerCog },
};

export function recordTitle(record: CatalogRecord): string {
  return String(record.display_name || record.full_name || record.title || record.name || record.id);
}

export function recordDescription(record: CatalogRecord): string {
  if (record.description) return String(record.description);
  if (record.repository) return `Observed in ${String(record.repository)}.`;
  return "Public catalog record derived from linked sources and inventory observations.";
}

export function formatDate(value?: string): string {
  if (!value) return "not recorded";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : `${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(date)} UTC`;
}

export function recordMetrics(record: CatalogRecord): Array<[string, number]> {
  if (record.metrics) return Object.entries(record.metrics).filter(([key]) => key !== "relationships").slice(0, 8);
  if (record.kind === "package") return [
    ["releases", Number(record.release_count || 0)],
    ["dependencies", Number(record.dependency_count || 0)],
    ["downstream", Number(record.downstream_count || 0)],
  ];
  if (record.kind === "technology") return [["repositories", Number(record.repository_count || 0)]];
  return [];
}

export function metricItems(record: CatalogRecord, limit = 8): MetricItem[] {
  return recordMetrics(record).slice(0, limit).map(([key, value]) => ({
    label: humanLabel(key),
    value,
    icon: metricIcons[key],
  }));
}

export function resourceIcon(type: string) {
  if (type.startsWith("documentation.")) return BookOpen;
  if (type === "interface.website" || type === "documentation.site") return Globe2;
  if (type.startsWith("governance.")) return ShieldCheck;
  if (type.startsWith("distribution.")) return Package;
  if (type.startsWith("source.")) return Code2;
  if (type.includes("api")) return ServerCog;
  if (type.startsWith("implementation.")) return Braces;
  if (type.startsWith("interface.")) return Boxes;
  return FileCode2;
}

export function valueRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function valueStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function valueRecords(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];
}

export function repositorySignals(record: CatalogRecord): RepositorySignals {
  const metrics = valueRecord(record.metrics);
  const history = valueRecord(record.history);
  const metric = (key: string) => Number(metrics[key] || 0);
  const points = (key: string) => valueRecords(history[key]).map((point) => ({ observed_at: String(point.observed_at || ""), value: Number(point.value || 0) }));
  return {
    repository_count: 1,
    metrics: { stars: metric("stars"), forks: metric("forks"), watchers: metric("watchers"), contributors: metric("contributors"), commits: metric("commits") },
    history: { stars: points("stars"), forks: points("forks"), watchers: points("watchers"), contributors: points("contributors") },
    commit_activity: valueRecords(record.commit_activity).map((point) => ({ date: String(point.date || ""), count: Number(point.count || 0) })),
    observed_at: record.observed_at,
  };
}

export function humanLabel(value: string): string {
  return value.replace(/[._]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function isCurrentPageLink(value: unknown): boolean {
  if (!value || typeof window === "undefined") return false;
  try {
    const candidate = new URL(String(value), window.location.origin);
    const clean = (path: string) => path.replace(/\/+$/, "") || "/";
    return clean(candidate.pathname) === clean(window.location.pathname);
  } catch {
    return false;
  }
}

export type TimelinePoint = { month: string; count: number };

export function monthlyReleaseActivity(releases: Array<Record<string, unknown>>): TimelinePoint[] {
  const counts = new Map<string, number>();
  for (const release of releases) {
    const publishedAt = String(release.published_at || "");
    if (!/^\d{4}-\d{2}/.test(publishedAt)) continue;
    const month = publishedAt.slice(0, 7);
    counts.set(month, (counts.get(month) || 0) + 1);
  }
  return [...counts.entries()].sort(([left], [right]) => left.localeCompare(right)).slice(-24).map(([month, count]) => ({ month, count }));
}

export function ReleaseTimeline({ points, label }: { points: TimelinePoint[]; label: string }) {
  if (!points.length) return <p className="text-sm text-ink-muted">No dated releases were observed for this timeline.</p>;
  const max = Math.max(...points.map((point) => point.count), 1);
  return <figure aria-label={label} className="space-y-3">
    <div className="flex h-28 items-end gap-1.5" aria-hidden="true">
      {points.map((point) => <div key={point.month} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1"><span className="text-[9px] font-mono tabular-nums text-ink-muted opacity-0 group-hover:opacity-100">{point.count}</span><span className="w-full min-w-1 rounded-t-sm bg-accent" style={{ height: `${Math.max(8, (point.count / max) * 88)}px` }} /></div>)}
    </div>
    <figcaption className="flex flex-wrap justify-between gap-2 text-[10px] font-mono text-ink-muted"><span>{points[0].month}</span><span>{points.reduce((total, point) => total + point.count, 0).toLocaleString()} dated releases</span><span>{points.at(-1)?.month}</span></figcaption>
  </figure>;
}

export function DetailRows({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  const visible = rows.filter(([, value]) => value !== null && value !== undefined && value !== "");
  if (!visible.length) return null;
  return (
    <dl className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">
      {visible.map(([label, value]) => (
        <div key={label} className="py-3 sm:py-4 sm:flex sm:items-baseline sm:gap-8">
          <dt className="text-[10px] font-mono uppercase tracking-wide text-ink-muted sm:w-44 sm:shrink-0">{label}</dt>
          <dd className="text-sm text-ink mt-1 sm:mt-0 min-w-0 break-words">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailSection({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  const sectionId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const Icon = title.includes("Package") || title.includes("Depend") ? Package : title.includes("SSOT") ? ShieldCheck : title.includes("License") ? Scale : title.includes("Resource") ? Braces : title.includes("activity") || title.includes("events") ? Activity : FileCode2;
  return <SurfaceCard id={sectionId} title={title} intro={intro} Icon={Icon}>{children}</SurfaceCard>;
}

export function LegalContext({ record, detail = false }: { record: CatalogRecord; detail?: boolean }) {
  const legal = valueRecords(record.legal_observations);
  const licenseFile = legal.find((item) => item.kind === "license-file" && item.url);
  const noticeFile = legal.find((item) => item.kind === "notice-file" && item.url);
  return <div className="space-y-3 pt-2">
    <div><h3 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wide text-ink"><Scale className="h-4 w-4 text-accent" aria-hidden="true" />License and notices</h3><p className="mt-1 text-xs text-ink-muted">Legal metadata is scoped to this record and reported from observed files or registry fields; it is not legal advice.</p></div>
    <DetailRows rows={[
      ["License", String(record.license_expression || record.license || "Not observed")],
      ["Observation status", humanLabel(String(record.license_status || (legal.length ? "observed" : "not observed")))],
      ["License file", licenseFile ? <a href={String(licenseFile.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{String(licenseFile.path || licenseFile.name || "View license")}</a> : null],
      ["Notice file", noticeFile ? <a href={String(noticeFile.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{String(noticeFile.path || noticeFile.name || "View notice")}</a> : null],
    ]} />
    {detail && legal.length > 0 && <ul className="divide-y divide-[var(--color-border-soft)]">{legal.map((item, index) => <li key={`${String(item.kind)}-${String(item.path || item.expression || item.url)}-${index}`} className="py-3 sm:flex sm:justify-between gap-4"><div><span className="text-[10px] font-mono uppercase text-accent">{humanLabel(String(item.kind || "legal evidence"))} · {humanLabel(String(item.scope || "direct"))}</span><p className="text-sm text-ink">{String(item.name || item.path || "License or notice")}</p>{item.expression && <p className="text-xs text-ink-muted mt-1">{String(item.expression)}</p>}</div>{item.url && <a href={String(item.url)} target="_blank" rel="noreferrer" className="shrink-0 text-xs font-mono text-accent hover:underline">View evidence</a>}</li>)}</ul>}
  </div>;
}

const ssotCountOrder = ["adrs", "specs", "features", "tests", "claims", "evidence", "issues", "boundaries", "profiles", "releases"];

export function SsotGovernanceSection({ governance }: { governance: Record<string, unknown> }) {
  const counts = valueRecord(governance.counts);
  const coverage = valueRecord(governance.coverage);
  const registryUrl = String(governance.registry_url || "");
  return <DetailSection title="SSOT governance" intro="Repository-scoped counts and linkage coverage reported by the canonical .ssot/registry.json.">
    <div className="flex flex-wrap items-center gap-2"><CatalogPill tone="accent" Icon={BadgeCheck}>SSOT governed</CatalogPill><CatalogPill>Schema {String(governance.schema_version || "not reported")}</CatalogPill><CatalogPill>Observed {formatDate(governance.observed_at as string | undefined)}</CatalogPill></div>
    <DetailRows rows={[
      ["Registry", registryUrl ? <a href={registryUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">View canonical registry</a> : "Not available"],
      ["Schema version", String(governance.schema_version || "Not recorded")],
      ["Observed", formatDate(governance.observed_at as string | undefined)],
      ["Source digest", governance.source_sha256 ? <code className="font-mono text-xs">{String(governance.source_sha256).slice(0, 16)}…</code> : "Not recorded"],
    ]} />
    <MetricBand label="SSOT registry inventory" items={ssotCountOrder.map((key) => ({ label: humanLabel(key), value: Number(counts[key] || 0), icon: key === "tests" ? BadgeCheck : key === "releases" ? metricIcons.releases : FileCode2 }))} />
    <div>
      <h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Claim and evidence linkage</h3>
      <MetricBand label="Claim and evidence linkage" items={Object.entries(coverage).map(([key, value]) => ({ label: humanLabel(key), value: Number(value || 0), icon: GitBranch }))} />
    </div>
    <p className="text-xs text-ink-muted border-l-2 border-[var(--color-border-muted)] pl-3">{String(governance.limitation || "Registry presence and reported linkage do not independently validate every public product claim.")}</p>
  </DetailSection>;
}
