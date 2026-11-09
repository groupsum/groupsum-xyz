import { useQuery } from "@tanstack/react-query";
import { getContributors, type ContributorCollection } from "../../api/catalog";
import { useSearchParams } from "../../router";
import { CatalogLink } from "./CatalogLink";
import { CatalogPageMetadata } from "./CatalogPageMetadata";
import { useCatalogVersion } from "../../api/catalog-version";
import { ContributorTypeBadge, contributorTypeLabel } from "./ContributorTypeBadge";

const columns = [
  ["name", "Contributor", "py-2 text-left"],
  ["type", "Type", "hidden w-24 sm:table-cell"],
  ["repositories", "Repos", "w-[18%] text-right"],
  ["contributions", "Contributions", "w-[30%] text-right"],
] as const;

export function ContributorDirectory() {
  const version = useCatalogVersion();
  const [params, setParams] = useSearchParams();
  const leaderboard = params.get("view") === "leaderboard"
    || (!params.has("view") && !params.has("sort") && !params.has("account_type"));
  const query = { q: params.get("q") || "", account_type: leaderboard ? params.get("account_type") === "Bot" ? "Bot" : "User" : params.get("account_type") || "", sort: leaderboard ? "leaderboard" : params.get("sort") || "contributions_desc", page: Number(params.get("page") || 1), page_size: 50 };
  const snapshot = globalThis.__GROUPSUM_API_SNAPSHOT__ as (ContributorCollection & { static_path?: string; static_snapshot_id?: string }) | null;
  const collection = useQuery({ queryKey: ["contributors", query, version.snapshot_id], queryFn: ({ signal }) => getContributors(query, signal), initialData: params.size === 0 && snapshot?.static_path === "/contributors" && version.snapshot_id === snapshot.static_snapshot_id ? snapshot : undefined, staleTime: 60_000 });
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    if (key !== "page") next.delete("page");
    if (key === "view") { next.delete("sort"); next.delete("account_type"); }
    if (key === "sort") next.set("view", "directory");
    if (key === "account_type" && leaderboard) next.set("view", "leaderboard");
    setParams(next, { replace: key === "q" });
  };
  return <article className="mx-auto max-w-[var(--content-max)] space-y-4 px-4 py-8 sm:px-6"><CatalogPageMetadata record={{ route: "/contributors", title: "Contributors | GroupSum catalog", description: "People and automation observed contributing to catalog repositories.", schemaFamily: "catalog-collection", items: collection.data?.records || [], itemCount: collection.data?.count || 0 }} /><header><h1 className="type-display-lg break-words [overflow-wrap:anywhere]">Contributors</h1><p className="type-body-sm text-ink-muted">People and automation observed contributing to catalog repositories.</p></header>
    <div role="group" aria-label="Contributor view" className="type-control flex flex-wrap gap-2">
      <button type="button" aria-pressed={leaderboard} onClick={() => change("view", "leaderboard")} className="min-h-9 rounded border border-[var(--color-border-muted)] px-3 aria-pressed:border-current aria-pressed:text-accent focus-visible:outline">Leaderboard</button>
      <button type="button" aria-pressed={!leaderboard} onClick={() => change("view", "directory")} className="min-h-9 rounded border border-[var(--color-border-muted)] px-3 aria-pressed:border-current aria-pressed:text-accent focus-visible:outline">Directory</button>
    </div>
    {leaderboard && <p className="type-body-sm text-ink-muted">Ranked by source-reported contributions across catalog repositories. Ties share a rank, and search preserves your rank within the selected group.</p>}
    <div className="flex flex-wrap gap-2"><label className="type-body-sm min-w-0 flex-[1_1_15rem]">Search contributors<input type="search" value={query.q} onChange={(event) => change("q", event.target.value)} className="block min-h-9 w-full border border-[var(--color-border-soft)] bg-surface px-2" /></label><label className="type-body-sm">{leaderboard ? "Rank group" : "Account type"}<select value={query.account_type} onChange={(event) => change("account_type", event.target.value)} className="block min-h-9 border border-[var(--color-border-soft)] bg-surface px-2">{leaderboard ? <><option value="User">Individuals</option><option value="Bot">Automation</option></> : <><option value="">All accounts</option>{["User", "Bot", "Anonymous"].map((type) => <option key={type} value={type}>{contributorTypeLabel(type)}</option>)}</>}</select></label>{!leaderboard && <label className="type-body-sm">Sort<select value={query.sort} onChange={(event) => change("sort", event.target.value)} className="block min-h-9 border border-[var(--color-border-soft)] bg-surface px-2">{columns.flatMap(([key, label]) => ["asc", "desc"].map((direction) => <option key={key + direction} value={key + "_" + direction}>{label} ({direction === "asc" ? "ascending" : "descending"})</option>))}</select></label>}</div>
    {collection.isPending && <p role="status">Loading contributors…</p>}{collection.isError && <p role="alert">Directory could not be loaded. <button onClick={() => collection.refetch()}>Retry</button></p>}
    {collection.data && <><p role="status" className="type-body-sm text-ink-muted">{collection.data.count} contributors · Page {collection.data.page} of {collection.data.page_count}{collection.isFetching ? " · Updating…" : ""}</p><table className="type-technical w-full table-fixed text-left [overflow-wrap:anywhere]" aria-label={leaderboard ? "Contributor leaderboard" : "Contributor directory"}><thead className="type-ui-label"><tr>{leaderboard && <th scope="col" className="w-10 sm:w-16">Rank</th>}{columns.map(([key, label, className]) => {
      const active = leaderboard ? key === "contributions" : query.sort.startsWith(key + "_");
      const ascending = query.sort.endsWith("_asc");
      return <th key={key} scope="col" className={className} aria-sort={active ? ascending ? "ascending" : "descending" : undefined}><button type="button" className="min-h-8 text-inherit hover:text-accent focus-visible:outline" onClick={() => change("sort", key + "_" + (active ? ascending ? "desc" : "asc" : key === "name" || key === "type" ? "asc" : "desc"))}>{label}<span aria-hidden="true"> {active ? ascending ? "↑" : "↓" : "↕"}</span></button></th>;
    })}</tr></thead><tbody className="divide-y divide-[var(--color-border-soft)]">{collection.data.records.map((row) => <tr key={row.id}>{leaderboard && <td className="tabular-nums">{row.rank != null ? <span className={row.rank <= 3 ? "inline-block rounded border border-current px-1 font-semibold text-signal" : "text-ink-muted"}>{row.rank}</span> : "—"}</td>}<td className="py-2 pr-2"><CatalogLink href={row.route} className="block truncate text-accent" title={row.name}>{row.name}</CatalogLink><span className="sm:hidden"><ContributorTypeBadge value={row.account_type} /></span></td><td className="hidden sm:table-cell"><ContributorTypeBadge value={row.account_type} /></td><td className="text-right">{row.repository_count}</td><td className="text-right tabular-nums">{row.contributions.toLocaleString()}</td></tr>)}</tbody></table>{!collection.data.records.length && <p>No contributors match these filters.</p>}<nav aria-label="Contributor pagination" className="flex justify-end gap-3"><button disabled={collection.data.page <= 1} onClick={() => change("page", String(collection.data.page - 1))}>Previous</button><button disabled={collection.data.page >= collection.data.page_count} onClick={() => change("page", String(collection.data.page + 1))}>Next</button></nav></>}
  </article>;
}
