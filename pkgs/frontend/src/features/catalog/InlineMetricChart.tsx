import { lazy, Suspense, useId, useRef, useState } from "react";
import { observationSeries } from "./activity-series.mjs";
const ActivityInspector = lazy(() => import("./ActivityInspector"));
export type ChartPoint = { label: string; value: number };

export function ActivityMarks({ points, bars = false, active, onSelect, large = false }: {
  points: ReturnType<typeof observationSeries>; bars?: boolean; active?: number; onSelect?: (index: number) => void; large?: boolean;
}) {
  const width = 300, height = large ? 90 : 28;
  const minimum = bars ? Math.min(0, ...points.map((point) => point.value)) : Math.min(...points.map((point) => point.value));
  const maximum = Math.max(minimum + 1, ...points.map((point) => point.value));
  const y = (value: number) => height - 3 - (value - minimum) / (maximum - minimum) * (height - 6);
  const start = points[0]?.time || 0, end = points.at(-1)?.time || start;
  const x = (time: number) => end === start ? width / 2 : 3 + (time - start) / (end - start) * (width - 6);
  const barWidth = Math.max(1, Math.min(8, (width - 6) / Math.max(1, (end - start) / 86400000 + 1) * .7));
  return <svg viewBox={`0 0 ${width} ${height}`} className={`block w-full ${large ? "h-24" : "h-7 max-w-32"}`} aria-hidden="true" onPointerMove={onSelect ? (event) => { const box = event.currentTarget.getBoundingClientRect(); const time = start + Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)) * (end - start); let nearest = 0; points.forEach((point, index) => { if (Math.abs(point.time - time) < Math.abs(points[nearest].time - time)) nearest = index; }); onSelect(nearest); } : undefined}>
    {bars && <line x1="0" x2={width} y1={y(0)} y2={y(0)} stroke="var(--color-border-soft)" />}
    {points.map((point, index) => bars ? <rect key={point.time} x={x(point.time) - barWidth / 2} y={point.value >= 0 ? y(point.value) : y(0)} width={barWidth} height={point.value === 0 ? 1 : Math.max(1, Math.abs(y(point.value) - y(0)))} fill={point.value < 0 ? "var(--chart-1)" : "var(--chart-2)"} opacity={active === undefined || active === index ? 1 : .5} /> : <line key={point.time} x1={x(point.time)} x2={x(point.time)} y1={y(point.value) - 2} y2={y(point.value) + 2} stroke="var(--chart-1)" strokeWidth={active === index ? 3 : 1.5} />)}
  </svg>;
}

export function InlineMetricChart({ points, label, bars = false, expanded = false, compact = false }: { points: ChartPoint[]; label: string; bars?: boolean; expanded?: boolean; compact?: boolean }) {
  const id = useId(); const anchor = useRef<HTMLButtonElement>(null); const [open, setOpen] = useState(false); const [active, setActive] = useState<number>();
  const valid = observationSeries(points, 30);
  if (!valid.length) return compact && !bars ? null : <span className="type-body-sm text-ink-muted">Not observed</span>;
  const delta = valid.length > 1 ? valid.at(-1)!.value - valid[0].value : null;
  const selected = active === undefined ? null : valid[Math.min(active, valid.length - 1)];
  const total = valid.reduce((sum, point) => sum + point.value, 0);
  const summary = bars ? `${total.toLocaleString()} commits · ${valid.length} observed days` : delta === null ? "1 observation" : `${delta >= 0 ? "+" : ""}${delta.toLocaleString()} · ${valid.length} observations`;
  return <div className="min-w-0"><button ref={anchor} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} aria-label={`Inspect ${label}`} title={`${label}: ${valid.at(-1)!.value}; ${summary}`} onClick={() => setOpen(true)} onFocus={() => setActive(valid.length - 1)} onBlur={() => setActive(undefined)} onPointerLeave={() => setActive(undefined)} className="block min-h-8 w-full min-w-0 text-left text-accent">
    <ActivityMarks points={valid} bars={bars} onSelect={setActive} /><span className={compact ? "block text-[10px] leading-tight text-ink-muted" : "type-body-sm block truncate text-ink-muted"}>{selected ? `${new Date(selected.time).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}: ${selected.value.toLocaleString()}` : compact ? (bars ? `${total.toLocaleString()} commits · ${valid.length}d obs.` : delta === null ? "1 obs." : `${delta >= 0 ? "+" : ""}${delta.toLocaleString()} · ${valid.length} obs.`) : summary}</span>
  </button>{open && <Suspense fallback={<span role="status">Loading activity…</span>}><ActivityInspector id={id} anchor={anchor} label={label} points={points} bars={bars} expanded={expanded} initialTime={selected?.time ?? valid.at(-1)!.time} onClose={() => setOpen(false)} /></Suspense>}</div>;
}
