import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, CircleDot } from "lucide-react";
import { listCatalog } from "../../api/catalog";
import type { CatalogViewRecord } from "../../types/catalog-view";

export function RepositoryPackagesInspector({ repository, ecosystem, onEcosystem, summary }: {
  repository: string; ecosystem: string; onEcosystem: (value: string) => void; summary?: CatalogViewRecord["package_summary"];
}) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [publication, setPublication] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => { if (search.trim() === query) return; const timer = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 250); return () => clearTimeout(timer); }, [search, query]);
  useEffect(() => setPage(1), [ecosystem, publication]);
  const params = { repository, ecosystem, publication_status: publication, q: query, page, page_size: 10, sort: "name", projection: "summary" as const };
  const collection = useQuery({ queryKey: ["repository-packages", params], queryFn: ({ signal }) => listCatalog("packages", params, signal), staleTime: 60_000 });
  const allParams = new URLSearchParams({ repository, ...(ecosystem ? { ecosystem } : {}), ...(publication ? { publication_status: publication } : {}), ...(query ? { q: query } : {}) });
  return <div className="space-y-3" aria-busy={collection.isFetching}>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <label className="type-body-sm">Search packages<input autoFocus type="search" value={search} onChange={(event) => setSearch(event.target.value)} className="mt-1 min-h-8 w-full min-w-0 border border-[var(--color-border-soft)] bg-canvas px-2" /></label>
      <label className="type-body-sm">Ecosystem<select value={ecosystem} onChange={(event) => onEcosystem(event.target.value)} className="mt-1 min-h-8 w-full min-w-0 border border-[var(--color-border-soft)] bg-canvas px-1"><option value="">All ecosystems</option>{Object.keys(summary?.ecosystems || collection.data?.facets.ecosystem || {}).map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="type-body-sm">Publication<select value={publication} onChange={(event) => setPublication(event.target.value)} className="mt-1 min-h-8 w-full min-w-0 border border-[var(--color-border-soft)] bg-canvas px-1"><option value="">All statuses</option>{Object.keys(summary?.publications || collection.data?.facets.publication_status || {}).map((value) => <option key={value}>{value}</option>)}</select></label>
    </div>
    {collection.isPending && <p role="status" className="type-body-sm py-6 text-ink-muted">Loading repository packages…</p>}
    {collection.isError && <div role="alert" className="type-body-sm py-4 text-danger">Packages could not be loaded. <button type="button" onClick={() => collection.refetch()} className="underline">Retry</button></div>}
    {collection.data && <>
      <p className="type-body-sm text-ink-muted" role="status">{collection.data.count.toLocaleString()} matching packages · Page {collection.data.page} of {collection.data.page_count}</p>
      {collection.data.records.length ? <table className="w-full table-fixed text-left text-xs" aria-label={`Packages in ${repository}`}>
        <thead className="type-ui-label"><tr><th scope="col" className="w-[65%] py-2">Package</th><th scope="col" className="w-[25%]">Version</th><th scope="col" className="w-[10%]"><span className="sr-only">Publication</span></th></tr></thead>
        <tbody className="divide-y divide-[var(--color-border-soft)]">{collection.data.records.map((item) => {
          const published = item.published || item.publication_status === "published";
          const Icon = published ? BadgeCheck : CircleDot;
          const status = String(item.publication_status || "Not observed");
          return <tr key={item.id}><td className="py-2 pr-2"><a href={String(item.route)} className="block truncate font-semibold text-accent hover:underline" title={`${item.name} (${item.ecosystem})`}>{String(item.name)}</a><span className="type-body-sm text-ink-muted">{String(item.ecosystem)}</span></td><td className="pr-2"><span className="block truncate tabular-nums" title={String(item.latest_version || "Not observed")}>{String(item.latest_version || "—")}</span></td><td><span title={status} aria-label={status} className={published ? "text-success" : "text-ink-muted"}><Icon className="h-4 w-4" aria-hidden="true" /><span className="sr-only">{status}</span></span></td></tr>;
        })}</tbody>
      </table> : <p className="type-body-sm py-4 text-ink-muted">{query || ecosystem || publication ? "No packages match these filters. Clear search or choose another status or ecosystem." : "No packages were observed in this repository."}</p>}
      <nav aria-label="Package inspector pagination" className="flex justify-end gap-2"><button type="button" disabled={collection.data.page <= 1 || collection.isFetching} onClick={() => setPage(collection.data.page - 1)} className="type-control min-h-8 px-2 text-accent disabled:opacity-40">Previous</button><button type="button" disabled={collection.data.page >= collection.data.page_count || collection.isFetching} onClick={() => setPage(collection.data.page + 1)} className="type-control min-h-8 px-2 text-accent disabled:opacity-40">Next</button></nav>
    </>}
    <a href={`/catalog/packages?${allParams}`} className="type-control inline-block min-h-8 text-accent hover:underline">View all repository packages →</a>
  </div>;
}
