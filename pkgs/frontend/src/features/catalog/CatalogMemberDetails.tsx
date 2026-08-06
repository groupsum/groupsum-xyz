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

import { DetailRows, DetailSection, formatDate, humanLabel, isCurrentPageLink, LegalContext, monthlyReleaseActivity, recordTitle, ReleaseTimeline, repositorySignals, resourceIcon, SsotGovernanceSection, valueRecord, valueRecords, valueStrings, type CatalogRecord } from "./CatalogRecordShared";
import { LinkedResourceSections } from "./CatalogCollections";

export function RepositoryDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const commit = valueRecord(record.latest_commit);
  const release = valueRecord(record.latest_release);
  const deployment = valueRecord(record.latest_deployment);
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
          ["Commit", commit.message ? <span>{String(commit.message)}{commit.url && <> Â· <a href={String(commit.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View commit</a></>}</span> : "No commit observed"],
          ["Commit date", formatDate(commit.committed_at as string | undefined)],
          ["Release", release.tag ? <span>{String(release.name || release.tag)}{release.url && <> Â· <a href={String(release.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View release</a></>}</span> : "No GitHub release observed"],
          ["Release date", formatDate(release.published_at as string | undefined)],
          ["Deployment", deployment.environment ? `${String(deployment.environment)} Â· ${humanLabel(String(deployment.state || "state not recorded"))}` : "No deployment observed"],
          ["Deployment update", deployment.updated_at ? formatDate(String(deployment.updated_at)) : null],
          ["Deployment log", deployment.log_url ? <a href={String(deployment.log_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View deployment log</a> : null],
        ]} />
      </DetailSection>
      <DetailSection title="Contained packages" intro="Every package is a child resource owned by this repository. Its license belongs with the package rather than the repository-level legal summary.">
        {packages.length > 0 ? <ul className="divide-y divide-[var(--color-border-soft)]">{packages.map((pkg) => <li key={String(pkg.id)} className="py-4 sm:flex sm:items-center sm:justify-between gap-5"><div className="min-w-0"><span className="text-[10px] font-mono uppercase text-accent">{humanLabel(String(pkg.ecosystem || "package"))} Â· {humanLabel(String(pkg.package_kind || "package candidate"))}</span><p className="break-all text-sm font-semibold text-ink">{String(pkg.name)}</p><p className="text-xs text-ink-muted">{String(pkg.manifest_path || "Manifest path not recorded")}</p><p className="mt-1 text-xs text-ink-muted">License: {pkg.license_url ? <a href={String(pkg.license_url)} target="_blank" rel="noreferrer" className="font-semibold text-accent hover:underline">{String(pkg.license_expression || "Observed license")}</a> : String(pkg.license_expression || "Not observed")}{Number(pkg.notice_count || 0) > 0 ? ` Â· ${Number(pkg.notice_count).toLocaleString()} notice file${Number(pkg.notice_count) === 1 ? "" : "s"}` : ""}</p></div><div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-0"><span className="text-[10px] font-mono text-ink-muted"><strong className="block text-sm text-ink">{Number(pkg.release_count || 0).toLocaleString()}</strong>releases</span><span className="text-[10px] font-mono text-ink-muted"><strong className="block text-sm text-ink">{String(pkg.latest_version || "â€”")}</strong>latest</span><a href={String(pkg.route)} onClick={(event) => { event.preventDefault(); onNavigate(String(pkg.route)); }} className="inline-flex min-h-11 items-center text-xs font-mono font-semibold text-accent hover:underline">View package</a></div></li>)}</ul> : <p className="text-sm text-ink-muted">No package manifests were observed in this repository.</p>}
      </DetailSection>
      <LinkedResourceSections sections={record.linked_sections} onNavigate={onNavigate} />
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
        <div className="min-w-0 flex-[1_1_12rem]"><dt className="text-[9px] font-mono uppercase tracking-wide text-ink-muted">{direction === "dependency" ? "Requirement" : "Requirement and coverage"}</dt><dd className="mt-1"><DependencyRequirement details={dependencyRequirementDetails(item.requirement)} completeness={direction === "dependent" ? String(item.completeness || "") : ""} /></dd></div>
      </dl>
    </li>)}
  </ul>;
}

const dependencyRequirementOrder = ["version", "constraint", "features", "default-features", "optional", "workspace", "package", "registry", "git", "branch", "tag", "rev", "path"];

function dependencyRequirementDetails(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value !== "string" || !value.trim()) return {};
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
  } catch {
    // Legacy catalog snapshots used Python repr for Cargo maps.
  }
  if (value.trim().startsWith("{")) {
    const details: Record<string, unknown> = {};
    const version = value.match(/["']version["']\s*:\s*["']([^"']+)["']/);
    const features = value.match(/["']features["']\s*:\s*\[([^\]]*)\]/);
    if (version) details.version = version[1];
    if (features) details.features = [...features[1].matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
    if (Object.keys(details).length) return details;
  }
  return { constraint: value };
}

function DependencyRequirement({ details, completeness }: { details: Record<string, unknown>; completeness?: string }) {
  const entries = Object.entries(details).sort(([left], [right]) => {
    const leftIndex = dependencyRequirementOrder.indexOf(left);
    const rightIndex = dependencyRequirementOrder.indexOf(right);
    return (leftIndex < 0 ? dependencyRequirementOrder.length : leftIndex) - (rightIndex < 0 ? dependencyRequirementOrder.length : rightIndex) || left.localeCompare(right);
  });
  if (!entries.length && !completeness) return <span className="font-mono text-xs text-ink-muted">Not reported</span>;
  return <dl className="flex flex-wrap gap-x-4 gap-y-2">
    {entries.map(([key, value]) => <div key={key} className="min-w-0"><dt className="text-[9px] font-mono uppercase tracking-wide text-ink-muted">{humanLabel(key)}</dt><dd className="mt-0.5 break-words text-xs font-semibold text-ink">{Array.isArray(value) ? value.join(", ") : typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}</dd></div>)}
    {completeness && <div className="min-w-0"><dt className="text-[9px] font-mono uppercase tracking-wide text-ink-muted">Coverage</dt><dd className="mt-0.5 break-words text-xs text-ink-muted">{humanLabel(completeness)}</dd></div>}
  </dl>;
}

export function PackageDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
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
          ["Repository", repositories.length > 0 ? repositories.map((repository, index) => <React.Fragment key={String(repository.id)}>{index > 0 ? ", " : ""}<button onClick={() => onNavigate(`/catalog/repositories/${String(repository.owner)}/${String(repository.name)}`)} className="cursor-pointer text-accent hover:underline">{String(repository.owner)}/{String(repository.name)}</button>{repository.path ? <span className="text-ink-muted"> Â· {String(repository.path)}</span> : null}</React.Fragment>) : String(record.repository || "Not linked")],
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
        {releases.length > 0 ? <ol className="divide-y divide-[var(--color-border-soft)]" aria-label="Package releases">{releases.map((release) => <li key={String(release.id)} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-mono uppercase text-accent">{humanLabel(String(release.release_kind || "release"))}</span>{release.prerelease && <CatalogPill>Prerelease</CatalogPill>}{release.draft && <CatalogPill>Draft</CatalogPill>}</div><h3 className="mt-1 break-all font-serif text-lg font-bold text-ink">{String(release.version || "Unversioned release")}</h3><p className="mt-1 text-xs text-ink-muted">Published {formatDate(release.published_at as string | undefined)} Â· observed {formatDate(release.observed_at as string | undefined)}{typeof release.downloads === "number" ? ` Â· ${Number(release.downloads).toLocaleString()} downloads` : ""}</p></div><div className="flex flex-wrap items-center gap-3">{release.route && <a href={String(release.route)} onClick={(event) => { event.preventDefault(); onNavigate(String(release.route)); }} className="inline-flex min-h-11 items-center text-xs font-mono font-semibold text-accent hover:underline">Release record</a>}{release.url && <a href={String(release.url)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-xs font-mono text-accent hover:underline">Registry source <ExternalLink className="h-3.5 w-3.5" /></a>}</div></li>)}</ol> : <p className="text-sm text-ink-muted">No release records were reported by the package registry.</p>}
      </DetailSection>
    </>
  );
}

export function ResourceDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const ResourceIcon = resourceIcon(String(record.resource_type || "resource"));
  const ssot = valueRecord(record.ssot);
  return <>
    <DetailSection title={`${String(record.type_label || humanLabel(String(record.resource_type || "resource")))} overview`} intro="This resource has one canonical catalog type. Its links describe direct relationships to other independently addressable resources.">
      <div className="flex flex-wrap gap-2"><CatalogPill tone="accent" Icon={ResourceIcon}>{String(record.type_label || humanLabel(String(record.resource_type || "resource")))}</CatalogPill><CatalogPill Icon={Code2}>{humanLabel(String(record.resource_family || "catalog resource"))}</CatalogPill></div>
      <FactPanel items={[
        { label: "Resource type", icon: ResourceIcon, value: String(record.type_label || humanLabel(String(record.resource_type || "resource"))) },
        { label: "Repository path", icon: FileCode2, value: String(record.path || "Not recorded") },
        { label: "SSOT status", icon: BadgeCheck, value: humanLabel(String(ssot.implementation_status || ssot.status || "not applicable")) },
        { label: "Observed", icon: CalendarDays, value: formatDate(record.observed_at) },
      ]} />
      <DetailRows rows={[["Canonical type", String(record.resource_type || "resource")], ["Repository", record.repository_route ? <button onClick={() => onNavigate(String(record.repository_route))} className="text-accent hover:underline cursor-pointer">{String(record.repository || "View repository")}</button> : String(record.repository || "Not linked")], ["Repository path", String(record.path || "Not recorded")], ["SSOT entity ID", ssot.entity_id ? String(ssot.entity_id) : null]]} />
      <LegalContext record={record} detail />
    </DetailSection>
    <LinkedResourceSections sections={record.linked_sections} onNavigate={onNavigate} />
  </>;
}

export function ReleaseDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const parent = valueRecord(record.parent);
  return <>
    <DetailSection title="Release record" intro="Version, publication, download, and status fields are registry- or GitHub-observed facts.">
      <DetailRows rows={[["Release kind", humanLabel(String(record.release_kind || record.resource_type || "release"))], ["Version", String(record.version || "Not recorded")], ["Published", formatDate(record.published_at as string | undefined)], ["Downloads", typeof record.downloads === "number" ? record.downloads.toLocaleString() : "Not reported"], ["Prerelease", record.prerelease ? "Yes" : "No"], ["Draft", record.draft ? "Yes" : "No"]]} />
      {parent.route_key && <button onClick={() => onNavigate(`/catalog/packages/${String(parent.ecosystem)}/${String(parent.route_key)}`)} className="text-xs font-mono text-accent hover:underline cursor-pointer">View parent package</button>}
      <LegalContext record={record} detail />
    </DetailSection>
  </>;
}

export function TechnologyDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
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
