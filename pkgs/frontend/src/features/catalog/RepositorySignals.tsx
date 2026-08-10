import React from "react";
import { Eye, GitCommitHorizontal, GitFork, Star, Users } from "lucide-react";
import type { CommitActivityPoint, MetricPoint, RepositorySignals } from "../../api/catalog";

function compactNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function LineSparkline({ points, label }: { points: MetricPoint[]; label: string }) {
  const width = 116;
  const height = 24;
  const padding = 2;
  if (points.length === 0) {
    return <span className="block h-6 text-[9px] font-mono text-ink-muted/70 pt-1">Awaiting another persisted observation</span>;
  }
  const values = points.map((point) => point.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = Math.max(1, maximum - minimum);
  const coordinates = points.map((point, index) => ({
    x: points.length === 1 ? width / 2 : padding + (index / (points.length - 1)) * (width - padding * 2),
    y: height - padding - ((point.value - minimum) / range) * (height - padding * 2),
  }));
  const path = coordinates.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const delta = points.length > 1 ? points.at(-1)!.value - points[0].value : null;
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-6 w-full text-accent" role="img" aria-label={`${label} persisted observation trend`}>
        <title>{`${label} across ${points.length} persisted daily observations`}</title>
        {points.length > 1 ? <path d={path} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /> : null}
        {coordinates.map((point, index) => <circle key={points[index].observed_at} cx={point.x} cy={point.y} r={points.length === 1 ? 2 : 1.25} fill="currentColor" />)}
      </svg>
      <span className="block text-[9px] font-mono text-ink-muted">
        {delta === null ? "1 persisted observation" : `${delta >= 0 ? "+" : ""}${compactNumber(delta)} across ${points.length} observations`}
      </span>
    </div>
  );
}

function CommitBars({ points }: { points: CommitActivityPoint[] }) {
  if (points.length === 0) {
    return <span className="block h-6 text-[9px] font-mono text-ink-muted/70 pt-1">No persisted daily activity</span>;
  }
  const width = 116;
  const height = 24;
  const gap = 1;
  const maximum = Math.max(1, ...points.map((point) => point.count));
  const barWidth = Math.max(1, (width - gap * (points.length - 1)) / points.length);
  const total = points.reduce((sum, point) => sum + point.count, 0);
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-6 w-full text-signal" role="img" aria-label="Daily commit activity bar chart">
        <title>{`${total} commits across the persisted ${points.length}-day window`}</title>
        {points.map((point, index) => {
          const barHeight = point.count === 0 ? 1 : Math.max(2, (point.count / maximum) * (height - 2));
          return <rect key={point.date} x={index * (barWidth + gap)} y={height - barHeight} width={barWidth} height={barHeight} rx="0.6" fill="currentColor" aria-label={`${point.date}: ${point.count} commits`} />;
        })}
      </svg>
      <span className="block text-[9px] font-mono text-ink-muted">{compactNumber(total)} commits · {points.length} days</span>
    </div>
  );
}

const metricDefinitions = [
  { key: "stars", label: "Stars", Icon: Star },
  { key: "forks", label: "Forks", Icon: GitFork },
  { key: "watchers", label: "Watchers", Icon: Eye },
  { key: "contributors", label: "Contributors", Icon: Users },
] as const;

export function RepositorySignalStrip({ signals, compact = false }: { signals?: RepositorySignals | null; compact?: boolean }) {
  if (!signals || signals.repository_count === 0) return null;
  return (
    <div className={`grid grid-cols-2 ${compact ? "" : "sm:grid-cols-5"} gap-x-4 gap-y-3 border-y border-[var(--color-border-soft)] py-3`}>
      {metricDefinitions.map(({ key, label, Icon }) => (
        <div key={key} className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wide text-ink-muted"><Icon className="h-3 w-3 text-accent" aria-hidden="true" />{label}</span>
            <strong className="font-serif text-lg text-ink">{compactNumber(signals.metrics[key] || 0)}</strong>
          </div>
          <LineSparkline points={signals.history[key] || []} label={label} />
        </div>
      ))}
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wide text-ink-muted"><GitCommitHorizontal className="h-3 w-3 text-signal" aria-hidden="true" />Commits</span>
          <strong className="font-serif text-lg text-ink">{compactNumber(signals.metrics.commits || 0)}</strong>
        </div>
        <CommitBars points={signals.commit_activity || []} />
      </div>
    </div>
  );
}
