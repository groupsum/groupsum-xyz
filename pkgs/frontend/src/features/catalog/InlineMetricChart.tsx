import { useId, useState } from "react";

export type ChartPoint = { label: string; value: number };

/** One keyboard stop per chart, with exact data available to touch and assistive users. */
export function InlineMetricChart({ points, label, bars = false }: {
  points: ChartPoint[]; label: string; bars?: boolean;
}) {
  const id = useId();
  const [active, setActive] = useState<number | null>(null);
  const valid = points.filter((point) => Number.isFinite(point.value));
  if (valid.length < (bars ? 1 : 2)) return <span className="type-body-sm text-ink-muted">{valid.length ? "1 observation" : "Not observed"}</span>;
  const width = 116, height = 24;
  const min = bars ? 0 : Math.min(...valid.map((point) => point.value));
  const max = Math.max(min + 1, ...valid.map((point) => point.value));
  const y = (value: number) => height - 2 - (value - min) / (max - min) * (height - 4);
  const x = (index: number) => 2 + index / Math.max(1, valid.length - 1) * (width - 4);
  const total = valid.reduce((sum, point) => sum + point.value, 0);
  const selected = valid[active ?? valid.length - 1];
  return <details className="inline-chart relative min-w-0">
    <summary className="cursor-pointer list-none text-accent [&::-webkit-details-marker]:hidden" aria-label={`Inspect ${label}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-6 w-full max-w-32" role="img" aria-labelledby={`${id}-title`}>
        <title id={`${id}-title`}>{label}: {bars ? `${total.toLocaleString()} total` : `${valid.at(-1)!.value.toLocaleString()} latest`}; {valid.length} observations. Open for values.</title>
        {bars ? valid.map((point, index) => <rect key={index} x={index * width / valid.length} y={y(point.value)} width={Math.max(.5, width / valid.length - 1)} height={Math.max(1, height - y(point.value))} fill="var(--chart-2)" onPointerEnter={() => setActive(index)}><title>{point.label}: {point.value.toLocaleString()}</title></rect>) : <path d={valid.map((point, index) => `${index ? "L" : "M"}${x(index)},${y(point.value)}`).join(" ")} stroke="var(--chart-1)" strokeWidth="1.5" fill="none" />}
      </svg>
      <span className="block truncate text-[10px] text-ink-muted">{bars ? `${total.toLocaleString()} / ${valid.length}d` : `${valid.length} observations`}</span>
    </summary>
    <div className="chart-inspector absolute right-0 z-30 w-56 max-w-[calc(100vw-2rem)] border border-[var(--color-border-soft)] bg-surface-raised p-2 shadow-lg">
      <label className="type-body-sm block text-ink">{label}
        <input type="range" className="block w-full" min="0" max={valid.length - 1} value={active ?? valid.length - 1} onChange={(event) => setActive(Number(event.target.value))} aria-label={`${label} observation`} aria-valuetext={`${selected.label}: ${selected.value.toLocaleString()}`} />
      </label>
      <output className="type-technical block text-ink" aria-live="polite">{selected.label}: {selected.value.toLocaleString()}</output>
      <details><summary className="type-control text-accent">All observations</summary>
        <table className="w-full text-left text-xs" aria-label={`${label} observations`}><thead><tr><th scope="col">Observed</th><th scope="col">Value</th></tr></thead><tbody>{valid.map((point, index) => <tr key={index}><td>{point.label}</td><td className="text-right tabular-nums">{point.value.toLocaleString()}</td></tr>)}</tbody></table>
      </details>
    </div>
  </details>;
}
