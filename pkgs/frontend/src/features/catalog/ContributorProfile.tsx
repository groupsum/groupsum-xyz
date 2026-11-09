import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getContributor, type ContributorPageModel } from "../../api/catalog";
import { CatalogLink } from "./CatalogLink";
import { CatalogPageMetadata } from "./CatalogPageMetadata";
import { useCatalogVersion } from "../../api/catalog-version";
import { ContributorTypeBadge } from "./ContributorTypeBadge";
import { ContributorAchievements, ContributorCommitSparkline, ContributorHeatstrip, ContributorTimeline, useContributorActivity, type ActivitySelection } from "./ContributorActivity";

export function ContributorProfile({ provider, login }: { provider: string; login: string; onNavigate?: (path: string) => void }) {
  const version = useCatalogVersion();
  const [repoSort, setRepoSort] = useState({ key: "contributions", ascending: false });
  const [inspected, setInspected] = useState<{ key: string; selection: ActivitySelection }>();
  const snapshot = globalThis.__GROUPSUM_API_SNAPSHOT__ as (ContributorPageModel & { static_path?: string; static_snapshot_id?: string }) | null;
  const model = useQuery({ queryKey: ["contributor", provider, login, version.snapshot_id], queryFn: ({ signal }) => getContributor(provider, login, signal),
    initialData: snapshot?.static_path === `/contributors/${encodeURIComponent(provider)}/${encodeURIComponent(login)}` && version.snapshot_id === snapshot.static_snapshot_id ? snapshot : undefined, placeholderData: (previous, query) => query?.queryKey[2] === login ? previous : undefined, staleTime: 60_000, retry: false });
  const repositories = [...(model.data?.repositories || [])].sort((a, b) => (repoSort.ascending ? 1 : -1) * (repoSort.key === "name" ? a.name.localeCompare(b.name, "en-US") : a.contributions - b.contributions) || a.name.localeCompare(b.name, "en-US"));
  const showActivity = !!version.public_projection_available && model.isSuccess && !model.isPlaceholderData;
  const activity = useContributorActivity(provider, login, version.snapshot_id, showActivity);
  const weeks = activity.data?.identity_linked ? activity.data.weeks ?? [] : [];
  const repoActivity = new Map(activity.data?.repositories?.map((row) => [row.name, row.cells]));
  const peak = Math.max(1, ...Array.from(repoActivity.values()).flatMap((cells) => cells.map((cell) => cell.count)));
  const activityKey = `${version.snapshot_id}:${activity.path}`;
  return <article className="mx-auto max-w-[var(--content-max)] space-y-4 px-4 py-8 sm:px-6">
    <nav aria-label="Contributor profile links" className="type-control flex flex-wrap justify-between gap-x-3 gap-y-1 text-accent">
      <CatalogLink href="/contributors">← Contributors</CatalogLink>
      {model.data?.item.url && <a href={String(model.data.item.url)} target="_blank" rel="noreferrer" className="ml-auto text-right">{provider === "github" ? "View GitHub profile" : "View public profile"} ↗</a>}
    </nav>
    {model.isPending ? <p role="status">Loading contributor profile…</p> : model.isError ? <div role="alert"><h1 className="type-display-lg break-words [overflow-wrap:anywhere]">{String(model.error).includes("404") ? "Contributor not found" : "Contributor unavailable"}</h1><p className="type-body-sm">{String(model.error).includes("404") ? "This identity is not in the current catalog." : "The profile could not be loaded."}</p><button onClick={() => model.refetch()} className="type-control text-accent">Retry</button></div> : <>
      <CatalogPageMetadata record={{ ...model.data.item, route: String(model.data.item.route || `/contributors/${provider}/${encodeURIComponent(login)}`), title: `${model.data.item.name || login} contributor | GroupSum catalog`, description: `${model.data.item.account_type || "Public"} contributor observed across ${model.data.repositories.length} public catalog repositories.`, schemaFamily: "contributor-profile", profileUrl: model.data.item.url }} />
      <header className="min-w-0 space-y-3 border-b border-[var(--color-border-soft)] pb-3">
        <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
          <div className="min-w-0 space-y-3">
            <div className="flex min-w-0 items-start gap-3">
              {model.data.item.avatar_url && <img src={String(model.data.item.avatar_url)} alt="" width="48" height="48" className="h-12 w-12 shrink-0" />}
              <div className="min-w-0">
                <h1 className="type-display-lg [overflow-wrap:anywhere]">{String(model.data.item.name || login)}</h1>
                <div className="type-body-sm flex flex-wrap items-center gap-2 text-ink-muted">
                  <ContributorTypeBadge value={model.data.item.account_type} />
                  {model.data.item.login && <span className="[overflow-wrap:anywhere]">@{model.data.item.login}</span>}
                </div>
              </div>
            </div>
            {showActivity && activity.data && <ContributorAchievements model={activity.data} />}
          </div>
          <div className="flex w-full max-w-60 min-w-0 flex-col gap-1 [overflow-wrap:anywhere]" aria-label="Catalog activity summary" role="group">
            <strong className="type-metric text-accent">{repositories.reduce((total, row) => total + row.contributions, 0).toLocaleString()}</strong>
            <span className="type-ui-label text-ink-muted">Source-reported contributions</span>
            {showActivity && (activity.isPending ? <span role="status" className="type-body-sm text-ink-muted">Loading activity…</span> : activity.isError ? <span role="alert" className="type-body-sm text-ink-muted">Activity could not be loaded. <button type="button" className="text-accent underline" onClick={() => activity.refetch()}>Retry</button></span> : <ContributorCommitSparkline model={activity.data} />)}
          </div>
        </div>
        <p className="type-control text-right text-ink-muted">Last updated {version.collected_at || model.data.item.observed_at ? `${String(version.collected_at || model.data.item.observed_at).slice(0, 10)} UTC` : "—"}</p>
      </header>
      <h2 id="contributor-repositories" className="type-display-sm scroll-mt-24">Repositories <span className="type-control text-ink-muted">({repositories.length.toLocaleString()})</span></h2>
      {!!weeks.length && <p className="type-body-sm text-ink-muted">One block per UTC week. Color intensity shows commit volume, muted blocks mean zero, and dotted outlines mark incomplete coverage. Select a week for details.</p>}
      <table className="type-technical w-full table-fixed text-left [overflow-wrap:anywhere]" aria-label="Contributor repositories">
        <thead className="type-ui-label bg-canvas text-ink-muted"><tr>{([["name", "Repository"], ["activity", "Weekly commits"], ["contributions", "Contributions"]] as const).map(([key, label]) => {
          if (key === "activity") return <th key={key} scope="col" className="w-[44%] sm:w-[38%]">{label}</th>;
          const active = key === repoSort.key;
          return <th key={key} scope="col" className={key === "name" ? "py-2" : "w-[24%] text-right"} aria-sort={active ? repoSort.ascending ? "ascending" : "descending" : undefined}><button type="button" className="type-ui-label min-h-8 text-inherit hover:text-accent focus-visible:outline" onClick={() => setRepoSort({ key, ascending: active ? !repoSort.ascending : key === "name" })}>{label}<span aria-hidden="true"> {active ? repoSort.ascending ? "↑" : "↓" : "↕"}</span></button></th>;
        })}</tr></thead>
        <tbody className="divide-y divide-[var(--color-border-soft)]">{repositories.map((row) => <tr key={row.id}><td className="py-2 pr-2"><CatalogLink href={row.route} className="block text-accent [overflow-wrap:anywhere]">{row.name}</CatalogLink></td><td><ContributorHeatstrip key={activityKey} repository={row.name} weeks={weeks} cells={repoActivity.get(row.name)} peak={peak} onSelect={(selection) => setInspected({ key: activityKey, selection })} /></td><td className="text-right tabular-nums">{row.contributions.toLocaleString()}</td></tr>)}</tbody>
      </table>
      {showActivity && inspected?.key === activityKey && <ContributorTimeline selection={inspected.selection} path={activity.path} snapshotId={version.snapshot_id} onClose={() => setInspected(undefined)} />}
      {!model.data.repositories.length && <p>No repository relationships were observed.</p>}
    </>}
  </article>;
}
