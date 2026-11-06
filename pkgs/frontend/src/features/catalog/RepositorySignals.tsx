import { Eye, GitCommitHorizontal, GitFork, Star, Users } from "lucide-react";
import type { RepositorySignals } from "../../api/catalog";
import { InlineMetricChart } from "./InlineMetricChart";

const definitions = [{ key: "stars", label: "Stars", Icon: Star }, { key: "forks", label: "Forks", Icon: GitFork }, { key: "watchers", label: "Watchers", Icon: Eye }, { key: "contributors", label: "Contributors", Icon: Users }] as const;
export function RepositorySignalStrip({ signals, compact = false }: { signals?: RepositorySignals | null; compact?: boolean }) {
  if (!signals || !signals.repository_count) return null;
  return <div className={`grid grid-cols-2 ${compact ? "" : "sm:grid-cols-5"} gap-3 border-y border-[var(--color-border-soft)] py-3`}>
    {definitions.map(({ key, label, Icon }) => <div key={key} className="min-w-0"><div className="type-body-sm flex flex-wrap items-center justify-between gap-1"><span className="inline-flex min-w-0 max-w-full items-center gap-1 text-ink-muted [overflow-wrap:anywhere]"><Icon className="h-3 w-3 shrink-0 text-accent" />{label}</span><strong className="tabular-nums">{Number(signals.metrics[key] || 0).toLocaleString()}</strong></div><InlineMetricChart label={label} points={(signals.history[key] || []).map((point) => ({ label: point.observed_at, value: point.value }))} expanded /></div>)}
    <div className="min-w-0"><div className="type-body-sm flex items-center gap-1"><GitCommitHorizontal className="h-3 w-3 text-signal" />Daily commits</div><InlineMetricChart label="Daily commits" bars expanded points={(signals.commit_activity || []).map((point) => ({ label: point.date, value: point.count }))} /></div>
  </div>;
}
