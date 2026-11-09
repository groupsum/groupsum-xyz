import { useMemo, useState } from "react";
import { CatalogLink } from "./CatalogLink";
import { formatDate } from "./CatalogRecordShared";

const PAGE_SIZE = 10;

export default function PackageReleaseHistory({ releases }: { releases: Record<string, unknown>[] }) {
  const [requestedPage, setPage] = useState(1);
  const ordered = useMemo(() => [...releases].sort((a, b) => {
    const timestamp = (release: Record<string, unknown>) => Date.parse(String(release.published_at || "")) || -Infinity;
    return timestamp(b) - timestamp(a) || 0;
  }), [releases]);
  if (!ordered.length) return <p className="text-sm text-ink-muted">No release records were reported by the package registry.</p>;
  const pages = Math.ceil(ordered.length / PAGE_SIZE);
  const page = Math.min(requestedPage, pages);
  const offset = (page - 1) * PAGE_SIZE;
  const visible = ordered.slice(offset, offset + PAGE_SIZE);
  const control = "type-control min-h-9 px-2 text-accent focus-visible:outline disabled:opacity-40";
  return <div className="space-y-2">
    <table className="type-technical w-full table-fixed text-left [overflow-wrap:anywhere]" aria-label="Package releases">
      <thead className="type-ui-label border-b border-[var(--color-border-soft)]"><tr><th scope="col" className="w-[38%] py-2">Version</th><th scope="col" className="w-[39%]">Published</th><th scope="col">Source</th></tr></thead>
      <tbody className="divide-y divide-[var(--color-border-soft)]">{visible.map((release, index) => <tr key={String(release.id || offset + index)}>
        <td className="py-2 pr-2">{release.route ? <CatalogLink href={String(release.route)} className="font-semibold text-accent hover:underline">{String(release.version || "Unversioned release")}</CatalogLink> : <strong>{String(release.version || "Unversioned release")}</strong>}
          {(release.prerelease || release.draft) && <span className="block text-[10px] text-ink-muted">{release.draft ? "Draft" : "Prerelease"}</span>}
        </td>
        <td className="pr-2">{formatDate(release.published_at as string | undefined)}{release.observed_at && <span className="block text-[10px] text-ink-muted">Observed {formatDate(release.observed_at as string)}</span>}{typeof release.downloads === "number" && <span className="block text-[10px] text-ink-muted">{release.downloads.toLocaleString()} downloads</span>}</td>
        <td>{release.url ? <a href={String(release.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">Registry ↗</a> : "—"}</td>
      </tr>)}</tbody>
    </table>
    <nav aria-label="Release history pagination" className="flex flex-wrap items-center justify-between gap-2">
      <p role="status" className="type-body-sm text-ink-muted">Releases {offset + 1}–{offset + visible.length} of {ordered.length.toLocaleString()} · Page {page} of {pages}</p>
      <div className="flex gap-2"><button type="button" className={control} disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous (newer)</button><button type="button" className={control} disabled={page >= pages} onClick={() => setPage(page + 1)}>Next (older)</button></div>
    </nav>
  </div>;
}
