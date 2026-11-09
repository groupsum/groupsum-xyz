import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { catalogFetch } from "../../api/client";
import { CatalogLink } from "./CatalogLink";

type Evidence = { label: string; url: string };
type Activity = {
  weeks?: string[];
  repositories?: { name: string; route: string; cells: { count: number; complete: boolean }[] }[];
  through?: string;
  identity_linked: boolean;
  commit_count: number;
  achievements: { id: string; label: string; reason: string; at?: string; evidence: Evidence[] }[];
};
type Timeline = { page: number; page_count: number; records: { id: string; label: string; at: string; url: string }[] };
const date = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(value));

async function read<T>(path: string, params: Record<string, string>, snapshotId: string, signal: AbortSignal): Promise<T> {
  const response = await catalogFetch(`${path}?${new URLSearchParams(params)}`, { signal });
  if (!response.ok) throw new Error(`Contributor activity request failed (${response.status})`);
  if (response.headers.get("X-Catalog-Snapshot") !== snapshotId) throw new Error("Contributor activity snapshot changed");
  return response.json();
}

export function ContributorActivity({ provider, login, snapshotId }: { provider: string; login: string; snapshotId: string }) {
  const path = `/api/v1/contributors/${encodeURIComponent(provider)}/${encodeURIComponent(login)}`;
  const activity = useQuery({ queryKey: ["contributor-activity", path, snapshotId], queryFn: ({ signal }) => read<Activity>(path, { activity: "1" }, snapshotId, signal), staleTime: Infinity, retry: false });
  if (activity.isPending) return <p role="status" className="type-body-sm">Loading activity…</p>;
  if (activity.isError) return <p role="alert" className="type-body-sm">Activity could not be loaded. <button type="button" className="text-accent underline" onClick={() => activity.refetch()}>Retry</button></p>;
  return <>
    <ActivityGrid model={activity.data} path={path} snapshotId={snapshotId} />
    {activity.data.achievements.length > 0 && <section aria-labelledby="milestones-heading" className="space-y-2 border-t border-[var(--color-border-soft)] pt-3">
      <h2 id="milestones-heading" className="type-display-sm">Milestones</h2>
      <ul className="divide-y divide-[var(--color-border-soft)]">{activity.data.achievements.map((item) => <li key={item.id} className="type-body-sm flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2">
        <strong>{item.label}</strong>{item.at && <time dateTime={item.at}>{date(item.at)}</time>}<span className="text-ink-muted">{item.reason}</span>
        {item.evidence.map(({ label, url }) => url.startsWith("/") ? <CatalogLink className="text-accent underline" key={url} href={url}>{label}</CatalogLink> : <a key={url} className="text-accent underline" href={url} target="_blank" rel="noreferrer">{label} ↗</a>)}
      </li>)}</ul>
    </section>}
  </>;
}

function ActivityGrid({ model, path, snapshotId }: { model: Activity; path: string; snapshotId: string }) {
  const weeks = model.weeks || [];
  const repos = model.repositories || [];
  const [wide, setWide] = useState(false);
  const [windowOffset, setWindowOffset] = useState(0);
  const [repoPage, setRepoPage] = useState(0);
  const [list, setList] = useState(false);
  const [focus, setFocus] = useState("");
  const [readout, setReadout] = useState("");
  const [selection, setSelection] = useState<{ repository: string; week: string; count: number; complete: boolean }>();
  const [timelinePage, setTimelinePage] = useState(1);
  useEffect(() => {
    const media = matchMedia("(min-width: 850px)");
    const change = () => { setWide(media.matches); setWindowOffset(0); };
    change();
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const span = wide ? 13 : 4;
  const end = Math.max(0, weeks.length - windowOffset * span);
  const start = Math.max(0, end - span);
  const visibleWeeks = weeks.slice(start, end);
  const visibleRepos = repos.slice(repoPage * 6, (repoPage + 1) * 6);
  const peak = Math.max(1, ...repos.flatMap((repo) => repo.cells.map((cell) => cell.count)));
  const totals = weeks.map((_, index) => repos.reduce((sum, row) => sum + (row.cells[index]?.count || 0), 0));
  const high = Math.max(1, ...totals);
  const timeline = useQuery({
    queryKey: ["contributor-timeline", path, snapshotId, selection?.repository, selection?.week, timelinePage],
    queryFn: ({ signal }) => read<Timeline>(path, { activity: "timeline", repository: selection!.repository, week: selection!.week, page: String(timelinePage), page_size: "15" }, snapshotId, signal),
    enabled: !!selection?.count, staleTime: Infinity, retry: false,
  });
  const firstKey = visibleRepos[0] && visibleWeeks[0] ? `${visibleRepos[0].name}:${visibleWeeks[0]}` : "";
  const activeKey = visibleRepos.some((repo) => visibleWeeks.some((week) => `${repo.name}:${week}` === focus)) ? focus : firstKey;
  const show = (repository: string, week: string, cell: { count: number; complete: boolean }) => {
    setSelection({ repository, week, ...cell });
    setTimelinePage(1);
  };
  const covered = repos.some((repo) => repo.cells.some((cell) => cell.complete || cell.count > 0));
  const button = "min-h-9 rounded border border-[var(--color-border-soft)] px-2 text-accent focus-visible:outline disabled:opacity-50";
  return <section aria-labelledby="activity-heading" className="min-w-0 space-y-3 border-t border-[var(--color-border-soft)] pt-3">
    <h2 id="activity-heading" className="type-display-sm">Activity by repository</h2>
    {!model.identity_linked ? <p className="type-body-sm">No linked account is available for commit attribution.</p> : !covered ? <p className="type-body-sm">No attributable commit history has been collected for this profile in this snapshot.</p> : <>
      <div className="flex flex-wrap items-center gap-3">
        <p className="type-body-sm"><strong>{model.commit_count.toLocaleString()} observed commits</strong> · {date(weeks[0])}–{date(model.through!)} UTC</p>
        <svg width="104" height="22" viewBox="0 0 104 22" aria-hidden="true" className="text-signal">
          {totals.map((count, index) => <rect key={weeks[index]} x={index * 8} y={22 - count / high * 22} width="5" height={count / high * 22} fill="currentColor" />)}
        </svg>
      </div>
      <p className="type-body-sm text-ink-muted">Public default-branch commits linked to this account. Weeks start Monday (UTC). Dashed cells are incomplete or not collected; blank solid cells are observed zeros. Darker fill means more commits (up to {peak}).</p>
      <div className="type-control flex flex-wrap gap-2">
        <button type="button" className={button} disabled={start === 0} onClick={() => setWindowOffset(windowOffset + 1)}>Earlier weeks</button>
        <button type="button" className={button} disabled={windowOffset === 0} onClick={() => setWindowOffset(windowOffset - 1)}>Later weeks</button>
        <button type="button" className={button} aria-pressed={list} onClick={() => setList(!list)}>List view</button>
      </div>
      {list ? <ul className="type-body-sm space-y-1">{visibleRepos.flatMap((repo) => visibleWeeks.map((week, column) => {
        const cell = repo.cells[start + column];
        return <li key={`${repo.name}:${week}`}><button type="button" className="text-left text-accent underline" onClick={() => show(repo.name, week, cell)}>{repo.name} · {date(week)} · {cell.count || (cell.complete ? 0 : "Not fully observed")}{cell.count > 0 ? " commits" : ""}</button></li>;
      }))}</ul> :
      <table className="w-full table-fixed border-separate border-spacing-1 text-left" aria-label="Observed commits by repository and week">
        <thead><tr><th scope="col" className="w-1/3 text-xs">Repository</th>{visibleWeeks.map((week) => <th key={week} scope="col" className="text-center text-[10px] leading-tight">{date(week)}</th>)}</tr></thead>
        <tbody>{visibleRepos.map((repo, row) => <tr key={repo.name}>
          <th scope="row" className="text-xs font-normal [overflow-wrap:anywhere]"><CatalogLink className="text-accent" href={repo.route}>{repo.name}</CatalogLink></th>
          {visibleWeeks.map((week, column) => {
            const cell = repo.cells[start + column];
            const key = `${repo.name}:${week}`;
            const label = `${repo.name}, week of ${date(week)}: ${cell.count || cell.complete ? `${cell.count} observed commits` : "not fully observed"}${!cell.complete && cell.count ? ", partial coverage" : ""}`;
            return <td key={week}><button type="button" data-cell={`${row}-${column}`} tabIndex={activeKey === key ? 0 : -1} onFocus={() => { setFocus(key); setReadout(label); }} onPointerEnter={() => setReadout(label)} aria-label={label} aria-pressed={selection?.repository === repo.name && selection.week === week}
              className={`block min-h-7 w-full rounded-sm border border-[var(--color-border-muted)] focus-visible:outline focus-visible:outline-accent aria-pressed:outline ${cell.complete ? "" : "border-dashed"}`}
              style={cell.count ? { backgroundColor: `color-mix(in srgb, var(--color-signal) ${20 + 70 * cell.count / peak}%, transparent)` } : undefined}
              onClick={() => show(repo.name, week, cell)}
              onKeyDown={(event) => {
                const offset = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[event.key];
                if (!offset) return;
                event.preventDefault();
                event.currentTarget.closest("table")?.querySelector<HTMLButtonElement>(`[data-cell="${row + offset[0]}-${column + offset[1]}"]`)?.focus();
              }} /></td>;
          })}
        </tr>)}</tbody>
      </table>}
      {!list && <p aria-live="polite" className="type-body-sm min-h-6 text-ink-muted [overflow-wrap:anywhere]">{readout || "Focus or point to a week for its count. Use the arrow keys to move between cells."}</p>}
      {repos.length > 6 && <nav aria-label="Activity repositories" className="type-control flex flex-wrap gap-2"><button className={button} type="button" disabled={!repoPage} onClick={() => setRepoPage(repoPage - 1)}>Previous repositories</button><button className={button} type="button" disabled={(repoPage + 1) * 6 >= repos.length} onClick={() => setRepoPage(repoPage + 1)}>Next repositories</button></nav>}
      {selection && <section aria-label="Selected activity timeline" className="type-body-sm space-y-2 border-t border-[var(--color-border-soft)] pt-2">
        <h3 className="font-semibold break-words">{selection.repository} · Week of {date(selection.week)}</h3>
        {!selection.count ? <p>{selection.complete ? "No linked commits in this week." : "This week was not fully observed."}</p> : timeline.isPending ? <p role="status">Loading commits…</p> : timeline.isError ? <p role="alert">Commits could not be loaded. <button className={button} onClick={() => timeline.refetch()}>Retry</button></p> : <>
          {!selection.complete && <p className="text-ink-muted">Partial coverage · showing the commits we observed.</p>}
          <ol className="space-y-1">{timeline.data.records.map((event) => <li key={event.id} className="flex flex-wrap gap-x-2 [overflow-wrap:anywhere]"><time dateTime={event.at}>{date(event.at)}</time><a className="text-accent underline" href={event.url} target="_blank" rel="noreferrer">{event.label} ↗</a></li>)}</ol>
          {timeline.data.page_count > 1 && <nav aria-label="Timeline pages" className="flex gap-2"><button className={button} disabled={timelinePage <= 1} onClick={() => setTimelinePage(timelinePage - 1)}>Previous</button><button className={button} disabled={timelinePage >= timeline.data.page_count} onClick={() => setTimelinePage(timelinePage + 1)}>Next</button></nav>}
        </>}
      </section>}
    </>}
  </section>;
}
