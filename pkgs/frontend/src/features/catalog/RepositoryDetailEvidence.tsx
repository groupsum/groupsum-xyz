import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCatalogSnapshots } from "../../api/catalog";
import { useCatalogVersion } from "../../api/catalog-version";
import { LinkedResourceSections } from "./CatalogCollections";
import { DetailRows, formatDate, humanLabel, isCurrentPageLink, valueRecord, valueRecords, type CatalogRecord } from "./CatalogRecordShared";
import { EntityOwnership } from "./EntityIdentity";
import { RepositorySourceObservations } from "./RepositorySourceObservations";

export function RepositoryDisclosure({ label, children }: { label: string; children: React.ReactNode }) {
  return <details className="min-w-0 border-t border-[var(--color-border-soft)] py-2">
    <summary className="type-control min-h-7 cursor-pointer text-accent hover:underline">{label}</summary>
    <div className="space-y-2 pb-2 type-body-sm [overflow-wrap:anywhere]">{children}</div>
  </details>;
}

function AnalyticsSnapshots({ record }: { record: CatalogRecord }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const version = useCatalogVersion();
  const pin = String(record.cache_snapshot_id || "");
  const snapshots = useQuery({
    queryKey: ["catalog-snapshots", pin],
    enabled: open && pin === version.snapshot_id,
    queryFn: ({ signal }) => getCatalogSnapshots(AbortSignal.any([signal, AbortSignal.timeout(15_000)])),
    staleTime: 60_000, retry: false,
  });
  const rows = snapshots.data?.snapshots ?? [];
  const snapshot = rows.find((row) => row.snapshot_id === (selected || pin)) ?? rows[0];
  return <details className="border-t border-[var(--color-border-soft)] py-2" onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary className="type-control min-h-7 cursor-pointer text-accent hover:underline">Analytics snapshots</summary>
    {open && <div className="space-y-2 type-body-sm">
      <p className="text-ink-muted">Collection metadata only. This does not change the repository or activity shown above.</p>
      {pin !== version.snapshot_id ? <p>Snapshot metadata is unavailable for this saved record.</p> : snapshots.isPending ? <p role="status">Loading snapshots…</p> : snapshots.isError ? <p role="alert">Could not load snapshots. <button className="text-accent underline" onClick={() => snapshots.refetch()}>Retry</button></p> : !snapshot ? <p>No analytics snapshots reported.</p> : <>
        <label className="flex flex-wrap items-center gap-2">Collection snapshot <select className="max-w-full rounded border border-[var(--color-border-soft)] bg-canvas p-1" value={snapshot.snapshot_id} onChange={(event) => setSelected(event.target.value)}>
          {rows.map((row) => <option key={row.snapshot_id} value={row.snapshot_id}>{formatDate(row.collected_at)}{row.snapshot_id === pin ? " · shown on page" : ""}</option>)}
        </select></label>
        <p>{snapshot.measurement_count.toLocaleString()} measurements · {snapshot.observation_count.toLocaleString()} observations · {snapshot.error_count.toLocaleString()} collection errors</p>
      </>}
    </div>}
  </details>;
}

export function RepositoryEvidence({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const governance = valueRecord(record.ssot_governance);
  const counts = Object.entries(valueRecord(governance.counts)).filter(([, value]) => typeof value === "number" && value > 0);
  const coverage = Object.entries(valueRecord(governance.coverage));
  const sources = [...(record.evidence || []), ...valueRecords(record.catalog_observations).map((item) => ({
    kind: String(item.source_kind || item.observation_type || "source"),
    url: item.source_url ? String(item.source_url) : undefined,
    observed_at: item.observed_at ? String(item.observed_at) : undefined,
  }))].filter((item) => !isCurrentPageLink(item.url));
  return <section id="governance-evidence" className="space-y-2">
    <h2 className="font-serif text-xl font-bold">Governance &amp; evidence</h2>
    {governance.governed ? <>
      <div id="ssot-governance" className="flex flex-wrap justify-between gap-2 type-body-sm"><span>Registry schema {String(governance.schema_version || "not reported")}</span>{governance.registry_url && <a href={String(governance.registry_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View canonical registry ↗</a>}</div>
      {counts.length > 0 && <p className="type-body-sm">{counts.map(([key, value]) => `${Number(value).toLocaleString()} ${key === "adrs" ? "ADRs" : key}`).join(" · ")}</p>}
      <p className="type-caption text-ink-muted">{String(governance.limitation || "Registry-reported counts and links do not independently validate claims.")}</p>
      <RepositoryDisclosure label="Registry details & claim linkage">
        <DetailRows rows={[
          ["Registry observed", formatDate(governance.observed_at as string | undefined)],
          ["Source digest", governance.source_sha256 ? <code>{String(governance.source_sha256)}</code> : null],
          ...coverage.map(([key, value]): [string, string] => [humanLabel(key), String(value)]),
        ]} />
        <LinkedResourceSections sections={record.linked_sections} onNavigate={onNavigate} />
      </RepositoryDisclosure>
    </> : <>
      <p className="type-body-sm text-ink-muted">No SSOT registry observed for this repository.</p>
      {valueRecords(record.linked_sections).length > 0 && <RepositoryDisclosure label="Linked resources"><LinkedResourceSections sections={record.linked_sections} onNavigate={onNavigate} /></RepositoryDisclosure>}
    </>}
    <RepositoryDisclosure label="Sources & observation boundary">
      {record.claim_boundary && <p>{String(record.claim_boundary)}</p>}
      <EntityOwnership graph={record.entity_graph} onNavigate={onNavigate} />
      {sources.length > 0 && <ul className="divide-y divide-[var(--color-border-soft)]">{sources.map((source, index) => <li key={index} className="py-1">{source.url ? <a href={source.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{humanLabel(source.kind || "source")}</a> : humanLabel(source.kind || "source")} · {formatDate(source.observed_at)}</li>)}</ul>}
    </RepositoryDisclosure>
    <AnalyticsSnapshots record={record} />
    <RepositorySourceObservations entityId={record.id} />
  </section>;
}
