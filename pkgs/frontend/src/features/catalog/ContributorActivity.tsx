import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { catalogFetch } from "../../api/client";
import { CatalogLink } from "./CatalogLink";

type Evidence = { label: string; url: string };
type Cell = { count: number; complete: boolean };
type Activity = {
  weeks?: string[];
  repositories?: { name: string; route: string; cells: Cell[] }[];
  through?: string;
  identity_linked: boolean;
  commit_count: number;
  achievements: { id: string; label: string; reason: string; at?: string; evidence: Evidence[] }[];
};
export type ActivitySelection = Cell & { repository: string; week: string };
type Timeline = { page: number; page_count: number; records: { id: string; label: string; at: string; url: string }[] };
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const date = (value: string) => day.format(new Date(value));
const badge = "type-control inline-flex min-h-8 max-w-full flex-wrap items-center gap-x-2 rounded-full border border-[var(--color-border-muted)] px-3 py-1 text-signal [overflow-wrap:anywhere]";
const button = "min-h-9 rounded border border-[var(--color-border-soft)] px-2 text-accent focus-visible:outline disabled:opacity-50";

async function read<T>(path: string, params: Record<string, string>, snapshotId: string, signal: AbortSignal): Promise<T> {
  const response = await catalogFetch(`${path}?${new URLSearchParams(params)}`, { signal });
  if (!response.ok) throw new Error(`Contributor activity request failed (${response.status})`);
  if (response.headers.get("X-Catalog-Snapshot") !== snapshotId) throw new Error("Contributor activity snapshot changed");
  return response.json();
}

export function useContributorActivity(provider: string, login: string, snapshotId: string, enabled: boolean) {
  const path = `/api/v1/contributors/${encodeURIComponent(provider)}/${encodeURIComponent(login)}`;
  const activity = useQuery({ queryKey: ["contributor-activity", path, snapshotId], queryFn: ({ signal }) => read<Activity>(path, { activity: "1" }, snapshotId, signal), enabled, staleTime: Infinity, retry: false });
  return { ...activity, path };
}

function weekLabel(week: string, cell?: Cell) {
  const count = cell?.count ?? 0;
  return `Week of ${date(week)}: ${cell?.complete || count ? `${count} observed commits${cell?.complete ? "" : " (partial coverage)"}` : "not fully observed"}`;
}

export function ContributorCommitSparkline({ model }: { model: Activity }) {
  const weeks = model.weeks ?? [];
  const repositories = model.repositories ?? [];
  if (!model.identity_linked || !weeks.length || !repositories.length) {
    return <p className="type-body-sm text-ink-muted">{model.identity_linked ? "No linked commit history in this snapshot." : "Commits cannot be attributed to an anonymous profile."}</p>;
  }
  const totals = weeks.map((_, i) => ({
    count: repositories.reduce((sum, repo) => sum + (repo.cells[i]?.count ?? 0), 0),
    complete: repositories.every((repo) => repo.cells[i]?.complete === true),
  }));
  const max = Math.max(1, ...totals.map((cell) => cell.count));
  return <section aria-label="Weekly commit activity" className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
    <svg width={weeks.length * 10} height="24" viewBox={`0 0 ${weeks.length * 10} 24`} role="img"
      aria-label={weeks.map((week, i) => weekLabel(week, totals[i])).join("; ")} className="max-w-full text-signal">
      {totals.map((cell, i) => {
        const height = cell.count ? 3 + 19 * cell.count / max : 2;
        return <rect key={weeks[i]} x={i * 10 + 1} y={23 - height} width="6" height={height} rx="0.5"
          fill={cell.complete || cell.count ? "currentColor" : "none"} stroke={cell.complete ? "none" : "currentColor"}
          strokeDasharray={cell.complete ? undefined : "1 2"} opacity={cell.complete ? 1 : 0.6}>
          <title>{weekLabel(weeks[i], cell)}</title>
        </rect>;
      })}
    </svg>
    <p className="type-body-sm text-ink-muted"><strong>{model.commit_count.toLocaleString()} observed commits</strong> · {date(weeks[0])}{model.through && `–${date(model.through)}`} UTC</p>
  </section>;
}

export function ContributorAchievements({ model }: { model: Activity }) {
  if (!model.achievements.length) return null;
  return <section aria-labelledby="achievements-heading" className="space-y-2">
    <h2 id="achievements-heading" className="type-ui-label text-ink-muted">Achievements</h2>
    <ul className="flex flex-wrap gap-2">{model.achievements.map((item) => {
      const tooltipId = `achievement-${item.id}`;
      const href = item.id === "multi-repo" ? "#contributor-repositories" : item.evidence[0]?.url;
      const className = badge + " hover:underline focus-visible:outline";
      return <li key={item.id} className="group relative min-w-0 max-w-full">
        {href?.startsWith("/") ? <CatalogLink href={href} className={className} aria-describedby={tooltipId}>{item.label}</CatalogLink>
          : href ? <a href={href} className={className} aria-describedby={tooltipId} target={href.startsWith("#") ? undefined : "_blank"} rel="noreferrer">{item.label}</a>
          : <span className={className} aria-describedby={tooltipId} tabIndex={0}>{item.label}</span>}
        <span id={tooltipId} role="tooltip" className="type-body-sm invisible absolute inset-x-0 top-full z-20 rounded border border-[var(--color-border-muted)] bg-surface-raised px-2 py-1 text-ink shadow-lg group-hover:visible group-focus-within:visible">
          {item.reason}{item.at && <> · <time dateTime={item.at}>{date(item.at)}</time></>}
        </span>
      </li>;
    })}</ul>
  </section>;
}

export function ContributorHeatstrip({ repository, weeks, cells, peak, onSelect }: {
  repository: string; weeks: string[]; cells?: Cell[]; peak: number; onSelect: (selection: ActivitySelection) => void;
}) {
  const [focus, setFocus] = useState(0);
  if (!weeks.length) return <span className="text-ink-muted">—</span>;
  return <div role="group" aria-label={`${repository} weekly commit activity`} className="grid w-full max-w-64 gap-px sm:gap-1"
    style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
    {weeks.map((week, i) => {
      const cell = cells?.[i] ?? { count: 0, complete: false };
      const label = weekLabel(week, cell);
      return <button key={week} type="button" tabIndex={i === focus ? 0 : -1} aria-label={label} title={label}
        data-week={week} data-coverage={cell.complete ? cell.count ? "observed" : "zero" : "partial"}
        className="grid min-h-7 min-w-0 place-items-center text-signal focus-visible:outline focus-visible:outline-accent"
        onFocus={() => setFocus(i)} onClick={() => onSelect({ repository, week, ...cell })}
        onKeyDown={(event) => {
          const target = event.key === "ArrowRight" ? i + 1 : event.key === "ArrowLeft" ? i - 1 : event.key === "Home" ? 0 : event.key === "End" ? weeks.length - 1 : null;
          if (target === null) return;
          event.preventDefault();
          (event.currentTarget.parentElement?.children[target] as HTMLElement | undefined)?.focus();
        }}>
        <span aria-hidden="true" className={`block h-3 w-full rounded-[2px] ${!cell.complete ? "border border-dotted border-[var(--color-border-muted)]" : !cell.count ? "border border-[var(--color-border-muted)] bg-surface-raised" : ""}`}
          style={cell.count ? { backgroundColor: `color-mix(in srgb, var(--color-signal) ${25 + 70 * cell.count / peak}%, var(--color-surface))` } : undefined} />
      </button>;
    })}
  </div>;
}

export function ContributorTimeline({ selection, path, snapshotId, onClose }: {
  selection: ActivitySelection; path: string; snapshotId: string; onClose: () => void;
}) {
  const [page, setPage] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement;
    element?.showModal();
    return () => {
      element?.close();
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  }, []);
  const timeline = useQuery({
    queryKey: ["contributor-timeline", path, snapshotId, selection.repository, selection.week, page],
    queryFn: ({ signal }) => read<Timeline>(path, { activity: "timeline", repository: selection.repository, week: selection.week, page: String(page), page_size: "15" }, snapshotId, signal),
    enabled: selection.count > 0, staleTime: Infinity, retry: false,
  });
  return <dialog ref={dialog} aria-labelledby="contributor-timeline-heading" onCancel={(event) => { event.preventDefault(); onClose(); }}
    className="m-auto max-h-[80dvh] w-[min(34rem,calc(100%_-_2rem))] space-y-2 rounded border border-[var(--color-border-muted)] bg-surface p-4 text-ink backdrop:bg-black/50 type-body-sm">
    <div className="flex items-start justify-between gap-2">
      <h2 id="contributor-timeline-heading" className="font-semibold [overflow-wrap:anywhere]">{selection.repository} · Week of {date(selection.week)}</h2>
      <button type="button" className={button} onClick={onClose}>Close</button>
    </div>
    {!selection.count ? <p>{selection.complete ? "No linked commits in this week." : "This week was not fully observed."}</p> : timeline.isPending ? <p role="status">Loading commits…</p> : timeline.isError ? <p role="alert">Commits could not be loaded. <button type="button" className={button} onClick={() => timeline.refetch()}>Retry</button></p> : <>
      {!selection.complete && <p className="text-ink-muted">Partial coverage · showing the commits we observed.</p>}
      <ol className="space-y-1">{timeline.data.records.map((event) => <li key={event.id} className="flex flex-wrap gap-x-2 [overflow-wrap:anywhere]"><time dateTime={event.at}>{date(event.at)}</time><a className="text-accent underline" href={event.url} target="_blank" rel="noreferrer">{event.label} ↗</a></li>)}</ol>
      {timeline.data.page_count > 1 && <nav aria-label="Timeline pages" className="flex gap-2"><button type="button" className={button} disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button type="button" className={button} disabled={page >= timeline.data.page_count} onClick={() => setPage(page + 1)}>Next</button></nav>}
    </>}
  </dialog>;
}
