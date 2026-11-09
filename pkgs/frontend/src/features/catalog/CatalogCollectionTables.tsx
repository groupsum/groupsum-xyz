import React from "react";
import { repositoryColumns, packageColumns, columnSortValue } from "./catalog-column-sorts";
import { CatalogLink } from "./CatalogLink";
import { InlineMetricChart } from "./InlineMetricChart";
import { RepositoryPackagesCell } from "./RepositoryPackagesCell";
import { PackageDependenciesCell } from "./PackageDependenciesCell";
import {
  BadgeCheck,
  ChevronRight,
  CircleDot,
  GitFork,
  GitBranch,
  Package,
  Star,
} from "lucide-react";
import { CatalogPill, compactNumber } from "./CatalogVisuals";
import { humanLabel, valueRecord, valueRecords, type CatalogRecord } from "./CatalogRecordShared";

type Navigate = (path: string) => void;

function SortHeader({ label, sortKey, visibility, ascending, sort, onSort }: { label: string; sortKey: string; visibility: string; ascending: boolean; sort?: string; onSort?: (value: string) => void }) {
  const asc = columnSortValue(sortKey, true);
  const desc = columnSortValue(sortKey, false);
  const direction = sort === asc ? "ascending" : sort === desc ? "descending" : undefined;
  return <th scope="col" aria-sort={direction} className={`px-2 py-3 ${visibility}`}><button type="button" onClick={() => onSort?.(direction ? (direction === "ascending" ? desc : asc) : ascending ? asc : desc)} className="min-h-6 text-left [overflow-wrap:normal] hover:text-accent" aria-label={sortKey === "stars" ? "Sort repositories by star count" : `Sort by ${label.toLowerCase()}`}>{label}<span aria-hidden="true"> {direction === "ascending" ? "↑" : direction === "descending" ? "↓" : "↕"}</span></button></th>;
}

function RecordLink({ route, onNavigate, children }: { route: string; onNavigate: Navigate; children: React.ReactNode }) {
  return <a href={route} onClick={(event) => { event.preventDefault(); onNavigate(route); }} className="font-semibold text-ink hover:text-accent">{children}</a>;
}

function HyphenBreakText({ value }: { value: string }) {
  const segments = value.split("-");
  return <>{segments.map((segment, index) => <React.Fragment key={`${segment}-${index}`}>{segment}{index < segments.length - 1 ? <>-<wbr /></> : null}</React.Fragment>)}</>;
}

function MiniLine({ points, label }: { points: Array<Record<string, unknown>>; label: string }) {
  return <InlineMetricChart compact label={label} points={points.map((point) => ({ label: String(point.observed_at || point.date || "Observation"), value: Number(point.value) }))} />;
}

function LatestRelease({ value }: { value: unknown }) {
  const release = valueRecord(value);
  const scalar = typeof value === "string" ? value : "";
  const observedDate = String(
    release.published_at
    || release.publishedAt
    || release.released_at
    || release.release_date
    || release.created_at
    || release.createdAt
    || scalar,
  );
  const date = new Date(observedDate);
  const hasDate = observedDate.length > 0 && !Number.isNaN(date.valueOf());
  const label = hasDate
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(date)
    : "Not observed";
  const href = String(release.url || release.html_url || "");
  const className = "inline-flex max-w-full items-center break-words whitespace-normal rounded border border-[var(--color-border-soft)] bg-surface px-2 py-0.5 text-[11px]";
  const content = hasDate ? <time dateTime={date.toISOString()}>{label}</time> : label;
  return href && hasDate
    ? <a href={href} target="_blank" rel="noreferrer" title={`Released ${label}`} className={`${className} text-accent hover:underline`}>{content}</a>
    : <span title={label} className={className}>{content}</span>;
}

function ContributorLinks({ value, onNavigate, limit = 2 }: { value: unknown; onNavigate: Navigate; limit?: number }) {
  const tooltipPrefix = React.useId();
  const contributors = valueRecords(value);
  if (!contributors.length) return <span className="text-[10px] text-ink-muted">Not observed</span>;
  const visible = contributors.slice(0, limit);
  const remaining = contributors.slice(limit);
  const observedTotal = contributors.reduce((total, item) => total + Number(item.contributions || 0), 0);
  const contributorControl = (contributor: Record<string, unknown>, index: number, descriptionId?: string) => {
    const login = String(contributor.login || contributor.name || `Contributor ${index + 1}`);
    const label = contributor.login ? `@${login}` : login;
    const provider = String(contributor.provider || "github");
    const href = String(contributor.url || "");
    const className = "block w-full truncate text-left text-[10px] text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
    return contributor.login || contributor.profile_route
        ? <CatalogLink href={String(contributor.profile_route || `/contributors/${encodeURIComponent(provider)}/${encodeURIComponent(login)}`)} className={className} aria-describedby={descriptionId} title={descriptionId ? undefined : `${label}: ${Number(contributor.contributions || 0).toLocaleString("en-US")} contributions`}>{label}</CatalogLink>
        : href ? <a href={href} target="_blank" rel="noreferrer" className={className} aria-describedby={descriptionId}>{label}</a>
        : <span className="block truncate text-[10px] text-ink-muted focus-visible:outline focus-visible:outline-accent" tabIndex={descriptionId ? 0 : undefined} aria-describedby={descriptionId} title={descriptionId ? undefined : label}>{label}</span>;
  };
  return <div className="relative min-w-0 space-y-1">
    <ul className="space-y-0.5" aria-label={`${contributors.length} observed contributors`}>
      {visible.map((contributor, index) => {
        const count = Number(contributor.contributions || 0);
        const share = observedTotal > 0 ? count / observedTotal * 100 : 0;
        const tooltipId = `${tooltipPrefix}-${index}`;
        return <li key={String(contributor.id || contributor.login || contributor.name || index)} className="group/share relative flex min-w-0 items-center gap-1.5">
          <span className="min-w-0 flex-1">{contributorControl(contributor, index, tooltipId)}</span>
          {observedTotal > 0 && <span aria-hidden="true" className="shrink-0 tabular-nums text-[10px] text-ink-muted">{Math.round(share)}%</span>}
          <span id={tooltipId} role="tooltip" className="invisible absolute left-0 top-full z-50 w-max max-w-52 rounded border border-[var(--color-border-soft)] bg-surface-raised px-2 py-1 text-[10px] text-ink shadow-lg group-hover/share:visible group-focus-within/share:visible">
            {String(contributor.login || contributor.name || `Contributor ${index + 1}`)}: {count.toLocaleString("en-US")} contributions{observedTotal > 0 ? ` (${share.toLocaleString("en-US", { maximumFractionDigits: 2 })}% of observed contributions)` : " (share unavailable)"}
          </span>
        </li>;
      })}
    </ul>
    {remaining.length > 0 && <details className="group/contributors relative">
      <summary className="w-fit cursor-pointer list-none rounded text-[9px] text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden" aria-label={`Show ${remaining.length.toLocaleString()} more contributors`}>+{remaining.length.toLocaleString()} more</summary>
      <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border border-[var(--color-border-soft)] bg-surface-raised p-2 shadow-lg">
        <p className="mb-1.5 border-b border-[var(--color-border-soft)] pb-1.5 text-[9px] font-semibold uppercase tracking-wide text-ink-muted">Other contributors</p>
        <ul className="max-h-56 space-y-1 overflow-y-auto py-0.5" aria-label="Other observed contributors">
          {remaining.map((contributor, index) => <li key={String(contributor.id || contributor.login || contributor.name || index)} className="min-w-0 rounded px-1 py-0.5 hover:bg-canvas">{contributorControl(contributor, visible.length + index)}</li>)}
        </ul>
      </div>
    </details>}
  </div>;
}

function CommitBars({ points }: { points: Array<Record<string, unknown>> }) {
  return <InlineMetricChart compact bars label="Daily commits" points={points.slice(-30).map((point) => ({ label: String(point.date), value: Number(point.count) }))} />;
}

export function RepositoryCollectionTable({ records, onNavigate, sort, onSort }: { records: CatalogRecord[]; onNavigate: Navigate; sort?: string; onSort?: (value: string) => void }) {
  return <div className="min-w-0 border-y border-[var(--color-border-soft)]">
      <table className="catalog-density-table catalog-repository-table w-full table-fixed text-left text-xs" aria-label="Repository catalog records">
        <colgroup><col className="w-[43%] md:w-[28%] lg:w-[20%]" /><col className="hidden w-[10%] lg:table-column" /><col className="w-[24%] md:w-[15%] lg:w-[11%]" /><col className="hidden w-[6%] xl:table-column" /><col className="hidden w-[16%] md:table-column lg:w-[13%]" /><col className="hidden w-[12%] xl:table-column" /><col className="w-[23%] md:w-[12%] lg:w-[8%]" /><col className="hidden w-[11%] lg:table-column" /><col className="hidden w-[9%] lg:table-column" /><col className="w-[10%] md:w-[5%] lg:w-[3%]" /></colgroup>
        <thead className="type-ui-label bg-canvas text-ink-muted"><tr>{repositoryColumns.map(([label, key, visibility, ascending]) => <SortHeader key={key} {...{ label, sortKey: key, visibility, ascending, sort, onSort }} />)}<th className="hidden px-2 py-3 lg:table-cell">Governance</th><th className="px-2 py-3"><span className="sr-only">Action</span></th></tr></thead>
        <tbody className="type-technical divide-y divide-[var(--color-border-soft)]">{records.map((record) => {
          const metrics = valueRecord(record.metrics);
          const history = valueRecord(record.history);
          return <tr key={record.id} className="group h-[4.5rem] hover:bg-canvas">
            <td className="min-w-0 px-3 py-2 align-middle"><div className="flex min-w-0 items-center gap-2"><GitBranch className="h-4 w-4 shrink-0 text-accent" /><RecordLink route={String(record.route)} onNavigate={onNavigate}><span className="line-clamp-2 break-words leading-snug"><HyphenBreakText value={String(record.name)} /></span></RecordLink></div></td>
            <td className="hidden min-w-0 truncate px-2 py-2 align-middle text-ink-muted lg:table-cell" title={String(record.owner || "Not recorded")}>{String(record.owner || "Not recorded")}</td>
            <td className="min-w-0 !overflow-visible px-2 py-2 align-middle"><div className="min-w-0 space-y-1"><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-signal text-signal" /><strong className="tabular-nums text-ink">{compactNumber(Number(metrics.stars || 0))}</strong></span><div className="hidden overflow-visible lg:block"><MiniLine points={valueRecords(history.stars)} label="Stars" /></div></div></td>
            <td className="hidden min-w-0 px-2 py-2 align-middle xl:table-cell"><span className="inline-flex items-center gap-1 font-semibold tabular-nums"><GitFork className="h-3 w-3 text-ink-muted" />{compactNumber(Number(metrics.forks || 0))}</span></td>
            <td className="hidden min-w-0 !overflow-visible px-2 py-2 align-middle md:table-cell"><CommitBars points={valueRecords(record.commit_activity)} /></td>
            <td className="hidden min-w-0 !overflow-visible px-2 py-2 align-middle xl:table-cell"><ContributorLinks value={record.contributors} onNavigate={onNavigate} limit={2} /></td>
            <td className="min-w-0 px-2 py-2 align-middle"><RepositoryPackagesCell record={record} /></td>
            <td className="hidden min-w-0 px-2 py-2 align-middle lg:table-cell"><LatestRelease value={record.latest_release} /></td>
            <td className="hidden min-w-0 px-2 py-2 align-middle lg:table-cell">{record.ssot_governed ? <CatalogPill compact tone="signal"><span className="whitespace-nowrap">Governed</span></CatalogPill> : <span className="text-[10px] text-ink-muted">Not observed</span>}</td>
            <td className="min-w-0 px-2 py-2 text-right align-middle"><RecordLink route={String(record.route)} onNavigate={onNavigate}><ChevronRight className="ml-auto h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" /></RecordLink></td>
          </tr>;
        })}</tbody>
      </table>
    </div>;
}

function PublicationBadge({ record }: { record: CatalogRecord }) {
  const published = record.published || record.publication_status === "published";
  return <CatalogPill compact tone={published ? "signal" : "neutral"} Icon={published ? BadgeCheck : CircleDot}>{published ? "Published" : ["manifest-private", "manifest_private"].includes(String(record.publication_status)) ? "Private" : humanLabel(String(record.publication_status || "Candidate"))}</CatalogPill>;
}


export function PackageCollectionTable({ records, onNavigate, sort, onSort }: { records: CatalogRecord[]; onNavigate: Navigate; sort?: string; onSort?: (value: string) => void }) {
  return <>

    <div className="min-w-0 border-y border-[var(--color-border-soft)]">
      <table className="catalog-density-table catalog-package-table text-left text-xs" aria-label="Package catalog records">
        <thead className="type-ui-label bg-canvas text-ink-muted"><tr>{packageColumns.map(([label, key, visibility, ascending]) => <SortHeader key={key} {...{ label, sortKey: key, visibility, ascending, sort, onSort }} />)}<th className="px-2 py-3"><span className="sr-only">Action</span></th></tr></thead>
        <tbody className="type-technical divide-y divide-[var(--color-border-soft)]">{records.map((record) => { const repository = valueRecords(record.repositories)[0] || {}; const repositoryLabel = repository.owner ? `${String(repository.owner)}/${String(repository.name)}` : "Not linked"; return <tr key={record.id} className="h-[4.5rem] hover:bg-canvas"><td className="px-3 py-2"><div className="flex min-w-0 items-center gap-2"><Package className="h-3.5 w-3.5 shrink-0 text-signal" /><RecordLink route={String(record.route)} onNavigate={onNavigate}><span className="line-clamp-2 break-words leading-snug" title={String(record.name)}>{String(record.name)}</span></RecordLink></div></td><td className="px-2 py-2"><span className="inline-flex w-fit max-w-full truncate rounded border border-[var(--color-border-soft)] bg-surface px-1.5 py-0.5 text-[10px]" title={String(record.ecosystem || "unknown")}>{String(record.ecosystem || "unknown")}</span></td><td className="hidden px-2 py-2 text-accent lg:table-cell"><span className="line-clamp-2 break-words" title={repositoryLabel}>{repositoryLabel}</span></td><td className="hidden px-2 py-2 lg:table-cell"><PublicationBadge record={record} /></td><td className="px-2 py-2 font-bold tabular-nums"><span className="block truncate" title={String(record.latest_version || "Not recorded")}>{String(record.latest_version || "Not recorded")}</span></td><td className="hidden min-w-0 !overflow-visible px-2 py-2 tabular-nums md:table-cell"><PackageDependenciesCell record={record} /></td><td className="hidden truncate px-2 py-2 font-semibold tabular-nums text-accent xl:table-cell">{compactNumber(Number(record.dependent_count || 0))}</td><td className="hidden truncate px-2 py-2 text-success xl:table-cell" title={String(record.license_expression || "Not observed")}>{String(record.license_expression || "Not observed")}</td><td className="px-2 py-2 text-right"><RecordLink route={String(record.route)} onNavigate={onNavigate}><ChevronRight className="ml-auto h-4 w-4 text-accent" /></RecordLink></td></tr>; })}</tbody>
      </table>
    </div>
  </>;
}
