import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEntityObservations } from "../../api/catalog";
import { formatDate, humanLabel } from "./CatalogRecordShared";

export function RepositorySourceObservations({ entityId }: { entityId: string }) {
  const [open, setOpen] = useState(false);
  const observations = useQuery({
    queryKey: ["repository-source-observations", entityId],
    enabled: open,
    queryFn: ({ signal }) => getEntityObservations("source.repository", entityId,
      AbortSignal.any([signal, AbortSignal.timeout(15_000)])),
    staleTime: 60_000,
    retry: false,
  });
  return <details className="min-w-0 border-t border-[var(--color-border-soft)] pt-3" onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary className="type-control min-h-8 cursor-pointer text-accent">Persisted source observations</summary>
    {open && <div className="type-body-sm min-w-0 py-2 [overflow-wrap:anywhere]">
      {observations.isPending && <p role="status">Loading source observations…</p>}
      {observations.isError && <p role="alert">Source observations could not be loaded. <button className="text-accent underline" onClick={() => observations.refetch()}>Retry</button></p>}
      {observations.data && <><p>{observations.data.count} source observations</p><ul className="divide-y divide-[var(--color-border-soft)]">{observations.data.observations.map((item) => <li key={item.observation_id} className="py-2">{item.source_url ? <a href={item.source_url} target="_blank" rel="noreferrer" className="text-accent underline">{humanLabel(item.source_kind || item.observation_type)}</a> : humanLabel(item.observation_type)} · {item.status} · {formatDate(item.observed_at)}</li>)}</ul></>}
    </div>}
  </details>;
}
