import { lazy, Suspense } from "react";
import { Activity, BadgeCheck, CalendarDays, Code2, ExternalLink, FileCode2 } from "lucide-react";
import { CatalogPill, FactPanel, MetricBand, metricIcons } from "./CatalogVisuals";
import { DetailRows, DetailSection, formatDate, humanLabel, LegalContext, monthlyReleaseActivity, recordTitle, ReleaseTimeline, resourceIcon, valueRecord, valueRecords, valueStrings, type CatalogRecord } from "./CatalogRecordShared";
import { LinkedResourceSections } from "./CatalogCollections";

const PackageRelationships = lazy(() => import("./PackageRelationships"));
const PackageReleaseHistory = lazy(() => import("./PackageReleaseHistory"));

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
        <Suspense fallback={<p role="status">Loading releases…</p>}><PackageReleaseHistory key={record.id} releases={releases} /></Suspense>
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
