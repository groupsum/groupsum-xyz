import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEntityMetrics } from "../../api/catalog";
import { useCatalogVersion } from "../../api/catalog-version";
import { DetailRows, formatDate, humanLabel, monthlyReleaseActivity, valueRecord, valueRecords, type CatalogRecord, type TimelinePoint } from "./CatalogRecordShared";
import { RepositoryDisclosure } from "./RepositoryDetailEvidence";
import { TrendDelta } from "./TrendDelta";

const keys = ["stars", "forks", "watchers", "contributors"];
type Sample = { date: string; time: number; value: number };

function samples(rows: Record<string, unknown>[]): Sample[] {
  const byTime = new Map<number, Sample>();
  for (const row of rows) {
    const date = String(row.observed_at || "");
    const time = Date.parse(date);
    const value = row.numeric_value ?? row.value;
    if (typeof value === "number" && Number.isFinite(value) && Number.isFinite(time)) byTime.set(time, { date, time, value });
  }
  return [...byTime.values()].sort((a, b) => a.time - b.time);
}

function ObservedSteps({ points, start, end, label }: { points: Sample[]; start: number; end: number; label: string }) {
  if (!points.length) return <span className="text-ink-muted">—</span>;
  const low = Math.min(...points.map((p) => p.value));
  const high = Math.max(...points.map((p) => p.value));
  const x = (time: number) => end > start ? 4 + (time - start) * 232 / (end - start) : 120;
  const y = (value: number) => high > low ? 24 - (value - low) * 20 / (high - low) : 14;
  const path = points.map((p, i) => i ? `H${x(p.time)}V${y(p.value)}` : `M${x(p.time)},${y(p.value)}`).join(" ");
  return <details className="min-w-0">
    <summary className="cursor-pointer text-accent" aria-label={`Exact observations for ${label}`}>
      <svg viewBox="0 0 240 28" className="inline-block h-7 w-[calc(100%-1rem)] max-w-60 align-middle" aria-hidden="true">
        <path d={path} fill="none" stroke="currentColor" strokeWidth="1" />
        {points.map((p) => <circle key={p.time} cx={x(p.time)} cy={y(p.value)} r="2" fill="currentColor"><title>{formatDate(p.date)}: {p.value.toLocaleString()}</title></circle>)}
      </svg>
    </summary>
    <ul className="max-h-44 overflow-y-auto type-caption">{points.map((p) => <li key={p.time}>{formatDate(p.date)} · {p.value.toLocaleString()}</li>)}</ul>
  </details>;
}

function ReleaseSparkline({ label, calendar, points, max }: { label: string; calendar: string[]; points: TimelinePoint[]; max: number }) {
  const [active, setActive] = useState<TimelinePoint | null>(null);
  const counts = new Map(points.map((point) => [point.month, point.count]));
  const readout = ({ month, count }: TimelinePoint) => `${month} · ${count.toLocaleString()} ${count === 1 ? "release" : "releases"}`;
  return <div role="group" aria-label={`${label} by month`} className="relative flex h-8 min-w-0 gap-px text-signal"
    onPointerLeave={(event) => { if (!event.currentTarget.contains(document.activeElement)) setActive(null); }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActive(null); }}
    onKeyDown={(event) => { if (event.key === "Escape" && active) { event.stopPropagation(); setActive(null); } }}>
    {calendar.map((month) => {
      const count = counts.get(month);
      if (!count) return <span key={month} className="min-w-0 flex-1" aria-hidden="true" />;
      const point = { month, count };
      return <button key={month} type="button" aria-label={readout(point)}
        className="flex min-w-0 flex-1 cursor-pointer items-end rounded-sm hover:bg-[var(--color-signal-soft)] focus-visible:bg-[var(--color-signal-soft)]"
        onPointerEnter={() => setActive(point)} onFocus={() => setActive(point)} onClick={() => setActive(point)}>
        <span aria-hidden="true" className="w-full rounded-t-sm bg-current" style={{ height: `${Math.max(5, count / max * 100)}%` }} />
      </button>;
    })}
    {active && <span role="tooltip" className="pointer-events-none absolute right-0 bottom-full z-20 max-w-full rounded border border-[var(--color-border-soft)] bg-surface-raised px-2 py-1 type-caption text-ink shadow-lg">{readout(active)}</span>}
  </div>;
}

function ReleaseActivity({ record }: { record: CatalogRecord }) {
  const github = monthlyReleaseActivity(valueRecords(record.github_releases));
  const registry = new Map<string, number>();
  for (const pkg of valueRecords(record.packages)) for (const point of valueRecords(pkg.release_activity)) {
    if (typeof point.month === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(point.month) && Number(point.count) > 0)
      registry.set(point.month, (registry.get(point.month) || 0) + Number(point.count));
  }
  const series: [string, TimelinePoint[]][] = [["GitHub releases", github], ["Package-registry releases", [...registry].map(([month, count]) => ({ month, count }))]];
  const months = [...new Set(series.flatMap(([, values]) => values.map((p) => p.month)))].sort();
  const latest = months.at(-1);
  const calendar = latest ? Array.from({ length: 24 }, (_, index) => {
    const date = new Date(`${latest}-01T00:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() - 23 + index);
    return date.toISOString().slice(0, 7);
  }).filter((month) => month >= months[0]) : [];
  const shown = series.map(([label, points]) => [label, points.filter((p) => calendar.includes(p.month)).sort((a, b) => a.month.localeCompare(b.month))] as const);
  const max = Math.max(1, ...shown.flatMap(([, points]) => points.map((p) => p.count)));
  return <section id="release-activity" className="space-y-2">
    <h3 className="font-serif text-lg font-bold">Release activity</h3>
    {calendar.length > 0 && <p className="type-caption text-ink-muted">{calendar[0]} to {calendar.at(-1)} · UTC · Dated releases observed</p>}
    {shown.map(([label, points]) => <div key={label} className="grid gap-x-4 gap-y-1 border-t border-[var(--color-border-soft)] py-2 sm:grid-cols-[12rem_minmax(0,1fr)]">
      <span className="type-body-sm font-semibold">{label}</span>
      {points.length ? <ReleaseSparkline label={label} calendar={calendar} points={points} max={max} />
        : <p className="type-body-sm text-ink-muted">No dated releases observed in {calendar.length ? "this window" : "the catalog"}.</p>}
    </div>)}
  </section>;
}

export function RepositoryActivity({ record }: { record: CatalogRecord }) {
  const version = useCatalogVersion();
  const pin = String(record.cache_snapshot_id || "");
  const history = useQuery({
    queryKey: ["repository-metrics", record.id, pin],
    enabled: Boolean(pin && pin === version.snapshot_id),
    queryFn: ({ signal }) => getEntityMetrics("source.repository", record.id, AbortSignal.any([signal, AbortSignal.timeout(15_000)])),
    staleTime: 60_000, retry: false,
  });
  const metrics = valueRecord(record.metrics);
  const observed = record.observed_at || "";
  const cutoff = Date.parse(observed || (version.collected_at || "").replace(" ", "T").replace(/(\d{2}:\d{2}:\d{2})$/, "$1Z"));
  const series = keys.map((key) => {
    const persisted = valueRecords(history.data?.points).filter((p) => p.metric_key === key && (
      p.snapshot_id === pin || (Number.isFinite(cutoff) && Date.parse(String(p.observed_at)) <= cutoff)
    ));
    return samples(persisted.length ? persisted : valueRecords(valueRecord(record.history)[key]));
  });
  const times = series.flatMap((points) => points.map((p) => p.time));
  const start = Math.min(...times), end = Math.max(...times);
  const extra = Object.entries(metrics).filter(([key, value]) => ![...keys, "commits", "relationships"].includes(key) && typeof value === "number");
  return <section id="observed-activity" className="space-y-4">
    <h2 className="font-serif text-xl font-bold">Observed activity</h2>
    <div className="flex flex-wrap justify-between gap-2 type-body-sm"><h3 className="font-semibold">Repository totals</h3>{times.length > 0 && <p className="text-ink-muted">{formatDate(new Date(start).toISOString())}{start !== end ? ` – ${formatDate(new Date(end).toISOString())}` : ""} · UTC</p>}</div>
    <table className="w-full table-fixed text-left type-record-table">
      <thead><tr className="text-ink-muted"><th scope="col" className="w-[30%] py-2">Metric</th><th scope="col" className="w-[17%] py-2">Latest</th><th scope="col" className="w-[19%] py-2">Change</th><th scope="col" className="py-2">Observed history</th></tr></thead>
      <tbody className="divide-y divide-[var(--color-border-soft)]">{keys.map((key, index) => {
        const points = series[index];
        const latest = typeof metrics[key] === "number" ? metrics[key] : points.at(-1)?.value;
        return <tr key={key}><th scope="row" className="py-2 pr-1 font-semibold">{humanLabel(key)}</th><td className="py-2 tabular-nums">{latest?.toLocaleString() ?? "—"}</td><td className="py-2"><TrendDelta value={points.length > 1 ? points.at(-1)!.value - points[0].value : undefined} description={points.length > 1 ? "change across observed history" : "Not enough observed history"} /></td><td className="py-2"><ObservedSteps label={humanLabel(key)} points={points} start={start} end={end} /></td></tr>;
      })}</tbody>
    </table>
    {history.isFetching && !times.length && <p role="status" className="type-caption text-ink-muted">Loading observed history…</p>}
    {history.isError && <p className="type-caption text-ink-muted">Additional history could not be loaded. <button className="text-accent underline" onClick={() => history.refetch()}>Retry</button></p>}
    <ReleaseActivity record={record} />
    {extra.length > 0 && <RepositoryDisclosure label="More repository metrics"><DetailRows rows={extra.map(([key, value]) => [humanLabel(key), Number(value).toLocaleString()])} /></RepositoryDisclosure>}
  </section>;
}
