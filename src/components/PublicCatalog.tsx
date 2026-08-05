import React, { useEffect, useMemo, useState } from "react";
import {
  catalogDatasetManifest,
  catalogOrganizations,
  catalogSummary,
} from "../data/catalog.generated";
import { EntityGraph, getCatalogCollection, getCatalogOverview, getCatalogRepository, getCatalogTechnology, getEntityPageModel, getRepositoryMetricSnapshot, RepositoryMetricRecord, type RepositorySignals } from "../api/catalog.generated";
import { Activity, ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Boxes, Braces, CalendarDays, Code2, ExternalLink, FileCode2, Filter, GitBranch, Globe2, Package, Scale, Search, ServerCog, ShieldCheck } from "lucide-react";
import { RepositorySignalStrip } from "./RepositorySignals";
import { EntityOwnership } from "./EntityIdentity";
import { CatalogPill, CollectionHeader, ContextRailCard, FactPanel, MemberRowCard, RecordIdentityCard, SurfaceCard, factIcons, MetricBand, metricIcons, type MetricItem } from "./CatalogVisuals";

type CatalogRecord = Record<string, unknown> & {
  id: string;
  kind?: string;
  name?: string;
  display_name?: string;
  full_name?: string;
  title?: string;
  description?: string;
  route?: string;
  url?: string;
  registry_url?: string;
  observed_at?: string;
  claim_boundary?: string;
  metrics?: Record<string, number>;
  evidence?: Array<{ kind?: string; url?: string; observed_at?: string }>;
  legal_evidence?: Array<Record<string, unknown>>;
  ssot_governance?: Record<string, unknown>;
  entity_graph?: EntityGraph | null;
};

const datasetOrder = ["repositories", "packages", "resources", "technologies"] as const;
type DatasetName = (typeof datasetOrder)[number];
type DetailDatasetName = DatasetName | "releases";

const labels: Record<DatasetName, string> = {
  repositories: "Repositories",
  packages: "Packages",
  resources: "APIs, demos & examples",
  technologies: "Technologies",
};

const datasetDetails: Record<DatasetName, { description: string; Icon: typeof Code2 }> = {
  repositories: { description: "Source repositories with repository-owned activity, packages, governance, and typed resources.", Icon: Code2 },
  packages: { description: "Manifest and registry-backed packages grouped independently from their containing repositories.", Icon: Package },
  resources: { description: "Typed documentation, APIs, demos, examples, websites, showcases, and user interfaces.", Icon: Braces },
  technologies: { description: "Categorical stack evidence observed from public source and package metadata.", Icon: ServerCog },
};

function recordTitle(record: CatalogRecord): string {
  return String(record.display_name || record.full_name || record.title || record.name || record.id);
}

function recordDescription(record: CatalogRecord): string {
  if (record.description) return String(record.description);
  if (record.repository) return `Observed in ${String(record.repository)}.`;
  return "Public catalog record derived from the linked source evidence.";
}

function formatDate(value?: string): string {
  if (!value) return "not recorded";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : `${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(date)} UTC`;
}

function recordMetrics(record: CatalogRecord): Array<[string, number]> {
  if (record.metrics) return Object.entries(record.metrics).filter(([key]) => key !== "relationships").slice(0, 8);
  if (record.kind === "package") return [
    ["releases", Number(record.release_count || 0)],
    ["dependencies", Number(record.dependency_count || 0)],
    ["downstream", Number(record.downstream_count || 0)],
  ];
  if (record.kind === "technology") return [["repositories", Number(record.repository_count || 0)]];
  return [];
}

function metricItems(record: CatalogRecord, limit = 8): MetricItem[] {
  return recordMetrics(record).slice(0, limit).map(([key, value]) => ({
    label: humanLabel(key),
    value,
    icon: metricIcons[key],
  }));
}

function resourceIcon(type: string) {
  if (type === "documentation") return BookOpen;
  if (type === "website") return Globe2;
  if (type.includes("api")) return ServerCog;
  if (type === "example" || type === "demo" || type === "showcase") return Braces;
  if (type === "ui") return Boxes;
  return FileCode2;
}

function valueRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function valueStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function valueRecords(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];
}

function repositorySignals(record: CatalogRecord): RepositorySignals {
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

function humanLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isCurrentPageLink(value: unknown): boolean {
  if (!value || typeof window === "undefined") return false;
  try {
    const candidate = new URL(String(value), window.location.origin);
    const clean = (path: string) => path.replace(/\/+$/, "") || "/";
    return clean(candidate.pathname) === clean(window.location.pathname);
  } catch {
    return false;
  }
}

type TimelinePoint = { month: string; count: number };

function monthlyReleaseActivity(releases: Array<Record<string, unknown>>): TimelinePoint[] {
  const counts = new Map<string, number>();
  for (const release of releases) {
    const publishedAt = String(release.published_at || "");
    if (!/^\d{4}-\d{2}/.test(publishedAt)) continue;
    const month = publishedAt.slice(0, 7);
    counts.set(month, (counts.get(month) || 0) + 1);
  }
  return [...counts.entries()].sort(([left], [right]) => left.localeCompare(right)).slice(-24).map(([month, count]) => ({ month, count }));
}

function ReleaseTimeline({ points, label }: { points: TimelinePoint[]; label: string }) {
  if (!points.length) return <p className="text-sm text-ink-muted">No dated releases were observed for this timeline.</p>;
  const max = Math.max(...points.map((point) => point.count), 1);
  return <figure aria-label={label} className="space-y-3">
    <div className="flex h-28 items-end gap-1.5" aria-hidden="true">
      {points.map((point) => <div key={point.month} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1"><span className="text-[9px] font-mono tabular-nums text-ink-muted opacity-0 group-hover:opacity-100">{point.count}</span><span className="w-full min-w-1 rounded-t-sm bg-accent" style={{ height: `${Math.max(8, (point.count / max) * 88)}px` }} /></div>)}
    </div>
    <figcaption className="flex flex-wrap justify-between gap-2 text-[10px] font-mono text-ink-muted"><span>{points[0].month}</span><span>{points.reduce((total, point) => total + point.count, 0).toLocaleString()} dated releases</span><span>{points.at(-1)?.month}</span></figcaption>
  </figure>;
}

function DetailRows({ rows }: { rows: Array<[string, React.ReactNode]> }) {
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

function DetailSection({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  const sectionId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const Icon = title.includes("Package") || title.includes("Depend") ? Package : title.includes("SSOT") ? ShieldCheck : title.includes("License") ? Scale : title.includes("Resource") ? Braces : title.includes("activity") || title.includes("events") ? Activity : FileCode2;
  return <SurfaceCard id={sectionId} title={title} intro={intro} Icon={Icon}>{children}</SurfaceCard>;
}

function LegalContext({ record, detail = false }: { record: CatalogRecord; detail?: boolean }) {
  const legal = valueRecords(record.legal_evidence);
  const licenseFile = legal.find((item) => item.kind === "license-file" && item.url);
  const noticeFile = legal.find((item) => item.kind === "notice-file" && item.url);
  return <div className="space-y-3 pt-2">
    <div><h3 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wide text-ink"><Scale className="h-4 w-4 text-accent" aria-hidden="true" />License and notices</h3><p className="mt-1 text-xs text-ink-muted">Legal metadata is scoped to this record and reported as evidence, not legal advice.</p></div>
    <DetailRows rows={[
      ["License", String(record.license_expression || record.license || "Not observed")],
      ["Evidence status", humanLabel(String(record.license_status || (legal.length ? "observed" : "not observed")))],
      ["License file", licenseFile ? <a href={String(licenseFile.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{String(licenseFile.path || licenseFile.name || "View license")}</a> : null],
      ["Notice file", noticeFile ? <a href={String(noticeFile.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{String(noticeFile.path || noticeFile.name || "View notice")}</a> : null],
    ]} />
    {detail && legal.length > 0 && <ul className="divide-y divide-[var(--color-border-soft)]">{legal.map((item, index) => <li key={`${String(item.kind)}-${String(item.path || item.expression || item.url)}-${index}`} className="py-3 sm:flex sm:justify-between gap-4"><div><span className="text-[10px] font-mono uppercase text-accent">{humanLabel(String(item.kind || "legal evidence"))} · {humanLabel(String(item.scope || "direct"))}</span><p className="text-sm text-ink">{String(item.name || item.path || "License or notice")}</p>{item.expression && <p className="text-xs text-ink-muted mt-1">{String(item.expression)}</p>}</div>{item.url && <a href={String(item.url)} target="_blank" rel="noreferrer" className="shrink-0 text-xs font-mono text-accent hover:underline">View evidence</a>}</li>)}</ul>}
  </div>;
}

const ssotCountOrder = ["adrs", "specs", "features", "tests", "claims", "evidence", "issues", "boundaries", "profiles", "releases"];

function SsotGovernanceSection({ governance }: { governance: Record<string, unknown> }) {
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

function RepositoryDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const commit = valueRecord(record.latest_commit);
  const release = valueRecord(record.latest_release);
  const deployment = valueRecord(record.latest_deployment);
  const resources = valueRecords(record.related_resources);
  const packages = valueRecords(record.packages);
  const githubReleases = valueRecords(record.github_releases);
  const packageReleasePoints = new Map<string, number>();
  for (const pkg of packages) for (const point of valueRecords(pkg.release_activity)) {
    const month = String(point.month || "");
    if (month) packageReleasePoints.set(month, (packageReleasePoints.get(month) || 0) + Number(point.count || 0));
  }
  for (const point of monthlyReleaseActivity(githubReleases)) packageReleasePoints.set(point.month, (packageReleasePoints.get(point.month) || 0) + point.count);
  const repositoryReleaseTimeline = [...packageReleasePoints.entries()].sort(([left], [right]) => left.localeCompare(right)).slice(-24).map(([month, count]) => ({ month, count }));
  const packageReleaseCount = packages.reduce((total, pkg) => total + Number(pkg.release_count || 0), 0);
  return (
    <>
      <DetailSection title="Repository overview">
        <FactPanel items={[
          { label: "Repository owner", icon: factIcons.owner, value: String(record.owner || "Not recorded") },
          { label: "Visibility", icon: factIcons.status, value: humanLabel(String(record.visibility || "not recorded")) },
          { label: "Default branch", icon: factIcons.branch, value: String(record.default_branch || "Not recorded") },
          { label: "License", icon: Scale, value: String(record.license || "Not declared") },
          { label: "Created", icon: CalendarDays, value: formatDate(record.created_at as string | undefined) },
          { label: "Last pushed", icon: Activity, value: formatDate(record.pushed_at as string | undefined) },
        ]} />
        <LegalContext record={record} />
      </DetailSection>
      <DetailSection title="Observed activity" intro="Repository-owned counts and persisted activity. A single observation is never presented as a trend.">
        <RepositorySignalStrip signals={repositorySignals(record)} />
        <MetricBand label="Additional repository metrics" items={Object.entries(valueRecord(record.metrics)).filter(([key]) => !["stars", "forks", "watchers", "contributors", "commits", "relationships"].includes(key)).map(([key, value]) => ({ label: humanLabel(key), value: Number(value || 0), icon: metricIcons[key] }))} />
      </DetailSection>
      <DetailSection title="Release activity" intro="Repository analytics aggregate its GitHub releases and the registry releases owned by contained packages. Individual package histories remain on their package records.">
        <MetricBand label="Repository release summary" items={[
          { label: "Package releases", value: packageReleaseCount, icon: metricIcons.releases },
          { label: "GitHub releases", value: githubReleases.length, icon: metricIcons.releases },
          { label: "Packages", value: packages.length, icon: Package },
          { label: "Published packages", value: packages.filter((pkg) => pkg.published).length, icon: BadgeCheck },
        ]} />
        <ReleaseTimeline points={repositoryReleaseTimeline} label="Monthly releases across this repository and its packages" />
      </DetailSection>
      {record.ssot_governance && Boolean(record.ssot_governance.governed) && <SsotGovernanceSection governance={record.ssot_governance} />}
      <DetailSection title="Latest observed events">
        <DetailRows rows={[
          ["Commit", commit.message ? <span>{String(commit.message)}{commit.url && <> · <a href={String(commit.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View commit</a></>}</span> : "No commit observed"],
          ["Commit date", formatDate(commit.committed_at as string | undefined)],
          ["Release", release.tag ? <span>{String(release.name || release.tag)}{release.url && <> · <a href={String(release.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View release</a></>}</span> : "No GitHub release observed"],
          ["Release date", formatDate(release.published_at as string | undefined)],
          ["Deployment", deployment.environment ? `${String(deployment.environment)} · ${humanLabel(String(deployment.state || "state not recorded"))}` : "No deployment observed"],
          ["Deployment update", deployment.updated_at ? formatDate(String(deployment.updated_at)) : null],
          ["Deployment evidence", deployment.log_url ? <a href={String(deployment.log_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View deployment log</a> : null],
        ]} />
      </DetailSection>
      <DetailSection title="Contained packages" intro="Every package is a child resource owned by this repository. Its license belongs with the package rather than the repository-level legal summary.">
        {packages.length > 0 ? <ul className="divide-y divide-[var(--color-border-soft)]">{packages.map((pkg) => <li key={String(pkg.id)} className="py-4 sm:flex sm:items-center sm:justify-between gap-5"><div className="min-w-0"><span className="text-[10px] font-mono uppercase text-accent">{humanLabel(String(pkg.ecosystem || "package"))} · {humanLabel(String(pkg.package_kind || "package candidate"))}</span><p className="break-all text-sm font-semibold text-ink">{String(pkg.name)}</p><p className="text-xs text-ink-muted">{String(pkg.manifest_path || "Manifest path not recorded")}</p><p className="mt-1 text-xs text-ink-muted">License: {pkg.license_url ? <a href={String(pkg.license_url)} target="_blank" rel="noreferrer" className="font-semibold text-accent hover:underline">{String(pkg.license_expression || "Observed license")}</a> : String(pkg.license_expression || "Not observed")}{Number(pkg.notice_count || 0) > 0 ? ` · ${Number(pkg.notice_count).toLocaleString()} notice file${Number(pkg.notice_count) === 1 ? "" : "s"}` : ""}</p></div><div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-0"><span className="text-[10px] font-mono text-ink-muted"><strong className="block text-sm text-ink">{Number(pkg.release_count || 0).toLocaleString()}</strong>releases</span><span className="text-[10px] font-mono text-ink-muted"><strong className="block text-sm text-ink">{String(pkg.latest_version || "—")}</strong>latest</span><a href={String(pkg.route)} onClick={(event) => { event.preventDefault(); onNavigate(String(pkg.route)); }} className="inline-flex min-h-11 items-center text-xs font-mono font-semibold text-accent hover:underline">View package</a></div></li>)}</ul> : <p className="text-sm text-ink-muted">No package manifests were observed in this repository.</p>}
      </DetailSection>
      {resources.length > 0 && <DetailSection title="Related resources" intro="Source-backed APIs, demos, documentation, examples, showcases, UIs, and websites attached to this repository.">
        <ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">
          {resources.map((resource) => <li key={String(resource.id)} className="py-3 sm:flex sm:items-baseline sm:justify-between gap-5"><div><span className="text-[10px] font-mono uppercase text-accent">{humanLabel(String(resource.kind || "resource"))}</span><p className="text-sm text-ink break-all">{String(resource.name || "Related resource")}</p></div><div className="flex gap-3">{resource.route && <a href={String(resource.route)} onClick={(event) => { event.preventDefault(); onNavigate(String(resource.route)); }} className="inline-flex min-h-11 items-center text-xs font-mono text-accent hover:underline">View details</a>}{resource.url && <a href={String(resource.url)} target="_blank" rel="noreferrer" className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1">Source <ExternalLink className="w-3.5 h-3.5" /></a>}</div></li>)}
        </ul>
      </DetailSection>}
    </>
  );
}

function DependencyTable({ records, direction }: { records: Array<Record<string, unknown>>; direction: "dependency" | "dependent" }) {
  if (!records.length) return <p className="text-sm text-ink-muted">No {direction === "dependency" ? "dependencies" : "dependents"} were reported by the available source.</p>;
  return <ul className="divide-y divide-[var(--color-border-soft)] rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface-raised)]">
    {records.slice(0, 100).map((item, index) => <li key={String(item.id || item.package_key || `${direction}-${index}`)} className="flex flex-wrap gap-x-5 gap-y-3 px-4 py-4">
      <dl className="flex flex-[1_1_40rem] flex-wrap gap-x-5 gap-y-3">
        <div className="min-w-0 flex-[2_1_14rem]"><dt className="text-[9px] font-mono uppercase tracking-wide text-ink-muted">Package</dt><dd className="mt-1 break-words text-xs font-semibold text-ink">{String(item.name || item.source_name || item.target_id || item.source_id || "Unknown package")}</dd></div>
        <div className="min-w-0 flex-[1_1_8rem]"><dt className="text-[9px] font-mono uppercase tracking-wide text-ink-muted">Ecosystem</dt><dd className="mt-1 text-xs text-ink-muted">{humanLabel(String(item.ecosystem || item.source_ecosystem || "not reported"))}</dd></div>
        <div className="min-w-0 flex-[1_1_8rem]"><dt className="text-[9px] font-mono uppercase tracking-wide text-ink-muted">Scope</dt><dd className="mt-1 break-words text-xs text-ink-muted">{humanLabel(String(item.scope || item.source_kind || "not reported"))}</dd></div>
        <div className="min-w-0 flex-[1_1_12rem]"><dt className="text-[9px] font-mono uppercase tracking-wide text-ink-muted">Requirement / coverage</dt><dd className="mt-1 break-words font-mono text-xs text-ink-muted">{String(item.requirement || item.completeness || "Not reported")}</dd></div>
      </dl>
    </li>)}
  </ul>;
}

function PackageDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const registryLink = record.registry_url ? <a href={String(record.registry_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{String(record.registry_url)}</a> : "Not confirmed";
  const sourceLink = record.source_url ? <a href={String(record.source_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View manifest</a> : "Not recorded";
  const repositories = valueRecords(record.repositories);
  const technologies = valueStrings(record.technologies);
  const releases = valueRecords(record.releases);
  const datedReleases = releases.filter((release) => release.published_at);
  const prereleaseCount = releases.filter((release) => release.prerelease || /(?:dev|alpha|beta|rc)/i.test(String(release.version || ""))).length;
  const downloadTotal = releases.reduce((total, release) => total + Number(release.downloads || 0), 0);
  return (
    <>
      <DetailSection title="Package overview">
        <div className="flex flex-wrap gap-2"><CatalogPill tone="accent" Icon={Package}>{humanLabel(String(record.ecosystem || "unknown"))}</CatalogPill><CatalogPill Icon={Boxes}>{humanLabel(String(record.package_kind || "package candidate"))}</CatalogPill><CatalogPill tone={record.publication_status === "published" ? "accent" : "neutral"} Icon={BadgeCheck}>{humanLabel(String(record.publication_status || "not confirmed"))}</CatalogPill></div>
        {technologies.length > 0 && <div><h3 className="mb-2 text-[10px] font-mono font-semibold uppercase tracking-wide text-ink-muted">Tech stack</h3><ul className="flex flex-wrap gap-2" aria-label="Package technology stack">{technologies.map((technology) => <li key={technology}><CatalogPill Icon={FileCode2}>{technology}</CatalogPill></li>)}</ul></div>}
        <MetricBand label="Package summary" items={[
          { label: "Releases", value: Number(record.release_count || 0), icon: metricIcons.releases },
          { label: "Dependencies", value: Number(record.dependency_count || 0), icon: metricIcons.dependencies },
          { label: "Dependents", value: Number(record.downstream_count || record.dependent_count || 0), icon: metricIcons.dependents },
          { label: "Downloads", value: typeof record.downloads === "number" ? record.downloads : "Not reported", icon: metricIcons.downloads },
        ]} />
        <DetailRows rows={[
          ["Owner", String(record.owner || "Not recorded")],
          ["Ecosystem", humanLabel(String(record.ecosystem || "unknown"))],
          ["Package kind", humanLabel(String(record.package_kind || "package candidate"))],
          ["Repository", repositories.length > 0 ? repositories.map((repository, index) => <React.Fragment key={String(repository.id)}>{index > 0 ? ", " : ""}<button onClick={() => onNavigate(`/catalog/repositories/${String(repository.owner)}/${String(repository.name)}`)} className="cursor-pointer text-accent hover:underline">{String(repository.owner)}/{String(repository.name)}</button>{repository.path ? <span className="text-ink-muted"> · {String(repository.path)}</span> : null}</React.Fragment>) : String(record.repository || "Not linked")],
          ["Publication", humanLabel(String(record.publication_status || "not confirmed"))],
          ["Latest version", String(record.latest_version || "Not recorded")],
          ["Declared version", String(record.version_declared || "Not recorded")],
          ["Registry", registryLink],
          ["Manifest", sourceLink],
        ]} />
        <LegalContext record={record} detail />
      </DetailSection>
      <DetailSection title="Dependencies" intro="Requirements declared by this package, grouped at package scope.">
        <DependencyTable records={valueRecords(record.dependencies)} direction="dependency" />
      </DetailSection>
      <DetailSection title="Dependents" intro={`Observed downstream package records. Coverage: ${humanLabel(String(record.downstream_completeness || "not observed"))}.`}>
        <DependencyTable records={valueRecords(record.dependents)} direction="dependent" />
      </DetailSection>
      <DetailSection title="Release history" intro="This package member shows its own registry timeline and individual releases in detail; repository-wide aggregation remains on the parent repository.">
        <MetricBand label="Package release statistics" items={[
          { label: "Total releases", value: releases.length, icon: metricIcons.releases },
          { label: "Dated releases", value: datedReleases.length, icon: CalendarDays },
          { label: "Pre-releases", value: prereleaseCount, icon: Activity },
          { label: "Downloads", value: downloadTotal || (typeof record.downloads === "number" ? record.downloads : "Not reported"), icon: metricIcons.downloads },
        ]} />
        <ReleaseTimeline points={monthlyReleaseActivity(releases)} label={`Monthly release history for ${recordTitle(record)}`} />
        {releases.length > 0 ? <ol className="divide-y divide-[var(--color-border-soft)]" aria-label="Package releases">{releases.map((release) => <li key={String(release.id)} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-mono uppercase text-accent">{humanLabel(String(release.release_kind || "release"))}</span>{release.prerelease && <CatalogPill>Prerelease</CatalogPill>}{release.draft && <CatalogPill>Draft</CatalogPill>}</div><h3 className="mt-1 break-all font-serif text-lg font-bold text-ink">{String(release.version || "Unversioned release")}</h3><p className="mt-1 text-xs text-ink-muted">Published {formatDate(release.published_at as string | undefined)} · observed {formatDate(release.observed_at as string | undefined)}{typeof release.downloads === "number" ? ` · ${Number(release.downloads).toLocaleString()} downloads` : ""}</p></div><div className="flex flex-wrap items-center gap-3">{release.route && <a href={String(release.route)} onClick={(event) => { event.preventDefault(); onNavigate(String(release.route)); }} className="inline-flex min-h-11 items-center text-xs font-mono font-semibold text-accent hover:underline">Release record</a>}{release.url && <a href={String(release.url)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-xs font-mono text-accent hover:underline">Registry source <ExternalLink className="h-3.5 w-3.5" /></a>}</div></li>)}</ol> : <p className="text-sm text-ink-muted">No release records were reported by the package registry.</p>}
      </DetailSection>
    </>
  );
}

function ResourceDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const ResourceIcon = resourceIcon(String(record.resource_type || "resource"));
  return <>
    <DetailSection title={`${humanLabel(String(record.resource_type || "resource"))} overview`} intro="This is a typed implementation-evidence resource attached to its parent repository or product.">
      <div className="flex flex-wrap gap-2"><CatalogPill tone="accent" Icon={ResourceIcon}>{humanLabel(String(record.resource_type || "resource"))}</CatalogPill><CatalogPill Icon={Code2}>Source-backed</CatalogPill></div>
      <FactPanel items={[
        { label: "Resource type", icon: ResourceIcon, value: humanLabel(String(record.resource_type || "resource")) },
        { label: "Repository path", icon: FileCode2, value: String(record.path || "Not recorded") },
        { label: "Evidence type", icon: BadgeCheck, value: humanLabel(String(record.evidence_type || "source")) },
        { label: "Observed", icon: CalendarDays, value: formatDate(record.observed_at) },
      ]} />
      <DetailRows rows={[["Resource type", humanLabel(String(record.resource_type || "resource"))], ["Repository", record.repository_route ? <button onClick={() => onNavigate(String(record.repository_route))} className="text-accent hover:underline cursor-pointer">{String(record.repository || "View repository")}</button> : String(record.repository || "Not linked")], ["Repository path", String(record.path || "Not recorded")], ["Evidence type", humanLabel(String(record.evidence_type || "source"))]]} />
      <LegalContext record={record} detail />
    </DetailSection>
  </>;
}

function ReleaseDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const parent = valueRecord(record.parent);
  return <>
    <DetailSection title="Release evidence" intro="Version, publication, download, and status fields are registry- or GitHub-observed facts.">
      <DetailRows rows={[["Release kind", humanLabel(String(record.release_kind || record.resource_type || "release"))], ["Version", String(record.version || "Not recorded")], ["Published", formatDate(record.published_at as string | undefined)], ["Downloads", typeof record.downloads === "number" ? record.downloads.toLocaleString() : "Not reported"], ["Prerelease", record.prerelease ? "Yes" : "No"], ["Draft", record.draft ? "Yes" : "No"]]} />
      {parent.route_key && <button onClick={() => onNavigate(`/catalog/packages/${String(parent.ecosystem)}/${String(parent.route_key)}`)} className="text-xs font-mono text-accent hover:underline cursor-pointer">View parent package</button>}
      <LegalContext record={record} detail />
    </DetailSection>
  </>;
}

function TechnologyDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const repositories = valueStrings(record.repositories);
  const relatedRecords = valueRecords(record.related_records);
  if (relatedRecords.length > 0 || record.category) return <>
    <DetailSection title="Technology classification" intro="Categorical stack metadata is maintained independently from general programming-language observations.">
      <DetailRows rows={[["Category", humanLabel(String(record.category || "technology"))], ["Connected records", relatedRecords.length.toLocaleString()]]} />
    </DetailSection>
    <DetailSection title="Connected product and portfolio records">
      {relatedRecords.length > 0 ? <ul className="divide-y divide-[var(--color-border-soft)] border-y border-[var(--color-border-soft)]">{relatedRecords.map((related) => <li key={String(related.id)} className="py-3"><button type="button" onClick={() => onNavigate(String(related.canonical_url || `/${String(related.record_type)}s/records/${String(related.slug)}`))} className="text-left text-sm font-semibold text-accent hover:underline">{String(related.title || related.slug)}</button></li>)}</ul> : <p className="text-sm text-ink-muted">No public product or portfolio records currently carry this categorical tag.</p>}
    </DetailSection>
  </>;
  return (
    <>
      <DetailSection title="Technology usage" intro="Usage is derived from GitHub language observations, not marketing descriptions.">
        <DetailRows rows={[
          ["Repositories", Number(record.repository_count || 0).toLocaleString()],
          ["Observed bytes", Number(record.bytes || 0).toLocaleString()],
        ]} />
      </DetailSection>
      <DetailSection title="Observed repositories">
        {repositories.length > 0 ? <ul className="divide-y divide-[var(--color-border-soft)] border-y border-[var(--color-border-soft)]">
          {repositories.map((repository) => <li key={repository} className="py-3"><a href={`https://github.com/${repository}`} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline inline-flex items-center gap-1">{repository}<ExternalLink className="w-3.5 h-3.5" /></a></li>)}
        </ul> : <p className="text-sm text-ink-muted">No repositories were observed.</p>}
      </DetailSection>
    </>
  );
}

export function CatalogSnapshotBand({
  onNavigate,
  owner,
  title = "Generated public ecosystem",
}: {
  onNavigate: (path: string) => void;
  owner?: string;
  title?: string;
}) {
  const organization = catalogOrganizations.find((item) => item.login === owner);
  const [repositories, setRepositories] = useState<RepositoryMetricRecord[]>([]);
  const [metricState, setMetricState] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    const controller = new AbortController();
    setMetricState("loading");
    getRepositoryMetricSnapshot("", controller.signal)
      .then((snapshot) => {
        const scoped = owner
          ? snapshot.repositories.filter((repository) => repository.owner === owner)
          : snapshot.repositories;
        setRepositories(scoped.slice(0, 4));
        setMetricState("ready");
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setMetricState("error");
      });
    return () => controller.abort();
  }, [owner]);
  const metrics = organization
    ? [
        ["Repositories", organization.repository_count],
        ["Package records", organization.package_count],
        ["Commits", organization.commits],
        ["Contributors", organization.contributors],
      ]
    : [
        ["Repositories", catalogSummary.repositories],
        ["Package records", catalogSummary.packages],
        ["Release records", catalogDatasetManifest.source_counts.releases],
        ["Typed resources", catalogDatasetManifest.counts.resources],
      ];

  return (
    <section className="border-y border-[var(--color-border-soft)] bg-[var(--color-surface)]">
      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-9 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent font-bold">Observed data · {formatDate(catalogSummary.generated_at)}</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">{title}</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              {organization?.description || "Public records compiled from GitHub, repository manifests, PyPI, npm, crates.io, and GitHub Packages. Releases and deployments are summarized on their repository or package records; live availability remains a separate evidence state."}
            </p>
          </div>
          <button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer">
            Explore complete catalog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map(([label, value]) => (
            <div key={String(label)} className="p-4 bg-canvas border border-[var(--color-border-soft)] rounded-[var(--radius-sm)]">
              <strong className="font-serif text-xl text-ink block">{Number(value).toLocaleString()}</strong>
              <span className="text-[10px] font-mono uppercase tracking-wide text-ink-muted">{label}</span>
            </div>
          ))}
        </div>
        <div className="min-h-[67rem] sm:min-h-[33rem] lg:min-h-[16rem]">
          {metricState === "loading" && <div className="min-h-[67rem] sm:min-h-[33rem] lg:min-h-[16rem] border-y border-[var(--color-border-soft)] py-8 text-sm text-ink-muted" role="status">Loading persisted repository activity…</div>}
          {metricState === "error" && <div className="min-h-[67rem] sm:min-h-[33rem] lg:min-h-[16rem] border-y border-[var(--color-border-soft)] py-6 text-sm text-ink-muted" role="alert">Persisted repository activity is temporarily unavailable.</div>}
          {repositories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {repositories.map((repository) => (
                <button key={repository.id} onClick={() => onNavigate(repository.route)} className="min-h-[16rem] text-left p-4 bg-canvas border border-[var(--color-border-soft)] rounded-[var(--radius-sm)] hover:border-accent transition-colors cursor-pointer space-y-3">
                  <div><span className="text-[10px] font-mono uppercase text-accent">{repository.owner}</span>
                  <h3 className="text-sm font-semibold text-ink mt-1">{repository.name}</h3>
                  <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2 mt-1">{repository.description}</p>
                  </div>
                  <RepositorySignalStrip signals={{ ...repository, repository_count: 1 }} compact />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CollectionRow({ record, dataset, onNavigate }: { record: CatalogRecord; dataset: DatasetName; onNavigate: (path: string) => void }) {
  const type = String(record.resource_type || record.kind || dataset.slice(0, -1));
  const Icon = dataset === "resources" ? resourceIcon(type) : datasetDetails[dataset].Icon;
  const metrics = metricItems(record, 3);
  const route = String(record.route || "");
  const context = dataset === "repositories" ? String(record.owner || "Owner not recorded") : dataset === "packages" ? humanLabel(String(record.ecosystem || "Unknown ecosystem")) : dataset === "technologies" ? "Observed stack evidence" : String(record.repository || "Repository not linked");
  const technologies = dataset === "packages" ? valueStrings(record.technologies) : [];
  return <MemberRowCard
    title={recordTitle(record)}
    summary={recordDescription(record)}
    eyebrow={humanLabel(type)}
    owner={context}
    route={route}
    onNavigate={onNavigate}
    Icon={Icon}
    pills={[
      ...(record.kind === "repository" && Boolean(record.ssot_governance && valueRecord(record.ssot_governance).governed) ? ["SSOT governed"] : []),
      ...technologies.slice(0, 5),
    ]}
    facts={metrics.filter((item): item is MetricItem & { value: number } => typeof item.value === "number").map((item) => ({ label: item.label, value: item.value }))}
  />;
}

export function PublicCatalogOverview({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [counts, setCounts] = useState<Record<DatasetName, number>>(() => Object.fromEntries(datasetOrder.map((name) => [name, Number(catalogDatasetManifest.counts[name] || 0)])) as Record<DatasetName, number>);
  useEffect(() => {
    const controller = new AbortController();
    getCatalogOverview(controller.signal).then((model) => setCounts(Object.fromEntries(datasetOrder.map((name) => [name, Number(model.counts[name] || 0)])) as Record<DatasetName, number>)).catch(() => undefined);
    return () => controller.abort();
  }, []);
  return <section className="mx-auto max-w-[var(--content-max)] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
    <CollectionHeader
      eyebrow="Catalog collection"
      title="GroupSum ecosystem catalog"
      description="Traverse public source repositories, contained packages, typed APIs, documentation, demos, examples, websites, showcases, user interfaces, and observed stack evidence through canonical collection and member routes."
      observedAt={formatDate(catalogSummary.generated_at)}
      exportHref="/catalog/catalog.json"
      facts={datasetOrder.map((name) => ({ label: labels[name], value: counts[name], icon: datasetDetails[name].Icon }))}
    />
    <div className="grid gap-3 md:grid-cols-2">
      {datasetOrder.map((name) => {
        const Icon = datasetDetails[name].Icon;
        const route = `/catalog/${name}`;
        return <article key={name} className="group relative flex min-w-0 items-start gap-3 rounded-[6px] border border-[var(--color-border-soft)] bg-white p-4 transition-colors hover:border-accent hover:bg-[#FAF9F6]">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[3px] border border-[var(--color-border-soft)] bg-surface text-accent"><Icon className="h-4.5 w-4.5" aria-hidden="true" /></div>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-serif text-lg font-bold text-ink"><a href={route} onClick={(event) => { event.preventDefault(); onNavigate(route); }} className="hover:text-accent before:absolute before:inset-0 before:content-['']">{labels[name]}</a></h2><strong className="font-mono text-lg tabular-nums text-ink">{counts[name].toLocaleString()}</strong></div><p className="mt-1 text-xs leading-relaxed text-ink-muted">{datasetDetails[name].description}</p><span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-accent">Open collection <ArrowRight className="h-3.5 w-3.5" /></span></div>
        </article>;
      })}
    </div>
    <SurfaceCard title="Canonical resource hierarchy" Icon={GitBranch} intro="Collection pages summarize a resource family; member pages preserve local ownership, evidence, metrics, and navigation to parents and children.">
      <p className="font-mono text-xs leading-relaxed text-ink-muted">Organization → product or portfolio → repository → package or typed resource → release evidence</p>
    </SurfaceCard>
  </section>;
}

export function PublicCatalogExplorer({ onNavigate, compact = false, fixedDataset, initialQuery = "" }: { onNavigate: (path: string) => void; compact?: boolean; fixedDataset?: DatasetName; initialQuery?: string }) {
  const [dataset, setDataset] = useState<DatasetName>(fixedDataset || "repositories");
  const [records, setRecords] = useState<CatalogRecord[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const pageSize = compact ? 24 : 50;

  useEffect(() => {
    if (fixedDataset) setDataset(fixedDataset);
  }, [fixedDataset]);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    setPage(1);
    const staticFallback = () => fetch(`/catalog/site/${dataset}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`catalog response ${response.status}`);
        return response.json() as Promise<CatalogRecord[]>;
      });
    getCatalogCollection(dataset, controller.signal)
      .then((model) => model.records as CatalogRecord[])
      .catch(staticFallback)
      .then((value) => {
        const kind = dataset === "technologies" ? "technology" : dataset.slice(0, -1);
        setRecords(value.map((record) => ({ ...record, kind: record.kind || kind })));
        setState("ready");
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, [dataset]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return records;
    return records.filter((record) => JSON.stringify(record).toLowerCase().includes(normalized));
  }, [query, records]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {!compact && (
        <div className="space-y-5">
          <button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Catalog overview</button>
          <CollectionHeader eyebrow={`${labels[dataset]} collection`} title={labels[dataset]} description={datasetDetails[dataset].description} observedAt={formatDate(catalogSummary.generated_at)} exportHref={`/catalog/site/${dataset}.json`} facts={[{ label: labels[dataset], value: Number(catalogDatasetManifest.counts[dataset] || 0), icon: datasetDetails[dataset].Icon }]} />
        </div>
      )}
      {!fixedDataset && <div className="flex flex-wrap gap-2" aria-label="Catalog datasets" role="tablist">
        {datasetOrder.map((name) => (
          <button key={name} type="button" role="tab" onClick={() => setDataset(name)} aria-selected={dataset === name} className={`min-h-20 min-w-0 flex-[1_1_16rem] rounded-[var(--radius-md)] border px-4 py-3 text-left cursor-pointer transition-colors ${dataset === name ? "bg-accent text-white border-accent" : "bg-[var(--color-surface)] text-ink-muted border-[var(--color-border-soft)] hover:border-[var(--color-border-accent-soft)]"}`}>
            <span className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-xs font-mono font-semibold">{React.createElement(datasetDetails[name].Icon, { className: "h-4 w-4", "aria-hidden": true })}{labels[name]}</span><strong className="font-serif text-lg tabular-nums">{Number(catalogDatasetManifest.counts[name]).toLocaleString()}</strong></span>
            <span className={`mt-1 block text-[10px] leading-snug ${dataset === name ? "text-white/75" : "text-ink-muted"}`}>{datasetDetails[name].description}</span>
          </button>
        ))}
      </div>}
      <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full max-w-2xl">
          <span className="sr-only">Search {labels[dataset]}</span>
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3.5" aria-hidden="true" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={`Search ${labels[dataset].toLowerCase()}...`} className="min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-muted)] bg-[var(--color-surface-raised)] pl-10 pr-4 text-sm text-ink focus:outline-none focus:border-accent" />
        </label>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-mono uppercase tracking-wide text-ink-muted"><Filter className="h-3.5 w-3.5 text-accent" aria-hidden="true" />{filtered.length.toLocaleString()} matching</span>
      </div>
      {state === "loading" && <div className="p-10 text-center text-sm text-ink-muted" role="status">Loading {labels[dataset].toLowerCase()}…</div>}
      {state === "error" && <div className="p-6 border border-red-500/20 bg-red-500/5 text-sm text-red-700 rounded-[var(--radius-sm)]" role="alert">The generated dataset could not be loaded. The normalized JSON remains available from the download links below.</div>}
      {state === "ready" && (
        <>
          <div className="text-xs font-mono text-ink-muted">{filtered.length.toLocaleString()} matching records · page {page.toLocaleString()} of {pages.toLocaleString()}</div>
          <div className="space-y-3">{visible.map((record) => <CollectionRow key={record.id} record={record} dataset={dataset} onNavigate={onNavigate} />)}</div>
          {visible.length === 0 && <div className="p-10 text-center border border-[var(--color-border-soft)] rounded-[var(--radius-md)] text-sm text-ink-muted">No generated records match this search.</div>}
          {pages > 1 && <div className="flex items-center justify-between gap-4"><button disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="px-3 py-2 text-xs font-mono border border-[var(--color-border-soft)] rounded disabled:opacity-40 cursor-pointer">Previous</button><button disabled={page === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))} className="px-3 py-2 text-xs font-mono border border-[var(--color-border-soft)] rounded disabled:opacity-40 cursor-pointer">Next</button></div>}
        </>
      )}
      <div className="flex flex-wrap gap-4 text-xs font-mono">
        <a href="/catalog/catalog.json" className="text-accent hover:underline">Complete normalized catalog</a>
        <a href="/catalog/site/manifest.json" className="text-accent hover:underline">Dataset manifest</a>
        <a href="/catalog/schema.json" className="text-accent hover:underline">Catalog schema</a>
      </div>
    </section>
  );
}

function MemberSectionNav({ record }: { record: CatalogRecord }) {
  const kind = String(record.kind || "record");
  const sections = kind === "repository" ? ["Repository overview", "Observed activity", "Release activity", "SSOT governance", "Latest observed events", "Contained packages", "Related resources"]
    : kind === "package" ? ["Package overview", "Dependencies", "Dependents", "Release history"]
      : kind === "resource" ? [`${humanLabel(String(record.resource_type || "resource"))} overview`, "Connected resources", "Source provenance"]
        : ["Overview", "Connected resources", "Source provenance"];
  return <nav aria-label="On this record" className="sticky top-16 z-10 -mx-4 border-y border-[var(--color-border-soft)] bg-[color-mix(in_srgb,var(--color-canvas)_94%,transparent)] px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-[var(--radius-sm)] sm:border sm:px-3">
    <ul className="flex flex-wrap items-center gap-1">{sections.map((section) => { const id = section.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); return <li key={section}><a href={`#${id}`} className="inline-flex min-h-9 items-center rounded-[3px] px-3 text-[10px] font-mono font-semibold uppercase tracking-wide text-ink-muted hover:bg-[var(--color-surface)] hover:text-accent">{section}</a></li>; })}</ul>
  </nav>;
}

export function PublicCatalogDetail({ path, onNavigate }: { path: string; onNavigate: (path: string) => void }) {
  const segments = path.split(/[?#]/)[0].split("/").filter(Boolean);
  const dataset = segments[1] as DetailDatasetName;
  const normalizedPath = `/${segments.join("/")}`;
  const [record, setRecord] = useState<CatalogRecord | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    if (dataset === "releases") {
      const controller = new AbortController();
      const routeKey = segments.at(-1) || "";
      fetch(`/api/v1/catalog/releases/${encodeURIComponent(routeKey)}`, { signal: controller.signal })
        .then((response) => { if (!response.ok) throw new Error(`catalog response ${response.status}`); return response.json(); })
        .then((model: Record<string, unknown>) => {
          const item = valueRecord(model.item);
          const legal = valueRecord(model.legal);
          setRecord({
            ...item,
            id: String(item.id || routeKey),
            kind: "release",
            resource_type: model.resource_type,
            parent: model.parent,
            legal_evidence: valueRecords(legal.evidence),
            license_expression: legal.license_expression,
            license_status: legal.status,
          } as CatalogRecord);
          setState("ready");
        })
        .catch((error: Error) => { if (error.name !== "AbortError") setState(error.message.includes("404") ? "missing" : "error"); });
      return () => controller.abort();
    }
    if (dataset === "technologies") {
      const controller = new AbortController();
      const routeKey = segments.at(-1) || "";
      const staticFallback = () => fetch("/catalog/site/technologies.json", { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error(`technology response ${response.status}`)))
        .then((records: CatalogRecord[]) => records.find((item) => item.route === normalizedPath) || Promise.reject(new Error("technology missing")));
      getCatalogTechnology(routeKey, controller.signal)
        .then((model) => {
          const item = valueRecord(model.item);
          return { ...item, id: String(item.id || routeKey), kind: "technology", display_name: item.label || item.name, related_records: model.related_records } as CatalogRecord;
        })
        .catch(staticFallback)
        .then((technology) => { setRecord(technology); setState("ready"); })
        .catch((error: Error) => { if (error.name !== "AbortError") setState("missing"); });
      return () => controller.abort();
    }
    if (![...datasetOrder, "technologies"].includes(dataset as DatasetName | "technologies")) {
      setState("missing");
      return;
    }
    const controller = new AbortController();
    fetch(`/catalog/site/${dataset}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`catalog response ${response.status}`);
        return response.json();
      })
      .then((records: CatalogRecord[]) => {
        const match = records.find((item) => item.route === normalizedPath);
        if (!match) { setRecord(null); setState("missing"); return; }
        if (dataset === "packages" || dataset === "resources") {
          const routeKey = segments.at(-1) || "";
          fetch(`/api/v1/catalog/${dataset}/${encodeURIComponent(routeKey)}`, { signal: controller.signal })
            .then((response) => response.ok ? response.json() : Promise.reject(new Error(`resource response ${response.status}`)))
            .then((model: Record<string, unknown>) => {
              const item = valueRecord(model.item); const legal = valueRecord(model.legal); const implementation = valueRecord(model.implementation);
              setRecord({ ...match, ...item, resource_type: model.resource_type || match.resource_type, parent: model.parent, entity_graph: model.graph as EntityGraph | null, legal_evidence: valueRecords(legal.evidence), license_expression: legal.license_expression, license_status: legal.status, repositories: implementation.repositories, releases: implementation.releases, dependencies: implementation.dependencies, dependents: implementation.dependents, downloads: valueRecord(implementation.downloads).value } as CatalogRecord);
              setState("ready");
            })
            .catch(() => { setRecord(match); setState("ready"); });
          return;
        }
        if (dataset === "repositories") {
          const owner = String(match.owner || segments.at(-2) || ""); const name = String(match.name || segments.at(-1) || "");
          getCatalogRepository(owner, name, controller.signal)
            .then((model) => {
              const item = valueRecord(model.item); const implementation = valueRecord(model.implementation); const legal = valueRecord(model.legal);
              setRecord({ ...match, ...item, kind: "repository", entity_graph: model.graph as EntityGraph | null, packages: implementation.packages, related_resources: implementation.resources, releases: implementation.releases, ssot_governance: model.governance, legal_evidence: valueRecords(legal.evidence), license_expression: legal.license_expression, license_status: legal.status } as CatalogRecord);
              setState("ready");
            })
            .catch(() => getEntityPageModel(`entity:repositories:repository:${owner}/${name}`, controller.signal).then((model) => { setRecord({ ...match, entity_graph: model.graph }); setState("ready"); }).catch(() => { setRecord(match); setState("ready"); }));
          return;
        }
        setRecord(match); setState("ready");
      })
      .catch((error: Error) => { if (error.name !== "AbortError") setState("error"); });
    return () => controller.abort();
  }, [dataset, normalizedPath, path]);

  if (state === "loading") return <div className="max-w-3xl mx-auto px-4 py-20 text-sm text-ink-muted" role="status">Loading generated catalog record…</div>;
  if (state !== "ready" || !record) return <div className="max-w-3xl mx-auto px-4 py-20 space-y-4"><h1 className="font-serif text-3xl font-bold text-ink">Catalog record unavailable</h1><p className="text-sm text-ink-muted">{state === "error" ? "The generated catalog could not be loaded. Please try again shortly." : "The route is not present in the current generated public dataset."}</p><button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent hover:underline cursor-pointer">Return to public catalog</button></div>;

  const primaryCandidate = record.url || record.registry_url || record.source_url;
  const primaryUrl = isCurrentPageLink(primaryCandidate) ? undefined : primaryCandidate;
  const sourceEvidence = (record.evidence || []).filter((item) => !isCurrentPageLink(item.url));
  const RecordIcon = record.kind === "repository" ? Code2 : record.kind === "package" ? Package : record.kind === "resource" ? resourceIcon(String(record.resource_type || "resource")) : FileCode2;
  return (
    <article className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8 sm:space-y-10">
      <button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Public catalog</button>
      <RecordIdentityCard eyebrow={`${humanLabel(String(record.kind || "catalog"))} member`} title={recordTitle(record)} summary={recordDescription(record)} Icon={RecordIcon} pills={[...(record.kind === "repository" && Boolean(record.ssot_governance?.governed) ? [{ label: "SSOT governed", tone: "accent" as const }] : []), { label: record.description_source === "reviewed-editorial" ? "Reviewed description" : "Source-derived description" }]} actions={primaryUrl && <a href={String(primaryUrl)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-sm)] bg-accent px-4 text-xs font-mono font-semibold text-white hover:bg-accent-hover">Open primary source <ExternalLink className="h-3.5 w-3.5" /></a>} facts={metricItems(record, 5)} />
      <MemberSectionNav record={record} />
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <main className="space-y-6 lg:col-span-8">
      {record.kind === "repository" && <RepositoryDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "package" && <PackageDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "resource" && <ResourceDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "release" && <ReleaseDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "technology" && <TechnologyDetail record={record} onNavigate={onNavigate} />}
      </main>
      <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-32">
        <ContextRailCard title="Evidence & provenance boundary" Icon={ShieldCheck}><div className="space-y-3 text-xs leading-relaxed text-ink-muted"><p><strong className="text-ink">Observed:</strong> {formatDate(record.observed_at)}</p>{record.claim_boundary && <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-soft)] bg-canvas p-3"><strong className="mb-1 block text-ink">Explicit source boundary</strong>{String(record.claim_boundary)}</div>}{primaryUrl && <a href={String(primaryUrl)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 font-mono font-semibold text-accent hover:underline">Primary evidence <ExternalLink className="h-3.5 w-3.5" /></a>}</div></ContextRailCard>
        <ContextRailCard title="Ownership & canonical path" Icon={GitBranch}><EntityOwnership graph={record.entity_graph} onNavigate={onNavigate} /></ContextRailCard>
        {sourceEvidence.length > 0 && <ContextRailCard title="Source provenance" Icon={BadgeCheck}><ul className="divide-y divide-[var(--color-border-soft)]">{sourceEvidence.map((item, index) => <li key={`${item.url || item.kind}-${index}`} className="py-3 text-xs">{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-words font-mono font-semibold text-accent hover:underline">{humanLabel(item.kind || "source")}<ExternalLink className="h-3.5 w-3.5" /></a> : <span className="text-ink-muted">{humanLabel(item.kind || "source")} · observed {formatDate(item.observed_at)}</span>}</li>)}</ul></ContextRailCard>}
      </aside>
      </div>
    </article>
  );
}
