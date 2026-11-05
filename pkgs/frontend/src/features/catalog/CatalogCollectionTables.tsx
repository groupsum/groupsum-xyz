import React from "react";
import {
  BadgeCheck,
  ChevronRight,
  CircleDot,
  GitFork,
  GitBranch,
  Package,
  ShieldCheck,
  Star,
} from "lucide-react";
import { CatalogPill, compactNumber } from "./CatalogVisuals";
import { humanLabel, valueRecord, valueRecords, type CatalogRecord } from "./CatalogRecordShared";

type Navigate = (path: string) => void;

function RecordLink({ route, onNavigate, children }: { route: string; onNavigate: Navigate; children: React.ReactNode }) {
  return <a href={route} onClick={(event) => { event.preventDefault(); onNavigate(route); }} className="font-semibold text-ink hover:text-accent">{children}</a>;
}

function HyphenBreakText({ value }: { value: string }) {
  const segments = value.split("-");
  return <>{segments.map((segment, index) => <React.Fragment key={`${segment}-${index}`}>{segment}{index < segments.length - 1 ? <>-<wbr /></> : null}</React.Fragment>)}</>;
}

function MiniLine({ points, label }: { points: Array<Record<string, unknown>>; label: string }) {
  const values = points.map((point) => Number(point.value || 0));
  if (values.length < 2) {
    const message = values.length === 1 ? "1 observation" : "No history";
    return <span className="inline-flex min-h-5 items-center whitespace-nowrap rounded border border-[var(--color-border-soft)] bg-surface px-1.5 text-[9px] font-mono text-ink-muted" title="A trend requires at least two observations">{message}</span>;
  }
  const width = 90;
  const height = 20;
  const min = Math.min(...values);
  const range = Math.max(1, Math.max(...values) - min);
  const path = values.map((value, index) => `${index ? "L" : "M"}${((index / (values.length - 1)) * width).toFixed(1)},${(height - ((value - min) / range) * (height - 2) - 1).toFixed(1)}`).join(" ");
  return <div className="space-y-0.5"><svg viewBox={`0 0 ${width} ${height}`} className="h-5 w-[90px] text-accent" role="img" aria-label={`${label} trend over ${values.length} observations`}><path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" /></svg><span className="text-[9px] text-ink-muted">{values.length} observations</span></div>;
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
  const contributors = valueRecords(value);
  if (!contributors.length) return <span className="text-[10px] text-ink-muted">Not observed</span>;
  const visible = contributors.slice(0, limit);
  const remaining = contributors.slice(limit);
  const contributorControl = (contributor: Record<string, unknown>, index: number) => {
    const login = String(contributor.login || contributor.name || `Contributor ${index + 1}`);
    const label = contributor.login ? `@${login}` : login;
    const provider = String(contributor.provider || "github");
    const href = String(contributor.url || "");
    const className = "block w-full truncate text-left text-[10px] text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
    return href
      ? <a href={href} target="_blank" rel="noreferrer" className={className} title={`${label}: ${Number(contributor.contributions || 0).toLocaleString()} contributions`}>{label}</a>
      : contributor.login
        ? <button type="button" onClick={() => onNavigate(`/contributors/${encodeURIComponent(provider)}/${encodeURIComponent(login)}`)} className={className} title={`${label}: ${Number(contributor.contributions || 0).toLocaleString()} contributions`}>{label}</button>
        : <span className="block truncate text-[10px] text-ink-muted" title={label}>{label}</span>;
  };
  return <div className="relative min-w-0 space-y-1">
    <ul className="space-y-0.5" aria-label={`${contributors.length} observed contributors`}>
      {visible.map((contributor, index) => {
        return <li key={String(contributor.id || contributor.login || contributor.name || index)} className="min-w-0">
          {contributorControl(contributor, index)}
        </li>;
      })}
    </ul>
    {remaining.length > 0 && <details className="group/contributors relative">
      <summary className="w-fit cursor-pointer list-none rounded text-[9px] text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden" aria-label={`Show ${remaining.length.toLocaleString()} more contributors`}>+{remaining.length.toLocaleString()} more</summary>
      <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border border-[var(--color-border-soft)] bg-white p-2 shadow-lg">
        <p className="mb-1.5 border-b border-[var(--color-border-soft)] pb-1.5 text-[9px] font-semibold uppercase tracking-wide text-ink-muted">Other contributors</p>
        <ul className="max-h-56 space-y-1 overflow-y-auto py-0.5" aria-label="Other observed contributors">
          {remaining.map((contributor, index) => <li key={String(contributor.id || contributor.login || contributor.name || index)} className="min-w-0 rounded px-1 py-0.5 hover:bg-canvas">{contributorControl(contributor, visible.length + index)}</li>)}
        </ul>
      </div>
    </details>}
  </div>;
}

function CommitBars({ points }: { points: Array<Record<string, unknown>> }) {
  const visible = points.slice(-30);
  if (!visible.length) return <span className="text-[9px] font-mono text-ink-muted">No activity</span>;
  const max = Math.max(1, ...visible.map((point) => Number(point.count || 0)));
  const total = visible.reduce((sum, point) => sum + Number(point.count || 0), 0);
  const barWidth = 110 / visible.length;
  return <div className="min-w-0 space-y-1">
    <svg viewBox="0 0 110 24" className="h-6 w-full max-w-[110px] text-signal" role="img" aria-label={`${total.toLocaleString()} commits over the last ${visible.length} observed days`}>{visible.map((point, index) => { const value = Number(point.count || 0); const height = Math.max(1, value / max * 23); return <rect key={`${String(point.date)}-${index}`} x={index * barWidth} y={24 - height} width={Math.max(1.4, barWidth - 0.8)} height={height} rx="0.5" fill="currentColor" />; })}</svg>
    <span className="block truncate text-[9px] text-ink-muted" title={`${total.toLocaleString()} commits over 30 days`}>{total.toLocaleString()} commits / 30d</span>
  </div>;
}

export function RepositoryCollectionTable({ records, onNavigate }: { records: CatalogRecord[]; onNavigate: Navigate }) {
  return <div className="min-w-0 rounded-xl border border-[var(--color-border-soft)] bg-white shadow-sm">
      <table className="catalog-density-table catalog-repository-table w-full table-fixed text-left text-xs" aria-label="Repository catalog records">
        <colgroup><col className="w-[43%] md:w-[28%] lg:w-[20%]" /><col className="hidden w-[10%] lg:table-column" /><col className="w-[24%] md:w-[15%] lg:w-[11%]" /><col className="hidden w-[6%] xl:table-column" /><col className="hidden w-[16%] md:table-column lg:w-[13%]" /><col className="hidden w-[12%] xl:table-column" /><col className="w-[23%] md:w-[12%] lg:w-[8%]" /><col className="hidden w-[11%] lg:table-column" /><col className="hidden w-[9%] lg:table-column" /><col className="w-[10%] md:w-[5%] lg:w-[3%]" /></colgroup>
        <thead className="bg-canvas text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted"><tr><th className="px-3 py-3">Repository</th><th className="hidden px-2 py-3 lg:table-cell">Organization</th><th className="px-2 py-3">Stars</th><th className="hidden px-2 py-3 xl:table-cell">Forks</th><th className="hidden px-2 py-3 md:table-cell">30-Day Commits</th><th className="hidden px-2 py-3 xl:table-cell">Contributors</th><th className="px-2 py-3">Packages</th><th className="hidden px-2 py-3 lg:table-cell">Latest Release</th><th className="hidden px-2 py-3 lg:table-cell">Governance</th><th className="px-2 py-3 text-right"><span className="sr-only">Action</span></th></tr></thead>
        <tbody className="divide-y divide-[var(--color-border-soft)] font-mono">{records.map((record) => {
          const metrics = valueRecord(record.metrics);
          const history = valueRecord(record.history);
          return <tr key={record.id} className="group h-[4.5rem] hover:bg-canvas">
            <td className="min-w-0 px-3 py-2 align-middle"><div className="flex min-w-0 items-center gap-2"><GitBranch className="h-4 w-4 shrink-0 text-violet-700" /><RecordLink route={String(record.route)} onNavigate={onNavigate}><span className="line-clamp-2 break-words leading-snug"><HyphenBreakText value={String(record.name)} /></span></RecordLink></div></td>
            <td className="hidden min-w-0 truncate px-2 py-2 align-middle text-ink-muted lg:table-cell" title={String(record.owner || "Not recorded")}>{String(record.owner || "Not recorded")}</td>
            <td className="min-w-0 px-2 py-2 align-middle"><div className="min-w-0 space-y-1"><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-500" /><strong className="tabular-nums text-ink">{compactNumber(Number(metrics.stars || 0))}</strong></span><div className="hidden lg:block"><MiniLine points={valueRecords(history.stars)} label="Stars" /></div></div></td>
            <td className="hidden min-w-0 px-2 py-2 align-middle xl:table-cell"><span className="inline-flex items-center gap-1 font-semibold tabular-nums"><GitFork className="h-3 w-3 text-ink-muted" />{compactNumber(Number(metrics.forks || 0))}</span></td>
            <td className="hidden min-w-0 px-2 py-2 align-middle md:table-cell"><CommitBars points={valueRecords(record.commit_activity)} /></td>
            <td className="hidden min-w-0 !overflow-visible px-2 py-2 align-middle xl:table-cell"><ContributorLinks value={record.contributors} onNavigate={onNavigate} limit={2} /></td>
            <td className="min-w-0 truncate px-2 py-2 align-middle font-semibold text-accent" title={`${Number(record.package_count || 0).toLocaleString()} packages`}>{Number(record.package_count || 0).toLocaleString()} <span className="hidden sm:inline">pkgs</span></td>
            <td className="hidden min-w-0 px-2 py-2 align-middle lg:table-cell"><LatestRelease value={record.latest_release} /></td>
            <td className="hidden min-w-0 px-2 py-2 align-middle lg:table-cell">{record.ssot_governed ? <CatalogPill tone="accent" Icon={ShieldCheck}>Governed</CatalogPill> : <span className="text-[10px] text-ink-muted">Not observed</span>}</td>
            <td className="min-w-0 px-2 py-2 text-right align-middle"><RecordLink route={String(record.route)} onNavigate={onNavigate}><ChevronRight className="ml-auto h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" /></RecordLink></td>
          </tr>;
        })}</tbody>
      </table>
    </div>;
}

function PublicationBadge({ record }: { record: CatalogRecord }) {
  const published = record.published || record.publication_status === "published";
  return <CatalogPill tone={published ? "accent" : "neutral"} Icon={published ? BadgeCheck : CircleDot}>{published ? "Published" : humanLabel(String(record.publication_status || "Candidate"))}</CatalogPill>;
}

function PackageMobileCard({ record, onNavigate }: { record: CatalogRecord; onNavigate: Navigate }) {
  const repository = valueRecords(record.repositories)[0] || {};
  return <article className="catalog-density-card min-w-0 space-y-3 rounded-xl border border-[var(--color-border-soft)] bg-white p-4 shadow-sm"><div className="flex flex-wrap items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-orange-200 bg-orange-50 text-orange-700"><Package className="h-4 w-4" /></span><div className="min-w-0 flex-[1_1_12rem]"><RecordLink route={String(record.route)} onNavigate={onNavigate}><span className="break-all">{String(record.name)}</span></RecordLink><p className="mt-1 break-all text-xs font-mono text-ink-muted">{humanLabel(String(record.ecosystem || "unknown"))} · {repository.owner ? `${String(repository.owner)}/${String(repository.name)}` : "Repository not linked"}</p></div><PublicationBadge record={record} /></div><dl className="flex min-w-0 flex-wrap gap-x-6 gap-y-2 text-xs font-mono"><div className="min-w-0"><dt className="text-ink-muted">Latest</dt><dd className="break-words font-bold text-ink">{String(record.latest_version || "Not recorded")}</dd></div><div><dt className="text-ink-muted">Dependencies</dt><dd className="font-bold text-ink">{Number(record.dependency_count || 0).toLocaleString()}</dd></div><div className="min-w-0"><dt className="text-ink-muted">License</dt><dd className="break-words font-bold text-ink">{String(record.license_expression || "Not observed")}</dd></div></dl></article>;
}

export function PackageCollectionTable({ records, onNavigate }: { records: CatalogRecord[]; onNavigate: Navigate }) {
  return <>
    <div className="grid gap-3 sm:hidden">{records.map((record) => <PackageMobileCard key={record.id} record={record} onNavigate={onNavigate} />)}</div>
    <div className="hidden min-w-0 overflow-hidden rounded-xl border border-[var(--color-border-soft)] bg-white shadow-sm sm:block">
      <table className="catalog-density-table catalog-package-table text-left text-xs" aria-label="Package catalog records">
        <thead className="bg-canvas text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted"><tr><th className="px-3 py-3">Package</th><th className="px-2 py-3">Ecosystem</th><th className="hidden px-2 py-3 lg:table-cell">Repository</th><th className="hidden px-2 py-3 lg:table-cell">Publication</th><th className="px-2 py-3">Latest</th><th className="hidden px-2 py-3 md:table-cell">Dependencies</th><th className="hidden px-2 py-3 xl:table-cell">Dependents</th><th className="hidden px-2 py-3 xl:table-cell">License</th><th className="px-2 py-3"><span className="sr-only">Action</span></th></tr></thead>
        <tbody className="divide-y divide-[var(--color-border-soft)] font-mono">{records.map((record) => { const repository = valueRecords(record.repositories)[0] || {}; const repositoryLabel = repository.owner ? `${String(repository.owner)}/${String(repository.name)}` : "Not linked"; return <tr key={record.id} className="h-[4.5rem] hover:bg-canvas"><td className="px-3 py-2"><div className="flex min-w-0 items-center gap-2"><Package className="h-3.5 w-3.5 shrink-0 text-orange-600" /><RecordLink route={String(record.route)} onNavigate={onNavigate}><span className="line-clamp-2 break-words leading-snug" title={String(record.name)}>{String(record.name)}</span></RecordLink></div></td><td className="px-2 py-2"><span className="block truncate rounded border border-[var(--color-border-soft)] bg-surface px-1.5 py-0.5 text-[10px]" title={String(record.ecosystem || "unknown")}>{String(record.ecosystem || "unknown")}</span></td><td className="hidden px-2 py-2 text-violet-700 lg:table-cell"><span className="line-clamp-2 break-words" title={repositoryLabel}>{repositoryLabel}</span></td><td className="hidden px-2 py-2 lg:table-cell"><PublicationBadge record={record} /></td><td className="px-2 py-2 font-bold tabular-nums"><span className="block truncate" title={String(record.latest_version || "Not recorded")}>{String(record.latest_version || "Not recorded")}</span></td><td className="hidden truncate px-2 py-2 tabular-nums text-ink-muted md:table-cell">{compactNumber(Number(record.dependency_count || 0))}</td><td className="hidden truncate px-2 py-2 font-semibold tabular-nums text-accent xl:table-cell">{compactNumber(Number(record.dependent_count || 0))}</td><td className="hidden truncate px-2 py-2 text-emerald-700 xl:table-cell" title={String(record.license_expression || "Not observed")}>{String(record.license_expression || "Not observed")}</td><td className="px-2 py-2 text-right"><RecordLink route={String(record.route)} onNavigate={onNavigate}><ChevronRight className="ml-auto h-4 w-4 text-accent" /></RecordLink></td></tr>; })}</tbody>
      </table>
    </div>
  </>;
}
