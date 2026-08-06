import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  Box,
  CircleDot,
  Code2,
  GitFork,
  Package,
  ShieldCheck,
} from "lucide-react";
import { CatalogPill, compactNumber } from "./CatalogVisuals";
import { humanLabel, recordDescription, valueRecord, valueRecords, type CatalogRecord } from "./CatalogRecordShared";

type Navigate = (path: string) => void;

function RecordLink({ route, onNavigate, children }: { route: string; onNavigate: Navigate; children: React.ReactNode }) {
  return <a href={route} onClick={(event) => { event.preventDefault(); onNavigate(route); }} className="font-semibold text-ink hover:text-accent">{children}</a>;
}

function MiniLine({ points, label }: { points: Array<Record<string, unknown>>; label: string }) {
  const values = points.map((point) => Number(point.value || 0));
  if (values.length < 2) return <span className="text-[9px] font-mono text-ink-muted">No trend yet</span>;
  const width = 74;
  const height = 18;
  const min = Math.min(...values);
  const range = Math.max(1, Math.max(...values) - min);
  const path = values.map((value, index) => `${index ? "L" : "M"}${((index / (values.length - 1)) * width).toFixed(1)},${(height - ((value - min) / range) * (height - 2) - 1).toFixed(1)}`).join(" ");
  return <svg viewBox={`0 0 ${width} ${height}`} className="h-[18px] w-[74px] text-accent" role="img" aria-label={`${label} trend`}><path d={path} fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

function MiniBars({ points }: { points: Array<Record<string, unknown>> }) {
  const visible = points.slice(-18);
  if (!visible.length) return <span className="text-[9px] font-mono text-ink-muted">No activity</span>;
  const max = Math.max(1, ...visible.map((point) => Number(point.count || 0)));
  return <svg viewBox="0 0 72 18" className="h-[18px] w-[72px] text-signal" role="img" aria-label="Recent commit activity">{visible.map((point, index) => { const value = Number(point.count || 0); const height = Math.max(1, value / max * 17); return <rect key={`${String(point.date)}-${index}`} x={index * 4} y={18 - height} width="2.8" height={height} fill="currentColor" />; })}</svg>;
}

function RepositoryMobileCard({ record, onNavigate }: { record: CatalogRecord; onNavigate: Navigate }) {
  const metrics = valueRecord(record.metrics);
  return <article className="catalog-density-card space-y-3 rounded-xl border border-[var(--color-border-soft)] bg-white p-4 shadow-sm">
    <div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[3px] border border-emerald-200 bg-emerald-50 text-emerald-700"><Code2 className="h-4 w-4" /></span><div className="min-w-0 flex-1"><RecordLink route={String(record.route)} onNavigate={onNavigate}>{String(record.owner)}/{String(record.name)}</RecordLink><p className="mt-1 line-clamp-2 text-[11px] text-ink-muted">{recordDescription(record)}</p></div></div>
    <dl className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono"><div><dt className="text-ink-muted">Stars</dt><dd className="font-bold text-ink">{compactNumber(Number(metrics.stars || 0))}</dd></div><div><dt className="text-ink-muted">Forks</dt><dd className="font-bold text-ink">{compactNumber(Number(metrics.forks || 0))}</dd></div><div><dt className="text-ink-muted">Packages</dt><dd className="font-bold text-ink">{Number(record.package_count || 0).toLocaleString()}</dd></div></dl>
    <div className="flex items-center justify-between">{record.ssot_governed ? <CatalogPill tone="accent" Icon={ShieldCheck}>SSOT governed</CatalogPill> : <span />}<RecordLink route={String(record.route)} onNavigate={onNavigate}><span className="inline-flex items-center gap-1 text-[10px] font-mono text-accent">Inspect <ArrowRight className="h-3 w-3" /></span></RecordLink></div>
  </article>;
}

export function RepositoryCollectionTable({ records, onNavigate }: { records: CatalogRecord[]; onNavigate: Navigate }) {
  return <>
    <div className="grid gap-3 lg:hidden">{records.map((record) => <RepositoryMobileCard key={record.id} record={record} onNavigate={onNavigate} />)}</div>
    <div className="hidden overflow-x-auto rounded-xl border border-[var(--color-border-soft)] bg-white shadow-sm lg:block">
      <table className="catalog-density-table w-full min-w-[74rem] table-fixed border-collapse text-left text-xs" aria-label="Repository catalog records">
        <thead className="bg-canvas text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted"><tr><th className="w-[20%] px-4 py-3">Repository</th><th className="w-[12%] px-3 py-3">Organization</th><th className="w-[12%] px-3 py-3">Stars &amp; Trend</th><th className="w-[8%] px-3 py-3">Forks</th><th className="w-[13%] px-3 py-3">30-Day Commits</th><th className="w-[8%] px-3 py-3">Packages</th><th className="w-[12%] px-3 py-3">Latest Release</th><th className="w-[10%] px-3 py-3">Governance</th><th className="w-[5%] px-4 py-3 text-right">Action</th></tr></thead>
        <tbody className="divide-y divide-[var(--color-border-soft)] font-mono">{records.map((record) => { const metrics = valueRecord(record.metrics); const history = valueRecord(record.history); return <tr key={record.id} className="group hover:bg-canvas"><td className="px-4 py-3.5 align-top"><div className="flex gap-2.5"><span className="mt-0.5 text-violet-700"><Code2 className="h-4 w-4" /></span><div className="min-w-0"><RecordLink route={String(record.route)} onNavigate={onNavigate}>{String(record.name)}</RecordLink><p className="mt-1 line-clamp-1 text-xs font-sans text-ink-muted">{recordDescription(record)}</p></div></div></td><td className="px-3 py-3.5 text-ink-muted">{String(record.owner || "Not recorded")}</td><td className="px-3 py-3.5"><strong className="block tabular-nums text-ink">{compactNumber(Number(metrics.stars || 0))}</strong><MiniLine points={valueRecords(history.stars)} label="Stars" /></td><td className="px-3 py-3.5"><span className="inline-flex items-center gap-1 font-semibold tabular-nums"><GitFork className="h-3 w-3 text-ink-muted" />{compactNumber(Number(metrics.forks || 0))}</span></td><td className="px-3 py-3.5"><strong className="block tabular-nums">{compactNumber(Number(metrics.commits || 0))}</strong><MiniBars points={valueRecords(record.commit_activity)} /></td><td className="px-3 py-3.5 font-semibold text-accent">{Number(record.package_count || 0).toLocaleString()}</td><td className="px-3 py-3.5"><span className="rounded border border-[var(--color-border-soft)] bg-surface px-2 py-0.5 text-[11px]">{String(record.latest_release || "Not observed")}</span></td><td className="px-3 py-3.5">{record.ssot_governed ? <CatalogPill tone="accent" Icon={ShieldCheck}>Governed</CatalogPill> : <span className="text-xs text-ink-muted">Not observed</span>}</td><td className="px-4 py-3.5 text-right"><RecordLink route={String(record.route)} onNavigate={onNavigate}><ArrowRight className="ml-auto h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" /></RecordLink></td></tr>; })}</tbody>
      </table>
    </div>
  </>;
}

function PublicationBadge({ record }: { record: CatalogRecord }) {
  const published = record.published || record.publication_status === "published";
  return <CatalogPill tone={published ? "accent" : "neutral"} Icon={published ? BadgeCheck : CircleDot}>{published ? "Published" : humanLabel(String(record.publication_status || "Candidate"))}</CatalogPill>;
}

function PackageMobileCard({ record, onNavigate }: { record: CatalogRecord; onNavigate: Navigate }) {
  const repository = valueRecords(record.repositories)[0] || {};
  return <article className="catalog-density-card min-w-0 space-y-3 rounded-xl border border-[var(--color-border-soft)] bg-white p-4 shadow-sm"><div className="flex min-w-0 items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-orange-200 bg-orange-50 text-orange-700"><Box className="h-4 w-4" /></span><div className="min-w-0 flex-1"><RecordLink route={String(record.route)} onNavigate={onNavigate}>{String(record.name)}</RecordLink><p className="mt-1 break-words text-xs font-mono text-ink-muted">{humanLabel(String(record.ecosystem || "unknown"))} · {repository.owner ? `${String(repository.owner)}/${String(repository.name)}` : "Repository not linked"}</p></div><PublicationBadge record={record} /></div><dl className="flex min-w-0 flex-wrap gap-x-6 gap-y-2 text-xs font-mono"><div className="min-w-0"><dt className="text-ink-muted">Latest</dt><dd className="break-words font-bold text-ink">{String(record.latest_version || "Not recorded")}</dd></div><div><dt className="text-ink-muted">Dependencies</dt><dd className="font-bold text-ink">{Number(record.dependency_count || 0).toLocaleString()}</dd></div><div className="min-w-0"><dt className="text-ink-muted">License</dt><dd className="break-words font-bold text-ink">{String(record.license_expression || "Not observed")}</dd></div></dl></article>;
}

export function PackageCollectionTable({ records, onNavigate }: { records: CatalogRecord[]; onNavigate: Navigate }) {
  return <>
    <div className="grid gap-3 lg:hidden">{records.map((record) => <PackageMobileCard key={record.id} record={record} onNavigate={onNavigate} />)}</div>
    <div className="hidden overflow-x-auto rounded-xl border border-[var(--color-border-soft)] bg-white shadow-sm lg:block">
      <table className="catalog-density-table w-full min-w-[74rem] table-fixed border-collapse text-left text-xs" aria-label="Package catalog records"><thead className="bg-canvas text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted"><tr><th className="w-[18%] px-4 py-3">Package Name</th><th className="w-[9%] px-3 py-3">Ecosystem</th><th className="w-[18%] px-3 py-3">Owning Repository</th><th className="w-[14%] px-3 py-3">Kind / Publication</th><th className="w-[12%] px-3 py-3">Latest Version</th><th className="w-[9%] px-3 py-3">Dependencies</th><th className="w-[8%] px-3 py-3">Dependents</th><th className="w-[9%] px-3 py-3">License</th><th className="w-[3%] px-4 py-3"><span className="sr-only">Action</span></th></tr></thead><tbody className="divide-y divide-[var(--color-border-soft)] font-mono">{records.map((record) => { const repository = valueRecords(record.repositories)[0] || {}; return <tr key={record.id} className="group hover:bg-canvas"><td className="px-4 py-3.5"><div className="flex items-center gap-2"><Package className="h-3.5 w-3.5 shrink-0 text-orange-600" /><RecordLink route={String(record.route)} onNavigate={onNavigate}>{String(record.name)}</RecordLink></div></td><td className="px-3 py-3.5"><span className="rounded border border-[var(--color-border-soft)] bg-surface px-2 py-0.5 text-[11px]">{String(record.ecosystem || "unknown")}</span></td><td className="break-words px-3 py-3.5 text-violet-700">{repository.owner ? `${String(repository.owner)}/${String(repository.name)}` : "Not linked"}</td><td className="px-3 py-3.5"><PublicationBadge record={record} /></td><td className="px-3 py-3.5 font-bold tabular-nums">{String(record.latest_version || "Not recorded")}</td><td className="px-3 py-3.5 tabular-nums text-ink-muted">{Number(record.dependency_count || 0).toLocaleString()}</td><td className="px-3 py-3.5 font-semibold tabular-nums text-accent">{Number(record.dependent_count || 0).toLocaleString()}</td><td className="break-words px-3 py-3.5 text-emerald-700">{String(record.license_expression || "Not observed")}</td><td className="px-4 py-3.5"><RecordLink route={String(record.route)} onNavigate={onNavigate}><ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" /></RecordLink></td></tr>; })}</tbody></table>
    </div>
  </>;
}
