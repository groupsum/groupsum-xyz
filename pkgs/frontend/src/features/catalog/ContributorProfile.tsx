import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getContributor, type ContributorPageModel } from "../../api/catalog";
import { CatalogLink } from "./CatalogLink";
import { CatalogPageMetadata } from "./CatalogPageMetadata";
import { useCatalogVersion } from "../../api/catalog-version";
import { ContributorTypeBadge } from "./ContributorTypeBadge";
import { ContributorActivity } from "./ContributorActivity";

export function ContributorProfile({ provider, login }: { provider: string; login: string; onNavigate?: (path: string) => void }) {
  const version = useCatalogVersion();
  const [repoSort, setRepoSort] = useState({ key: "contributions", ascending: false });
  const snapshot = globalThis.__GROUPSUM_API_SNAPSHOT__ as (ContributorPageModel & { static_path?: string; static_snapshot_id?: string }) | null;
  const model = useQuery({ queryKey: ["contributor", provider, login, version.snapshot_id], queryFn: ({ signal }) => getContributor(provider, login, signal),
    initialData: snapshot?.static_path === `/contributors/${encodeURIComponent(provider)}/${encodeURIComponent(login)}` && version.snapshot_id === snapshot.static_snapshot_id ? snapshot : undefined, placeholderData: (previous, query) => query?.queryKey[2] === login ? previous : undefined, staleTime: 60_000, retry: false });
  const repositories = [...(model.data?.repositories || [])].sort((a, b) => (repoSort.ascending ? 1 : -1) * (repoSort.key === "name" ? a.name.localeCompare(b.name, "en-US") : a.contributions - b.contributions) || a.name.localeCompare(b.name, "en-US"));
  return <article className="mx-auto max-w-[var(--content-max)] space-y-4 px-4 py-8 sm:px-6">
    <CatalogLink href="/contributors" className="type-control text-accent">← Contributors</CatalogLink>
    {model.isPending ? <p role="status">Loading contributor profile…</p> : model.isError ? <div role="alert"><h1 className="type-display-lg break-words [overflow-wrap:anywhere]">{String(model.error).includes("404") ? "Contributor not found" : "Contributor unavailable"}</h1><p className="type-body-sm">{String(model.error).includes("404") ? "This identity is not in the current catalog." : "The profile could not be loaded."}</p><button onClick={() => model.refetch()} className="type-control text-accent">Retry</button></div> : <>
      <CatalogPageMetadata record={{ ...model.data.item, route: String(model.data.item.route || `/contributors/${provider}/${encodeURIComponent(login)}`), title: `${model.data.item.name || login} contributor | GroupSum catalog`, description: `${model.data.item.account_type || "Public"} contributor observed across ${model.data.repositories.length} public catalog repositories.`, schemaFamily: "contributor-profile", profileUrl: model.data.item.url }} />
      <header className="flex min-w-0 flex-wrap items-start gap-3 border-b border-[var(--color-border-soft)] pb-3">
        {model.data.item.avatar_url && <img src={String(model.data.item.avatar_url)} alt="" width="48" height="48" className="h-12 w-12 shrink-0" />}
        <div className="min-w-0 flex-1"><h1 className="type-display-lg [overflow-wrap:anywhere]">{String(model.data.item.name || login)}</h1><div className="type-body-sm flex flex-wrap items-center gap-2 text-ink-muted"><ContributorTypeBadge value={model.data.item.account_type} />{model.data.item.login && <span className="[overflow-wrap:anywhere]">@{model.data.item.login}</span>}</div></div>
        {model.data.item.url && <a href={String(model.data.item.url)} target="_blank" rel="noreferrer" className="type-control text-accent">{provider === "github" ? "View GitHub profile" : "View public profile"} ↗</a>}
      </header>
      <div className="type-body-sm flex flex-wrap gap-x-5 gap-y-2"><span><strong>{model.data.repositories.reduce((total, row) => total + row.contributions, 0).toLocaleString()}</strong> source-reported contributions</span><span className="text-ink-muted">Observed {model.data.item.observed_at ? new Date(String(model.data.item.observed_at)).toLocaleDateString("en-US", { timeZone: "UTC" }) : "date unavailable"}</span></div>
      <p className="type-body-sm text-ink-muted">Totals reflect what the source reported for these repositories, not the contributor’s entire GitHub activity.</p>
      {version.public_projection_available && !model.isPlaceholderData && <ContributorActivity key={`${version.snapshot_id}:${provider}:${login}`} snapshotId={version.snapshot_id} provider={provider} login={login} />}
      <h2 id="contributor-repositories" className="type-display-sm scroll-mt-24">Repositories <span className="type-control text-ink-muted">({repositories.length.toLocaleString()})</span></h2>
      <table className="type-technical w-full table-fixed text-left [overflow-wrap:anywhere]" aria-label="Contributor repositories">
        <thead className="type-ui-label"><tr>{([["name", "Repository"], ["contributions", "Contributions"]] as const).map(([key, label]) => {
          const active = key === repoSort.key;
          return <th key={key} scope="col" className={key === "name" ? "py-2" : "w-[35%] text-right"} aria-sort={active ? repoSort.ascending ? "ascending" : "descending" : undefined}><button type="button" className="min-h-8 hover:text-accent focus-visible:outline" onClick={() => setRepoSort({ key, ascending: active ? !repoSort.ascending : key === "name" })}>{label}<span aria-hidden="true"> {active ? repoSort.ascending ? "↑" : "↓" : "↕"}</span></button></th>;
        })}</tr></thead>
        <tbody className="divide-y divide-[var(--color-border-soft)]">{repositories.map((row) => <tr key={row.id}><td className="py-2 pr-2"><CatalogLink href={row.route} className="block text-accent [overflow-wrap:anywhere]">{row.name}</CatalogLink></td><td className="text-right tabular-nums">{row.contributions.toLocaleString()}</td></tr>)}</tbody>
      </table>
      {!model.data.repositories.length && <p>No repository relationships were observed.</p>}
    </>}
  </article>;
}
