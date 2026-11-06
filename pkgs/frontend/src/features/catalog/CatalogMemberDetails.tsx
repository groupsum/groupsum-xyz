import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { CatalogLink } from "./CatalogLink";
const PackageRelationships = lazy(() => import("./PackageRelationships"));
import type { RepositorySignals } from "../../api/catalog";
import { Activity, ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Boxes, Braces, CalendarDays, CircleDot, Code2, ExternalLink, FileCode2, GitBranch, Globe2, Package, Scale, ServerCog, ShieldCheck, Users } from "lucide-react";
import { RepositorySignalStrip } from "./RepositorySignals";
import { EntityOwnership } from "./EntityIdentity";
import { CatalogPill, CollectionHeader, ContextRailCard, FactPanel, MemberRowCard, RecordIdentityCard, SurfaceCard, factIcons, MetricBand, metricIcons, type MetricItem } from "./CatalogVisuals";
import { ExplorerFilterToolbar, TypeBadge, type ExplorerFilters } from "./CatalogExplorerUI";
import { useCatalogCollection } from "../../hooks/useCatalogCollection";
import type { CatalogViewRecord } from "../../types/catalog-view";

import { DetailRows, DetailSection, formatDate, humanLabel, isCurrentPageLink, LegalContext, monthlyReleaseActivity, recordTitle, ReleaseTimeline, repositorySignals, resourceIcon, SsotGovernanceSection, valueRecord, valueRecords, valueStrings, type CatalogRecord } from "./CatalogRecordShared";
import { LinkedResourceSections } from "./CatalogCollections";
import { ContainedPackageList, RepositoryLanguagePanel } from "./RepositoryImplementationPanels";

export function RepositoryDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const commit = valueRecord(record.latest_commit);
  const release = valueRecord(record.latest_release);
  const deployment = valueRecord(record.latest_deployment);
  const packages = valueRecords(record.packages);
  const githubReleases = valueRecords(record.github_releases);
  const contributors = valueRecords(record.contributors).sort(
    (left, right) => Number(right.contributions || 0) - Number(left.contributions || 0),
  );
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
      <DetailSection title="Contributors" intro="Specific contributor identities and repository-scoped contribution totals observed from GitHub's contributors API.">
        {contributors.length > 0 ? <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label={`Contributors to ${recordTitle(record)}`}>
          {contributors.map((contributor, index) => {
            const login = String(contributor.login || contributor.name || `Contributor ${index + 1}`);
            const displayName = String(contributor.name || contributor.login || login);
            const href = String(contributor.url || "");
            return <li key={String(contributor.id || contributor.login || contributor.name || index)} className="flex min-w-0 items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface-raised)] p-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--color-border-soft)] bg-canvas text-ink-muted"><Users className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1"><CatalogLink href={String(contributor.profile_route || `/contributors/github/${encodeURIComponent(login)}`)} className="block truncate text-left text-sm font-semibold text-accent hover:underline" title={displayName}>{displayName}</CatalogLink><p className="truncate text-[10px] font-mono text-ink-muted">{contributor.login ? `@${login}` : "Anonymous Git contributor"}</p><p className="mt-1 text-[10px] font-mono tabular-nums text-ink-muted">{Number(contributor.contributions || 0).toLocaleString()} contributions</p></div>
              {href && <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${displayName}'s GitHub profile`} className="grid min-h-11 min-w-11 place-items-center text-accent hover:text-ink"><ExternalLink className="h-4 w-4" /></a>}
            </li>;
          })}
        </ol> : <p className="text-sm text-ink-muted">No contributor identities were reported by the available GitHub observation.</p>}
      </DetailSection>
      <RepositoryLanguagePanel languagesValue={record.languages} technologiesValue={record.technologies} />
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
          ["Deployment log", deployment.log_url ? <a href={String(deployment.log_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View deployment log</a> : null],
        ]} />
      </DetailSection>
      <DetailSection title="Contained packages" intro="Every package is a child resource owned by this repository. Its license belongs with the package rather than the repository-level legal summary.">
        <ContainedPackageList packagesValue={packages} onNavigate={onNavigate} />
      </DetailSection>
      <LinkedResourceSections sections={record.linked_sections} onNavigate={onNavigate} />
    </>
  );
}

export function PackageDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const releases = valueRecords(record.releases);
  const datedReleases = releases.filter((release) => release.published_at);
  const prereleaseCount = releases.filter((release) => release.prerelease || /(?:dev|alpha|beta|rc)/i.test(String(release.version || ""))).length;
  const downloadTotal = releases.reduce((total, release) => total + Number(release.downloads || 0), 0);
  return (
    <>
      <DetailSection title="Relationships">
        <Suspense fallback={<p role="status">Loading relationships…</p>}><PackageRelationships key={record.id} routeKey={String(record.route_key || String(record.route || "").split("/").at(-1))} ecosystem={String(record.ecosystem)} /></Suspense>
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
