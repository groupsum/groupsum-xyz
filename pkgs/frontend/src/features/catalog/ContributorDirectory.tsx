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
  ["repositories", "Repos", "w-[23%] text-right sm:w-[18%]"],
  ["contributions", "Contributions", "w-[30%] text-right"],
] as const;

const medals = ["🥇", "🥈", "🥉"];
const viewButton = "min-h-9 rounded border border-[var(--color-border-muted)] px-3 aria-pressed:border-current aria-pressed:text-accent focus-visible:outline";

function Rank({ rank }: { rank?: number | null }) {
  if (rank == null) return <span title="Not ranked"><span aria-hidden="true">—</span><span className="sr-only">Not ranked</span></span>;
  const medal = medals[rank - 1];
  return medal ? <span title={`Rank ${rank}`}><span aria-hidden="true">{medal}</span><span className="sr-only">{rank}</span></span> : <span className="text-ink-muted">{rank}</span>;
}

function Delta({ value, label }: { value?: number; label: string }) {
  const signed = value == null ? "—" : value > 0 ? `+${value.toLocaleString()}` : value.toLocaleString();
  const title = value == null ? "Insufficient history for the 30-day comparison" : `${signed} ${label} vs. the preceding 30 days`;
  const trend = value == null || value === 0 ? undefined : value > 0 ? "up" : "down";
  return <span className={`type-control ${trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-ink-muted"}`} title={title}>
    <span aria-hidden="true">{trend === "up" ? "⬆️" : trend === "down" ? "⬇️" : ""}{signed}</span><span className="sr-only">{title}</span>
  </span>;
}

export function ContributorDirectory() {
  const version = useCatalogVersion();
  const [params, setParams] = useSearchParams();
  const leaderboard = params.get("view") === "leaderboard"
    || (!params.has("view") && !params.has("sort") && !params.has("account_type"));
  const query = { q: params.get("q") || "", account_type: leaderboard ? params.get("account_type") === "Bot" ? "Bot" : "User" : params.get("account_type") || "", sort: leaderboard ? "leaderboard" : params.get("sort") || "contributions_desc", page: Number(params.get("page") || 1), page_size: 50, activity_deltas: 1 };
  const snapshot = globalThis.__GROUPSUM_API_SNAPSHOT__ as (ContributorCollection & { static_path?: string; static_snapshot_id?: string }) | null;
  const collection = useQuery({ queryKey: ["contributors", query, version.snapshot_id], queryFn: ({ signal }) => getContributors(query, signal), initialData: params.size === 0 && snapshot?.static_path === "/contributors" && version.snapshot_id === snapshot.static_snapshot_id ? snapshot : undefined, initialDataUpdatedAt: 0, staleTime: 60_000 });
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    if (key !== "page") next.delete("page");
    if (key === "view") { next.delete("sort"); next.delete("account_type"); next.delete("ranking"); }
    if (key === "sort") { next.set("view", "directory"); next.delete("ranking"); }
    if (key === "account_type" && leaderboard) next.set("view", "leaderboard");
    setParams(next, { replace: key === "q" });
  };
  return <article className="mx-auto max-w-[var(--content-max)] space-y-4 px-4 py-8 sm:px-6"><CatalogPageMetadata record={{ route: "/contributors", title: "Contributors | GroupSum catalog", description: "People and automation observed contributing to catalog repositories.", schemaFamily: "catalog-collection", items: collection.data?.records || [], itemCount: collection.data?.count || 0 }} /><header><h1 className="type-display-lg break-words [overflow-wrap:anywhere]">Contributors</h1><p className="type-body-sm text-ink-muted">People and automation observed contributing to catalog repositories.</p></header>
    <div role="group" aria-label="Contributor view" className="type-control flex flex-wrap gap-2">
      <button type="button" aria-pressed={leaderboard} onClick={() => !leaderboard && change("view", "leaderboard")} className={viewButton}>Leaderboard</button>
      <button type="button" aria-pressed={!leaderboard} onClick={() => leaderboard && change("view", "directory")} className={viewButton}>Directory</button>
    </div>
    {leaderboard && <div className="type-body-sm text-ink-muted">
      <p>Ranked by source-reported contributions across catalog repositories.</p>
      <p>Ties share a rank, and search preserves rank within the selected group.</p>
    </div>}
    <p className="type-body-sm text-ink-muted">Last updated: {version.collected_at ? <time dateTime={version.collected_at.replace(" ", "T")}>{version.collected_at.slice(0, 10)} UTC</time> : "Unavailable"}. Deltas compare the latest 30 days with the preceding 30 days: attributed commits and repositories with attributed commits.</p>
    <div className="flex flex-wrap gap-2"><label className="type-body-sm min-w-0 flex-[1_1_15rem]">Search contributors<input type="search" value={query.q} onChange={(event) => change("q", event.target.value)} className="block min-h-9 w-full border border-[var(--color-border-soft)] bg-surface px-2" /></label><label className="type-body-sm">{leaderboard ? "Rank group" : "Account type"}<select value={query.account_type} onChange={(event) => change("account_type", event.target.value)} className="block min-h-9 border border-[var(--color-border-soft)] bg-surface px-2">{leaderboard ? <><option value="User">Individuals</option><option value="Bot">Automation</option></> : <><option value="">All accounts</option>{["User", "Bot", "Anonymous"].map((type) => <option key={type} value={type}>{contributorTypeLabel(type)}</option>)}</>}</select></label>{!leaderboard && <label className="type-body-sm">Sort<select value={query.sort} onChange={(event) => change("sort", event.target.value)} className="block min-h-9 border border-[var(--color-border-soft)] bg-surface px-2">{columns.flatMap(([key, label]) => ["asc", "desc"].map((direction) => <option key={key + direction} value={key + "_" + direction}>{label} ({direction === "asc" ? "ascending" : "descending"})</option>))}</select></label>}</div>
    {collection.isPending && <p role="status">Loading contributors…</p>}{collection.isError && <p role="alert">Directory could not be loaded. <button onClick={() => collection.refetch()}>Retry</button></p>}
    {collection.data && <><p role="status" className="type-body-sm text-ink-muted">{collection.data.count} contributors · Page {collection.data.page} of {collection.data.page_count}{collection.isFetching ? " · Updating…" : ""}</p><table className="type-record-table w-full table-fixed text-left [overflow-wrap:anywhere]" aria-label={leaderboard ? "Contributor leaderboard" : "Contributor directory"}><thead className="type-ui-label"><tr>{leaderboard && <th scope="col" className="w-10 text-center sm:w-16">Rank</th>}{columns.map(([key, label, className]) => {
      const active = leaderboard ? key === "contributions" : query.sort.startsWith(key + "_");
      const ascending = query.sort.endsWith("_asc");
      return <th key={key} scope="col" className={className} aria-sort={active ? ascending ? "ascending" : "descending" : undefined}><button type="button" className="min-h-8 text-inherit hover:text-accent focus-visible:outline" onClick={() => change("sort", key + "_" + (active ? ascending ? "desc" : "asc" : key === "name" || key === "type" ? "asc" : "desc"))}>{label}<span aria-hidden="true"> {active ? ascending ? "↑" : "↓" : "↕"}</span></button></th>;
    })}</tr></thead>
      <tbody className="divide-y divide-[var(--color-border-soft)]">
        {collection.data.records.map((row) => <tr key={row.id}>
          {leaderboard && <td className="text-center tabular-nums"><Rank rank={row.rank} /></td>}
          <td className="py-2 pr-2">
            <CatalogLink href={row.route} className="block truncate text-accent" title={row.name}>{row.name}</CatalogLink>
            <span className="sm:hidden"><ContributorTypeBadge value={row.account_type} /></span>
          </td>
          <td className="hidden sm:table-cell"><ContributorTypeBadge value={row.account_type} /></td>
          <td className="text-right tabular-nums"><span className="inline-flex items-baseline gap-0.5 whitespace-nowrap sm:gap-1">{row.repository_count.toLocaleString()}<Delta value={row.activity_delta?.active_repositories} label="active repositories" /></span></td>
          <td className="text-right tabular-nums"><span className="inline-flex items-baseline gap-0.5 whitespace-nowrap sm:gap-1">{row.contributions.toLocaleString()}<Delta value={row.activity_delta?.commits} label="attributed commits" /></span></td>
        </tr>)}
      </tbody>
    </table>{!collection.data.records.length && <p>No contributors match these filters.</p>}<nav aria-label="Contributor pagination" className="flex justify-end gap-3"><button disabled={collection.data.page <= 1} onClick={() => change("page", String(collection.data.page - 1))}>Previous</button><button disabled={collection.data.page >= collection.data.page_count} onClick={() => change("page", String(collection.data.page + 1))}>Next</button></nav></>}
  </article>;
}
