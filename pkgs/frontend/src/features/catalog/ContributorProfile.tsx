import { useQuery } from "@tanstack/react-query";
import { getContributor, type ContributorPageModel } from "../../api/catalog";
import { CatalogLink } from "./CatalogLink";
import { CatalogPageMetadata } from "./CatalogPageMetadata";

export function ContributorProfile({ provider, login }: { provider: string; login: string; onNavigate?: (path: string) => void }) {
  const snapshot = globalThis.__GROUPSUM_API_SNAPSHOT__ as (ContributorPageModel & { static_path?: string }) | null;
  const model = useQuery({ queryKey: ["contributor", provider, login], queryFn: ({ signal }) => getContributor(provider, login, signal),
    initialData: snapshot?.static_path === `/contributors/${encodeURIComponent(provider)}/${encodeURIComponent(login)}` ? snapshot : undefined, staleTime: 60_000, retry: false });
  return <article className="mx-auto max-w-[var(--content-max)] space-y-4 px-4 py-8 sm:px-6">
    <CatalogLink href="/contributors" className="type-control text-accent">← Contributors</CatalogLink>
    {model.isPending ? <p role="status">Loading contributor profile…</p> : model.isError ? <div role="alert"><h1 className="type-display-lg break-words [overflow-wrap:anywhere]">{String(model.error).includes("404") ? "Contributor not found" : "Contributor unavailable"}</h1><p className="type-body-sm">{String(model.error).includes("404") ? "This identity is not in the current catalog." : "The profile could not be loaded."}</p><button onClick={() => model.refetch()} className="type-control text-accent">Retry</button></div> : <>
      <CatalogPageMetadata record={{ ...model.data.item, route: String(model.data.item.route || `/contributors/${provider}/${encodeURIComponent(login)}`), title: `${model.data.item.name || login} contributor | GroupSum catalog`, description: `${model.data.item.account_type || "Public"} contributor observed across ${model.data.repositories.length} public catalog repositories.`, schemaFamily: "contributor-profile", profileUrl: model.data.item.url }} />
      <header className="flex min-w-0 flex-wrap items-start gap-3 border-b border-[var(--color-border-soft)] pb-3">
        {model.data.item.avatar_url && <img src={String(model.data.item.avatar_url)} alt="" width="48" height="48" className="h-12 w-12 shrink-0" />}
        <div className="min-w-0 flex-1"><h1 className="type-display-lg break-words">{String(model.data.item.name || login)}</h1><p className="type-body-sm text-ink-muted break-words">{provider} · {String(model.data.item.account_type || "Contributor")} · {model.data.item.login ? `@${model.data.item.login}` : "Anonymous identity"}</p></div>
        {model.data.item.url && <a href={String(model.data.item.url)} target="_blank" rel="noreferrer" className="type-control text-accent">Public profile ↗</a>}
      </header>
      <div className="type-body-sm flex flex-wrap gap-x-5 gap-y-2"><span><strong>{model.data.repositories.length}</strong> catalog repositories</span><span><strong>{model.data.repositories.reduce((total, row) => total + row.contributions, 0).toLocaleString()}</strong> source-reported contributions</span><span className="text-ink-muted">Observed {model.data.item.observed_at ? new Date(String(model.data.item.observed_at)).toLocaleDateString("en-US", { timeZone: "UTC" }) : "date unavailable"}</span></div>
      <p className="type-body-sm text-ink-muted">Repository-scoped totals reported by the source. Not global activity or a verified count of authored commits.</p>
      <table className="type-technical w-full table-fixed text-left [overflow-wrap:anywhere]" aria-label="Contributor repositories"><thead className="type-ui-label"><tr><th className="py-2">Repository</th><th className="w-[30%] text-right">Contributions</th></tr></thead><tbody className="divide-y divide-[var(--color-border-soft)]">{model.data.repositories.map((row) => <tr key={row.id}><td className="py-2 pr-2"><CatalogLink href={row.route} className="block truncate text-accent" title={row.name}>{row.name}</CatalogLink></td><td className="text-right tabular-nums">{row.contributions.toLocaleString()}</td></tr>)}</tbody></table>
      {!model.data.repositories.length && <p>No repository relationships were observed.</p>}
    </>}
  </article>;
}
