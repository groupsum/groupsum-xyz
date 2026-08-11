import { useEffect, useState } from "react";
import { getCatalogSnapshots, getEntityMetrics, getEntityObservations, type CatalogSnapshot, type EntityGraph, getCatalogPackageMember, getCatalogReleaseMember, getCatalogRepositoryMember, getCatalogResourceMember, getCatalogTechnologyMember } from "../../api/catalog";
import { BadgeCheck, Code2, ExternalLink, FileCode2, GitBranch, Package, ShieldCheck } from "lucide-react";
import { EntityOwnership } from "./EntityIdentity";
import { ContextRailCard, RecordIdentityCard } from "./CatalogVisuals";

import { LinkedResourceSections } from "./CatalogCollections";
import { CatalogRecordNavigation } from "./CatalogRecordNavigation";
import { PackageDetail, ReleaseDetail, RepositoryDetail, ResourceDetail, TechnologyDetail } from "./CatalogMemberDetails";
import { PackageIdentityCard } from "./PackageIdentityCard";
import { datasetOrder, formatDate, humanLabel, isCurrentPageLink, metricItems, recordDescription, recordTitle, resourceIcon, valueRecord, valueRecords, type CatalogRecord, type DatasetName, type DetailDatasetName } from "./CatalogRecordShared";
import { catalogDetailSegments } from "./catalog-detail-route.mjs";

function MemberSectionNav({ record }: { record: CatalogRecord }) {
  const kind = String(record.kind || "record");
  const linkedSectionLabels = valueRecords(record.linked_sections).map((section) => String(section.label || humanLabel(String(section.type_key || "resource"))));
  const sections = kind === "repository" ? ["Repository overview", "Observed activity", "Contributors", "Release activity", ...(record.ssot_governance && Boolean(record.ssot_governance.governed) ? ["SSOT governance"] : []), "Latest observed events", "Contained packages", ...linkedSectionLabels]
    : kind === "package" ? ["Package overview", "Dependencies", "Dependents", "Release history"]
      : kind === "resource" ? [`${String(record.type_label || humanLabel(String(record.resource_type || "resource")))} overview`, ...linkedSectionLabels]
        : ["Overview", "Connected resources", "Source observations"];
  return <nav aria-label="On this record" className="sticky top-16 z-10 -mx-4 border-y border-[var(--color-border-soft)] bg-[color-mix(in_srgb,var(--color-canvas)_94%,transparent)] px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-[var(--radius-sm)] sm:border sm:px-3">
    <ul className="flex flex-wrap items-center gap-1">{sections.map((section) => { const id = section.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); return <li key={section}><a href={`#${id}`} className="inline-flex min-h-9 items-center rounded-[3px] px-3 text-[10px] font-mono font-semibold uppercase tracking-wide text-ink-muted hover:bg-[var(--color-surface)] hover:text-accent">{section}</a></li>; })}</ul>
  </nav>;
}

export function PublicCatalogDetail({ path, onNavigate }: { path: string; onNavigate: (path: string) => void }) {
  const segments = catalogDetailSegments(path);
  const dataset = segments[1] as DetailDatasetName;
  const [record, setRecord] = useState<CatalogRecord | null>(null);
  const [snapshots, setSnapshots] = useState<CatalogSnapshot[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    setState("loading");
    setRecord(null);
    setSnapshots([]);
    const controller = new AbortController();
    const routeKey = segments.at(-1) || "";

    const acceptResourceMember = (model: Awaited<ReturnType<typeof getCatalogPackageMember>>, kind: string) => {
      const item = valueRecord(model.item);
      const legal = valueRecord(model.legal);
      const implementation = valueRecord(model.implementation);
      setRecord({
        ...item,
        id: String(item.id || routeKey),
        kind,
        resource_type: model.resource_type,
        parent: model.parent,
        entity_graph: model.graph as EntityGraph | null,
        linked_sections: model.linked_sections,
        legal_observations: valueRecords(legal.observations),
        license_expression: legal.license_expression,
        license_status: legal.status,
        repositories: implementation.repositories,
        releases: implementation.releases,
        dependencies: implementation.dependencies,
        dependents: implementation.dependents,
        downloads: valueRecord(implementation.downloads).value,
      } as CatalogRecord);
      setState("ready");
    };

    if (dataset === "releases") {
      getCatalogReleaseMember(routeKey, controller.signal)
        .then((model) => acceptResourceMember(model, "release"))
        .catch((error: Error) => { if (error.name !== "AbortError") setState(error.message.includes("404") ? "missing" : "error"); });
      return () => controller.abort();
    }
    if (dataset === "technologies") {
      getCatalogTechnologyMember(routeKey, controller.signal)
        .then((model) => {
          const item = valueRecord(model.item);
          setRecord({ ...item, id: String(item.id || routeKey), kind: "technology", display_name: item.label || item.name, related_records: model.related_records } as CatalogRecord);
          setState("ready");
        })
        .catch((error: Error) => { if (error.name !== "AbortError") setState(error.message.includes("404") ? "missing" : "error"); });
      return () => controller.abort();
    }
    if (!datasetOrder.includes(dataset as DatasetName)) {
      setState("missing");
      return;
    }

    const request = dataset === "packages"
      ? getCatalogPackageMember(routeKey, controller.signal).then((model) => acceptResourceMember(model, "package"))
      : dataset === "resources"
        ? getCatalogResourceMember(segments.at(-2) || "resource", routeKey, controller.signal).then((model) => acceptResourceMember(model, "resource"))
        : getCatalogRepositoryMember(segments.at(-2) || "", routeKey, controller.signal).then((model) => {
          const item = valueRecord(model.item);
          const implementation = valueRecord(model.implementation);
          const legal = valueRecord(model.legal);
          const repositoryRecord = { ...item, id: String(item.id || routeKey), kind: "repository", entity_graph: model.graph as EntityGraph | null, linked_sections: model.linked_sections, packages: implementation.packages, releases: implementation.releases, languages: implementation.languages, technologies: implementation.technologies, ssot_governance: model.governance, legal_observations: valueRecords(legal.observations), license_expression: legal.license_expression, license_status: legal.status } as CatalogRecord;
          return Promise.all([
            getEntityMetrics("source.repository", String(repositoryRecord.id), controller.signal),
            getCatalogSnapshots(controller.signal),
            getEntityObservations("source.repository", String(repositoryRecord.id), controller.signal),
          ])
            .then(([analytics, snapshotCollection, observations]) => {
              const availableSnapshots = snapshotCollection.snapshots;
              const selectedSnapshot = availableSnapshots.find((snapshot) => snapshot.is_current) || availableSnapshots[0];
              setSnapshots(availableSnapshots);
              setRecord({ ...repositoryRecord, analytics_points: analytics.points, catalog_observations: observations.observations, selected_snapshot_id: selectedSnapshot?.snapshot_id } as CatalogRecord);
            })
            .catch(() => setRecord(repositoryRecord))
            .finally(() => setState("ready"));
        });
    request.catch((error: Error) => { if (error.name !== "AbortError") setState(error.message.includes("404") ? "missing" : "error"); });
    return () => controller.abort();
  }, [dataset, path]);

  if (state === "loading") return <div className="max-w-3xl mx-auto px-4 py-20 text-sm text-ink-muted" role="status">Loading generated catalog record…</div>;
  if (state !== "ready" || !record) return <div className="max-w-3xl mx-auto px-4 py-20 space-y-4"><h1 className="font-serif text-3xl font-bold text-ink">Catalog record unavailable</h1><p className="text-sm text-ink-muted">{state === "error" ? "The generated catalog could not be loaded. Please try again shortly." : "The route is not present in the current generated public dataset."}</p><button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent hover:underline cursor-pointer">Return to public catalog</button></div>;

  const primaryCandidate = record.url || record.registry_url || record.source_url;
  const primaryUrl = isCurrentPageLink(primaryCandidate) ? undefined : primaryCandidate;
  const sourceObservations = [
    ...(record.evidence || []),
    ...valueRecords(record.catalog_observations).map((item) => ({
      kind: String(item.source_kind || item.observation_type || "source"),
      url: item.source_url ? String(item.source_url) : undefined,
      observed_at: item.observed_at ? String(item.observed_at) : undefined,
    })),
  ].filter((item) => !isCurrentPageLink(item.url));
  const RecordIcon = record.kind === "repository" ? Code2 : record.kind === "package" ? Package : record.kind === "resource" ? resourceIcon(String(record.resource_type || "resource")) : FileCode2;
  return (
    <article className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8 sm:space-y-10">
      <CatalogRecordNavigation dataset={dataset} record={record} onNavigate={onNavigate} />
      {record.kind === "package"
        ? <PackageIdentityCard record={record} primaryUrl={primaryUrl} onNavigate={onNavigate} />
        : <RecordIdentityCard eyebrow={`${humanLabel(String(record.kind || "catalog"))} member`} title={recordTitle(record)} summary={recordDescription(record)} Icon={RecordIcon} pills={[...(record.kind === "repository" && Boolean(record.ssot_governance?.governed) ? [{ label: "SSOT governed", tone: "accent" as const }] : []), { label: record.description_source === "reviewed-editorial" ? "Reviewed description" : "Source-derived description" }]} actions={primaryUrl && <a href={String(primaryUrl)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-sm)] bg-accent px-4 text-xs font-mono font-semibold text-white hover:bg-accent-hover">Open primary source <ExternalLink className="h-3.5 w-3.5" /></a>} facts={metricItems(record, 5)} />}
      <MemberSectionNav record={record} />
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <main className="space-y-6 lg:col-span-8">
      {record.kind === "repository" && <RepositoryDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "package" && <PackageDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "resource" && <ResourceDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "release" && <ReleaseDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "technology" && <TechnologyDetail record={record} onNavigate={onNavigate} />}
      </main>
      <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-32">
        {record.kind === "repository" && snapshots.length > 0 && <ContextRailCard title="Analytics snapshot" Icon={BadgeCheck}><div className="space-y-3 text-xs text-ink-muted"><label className="block"><span className="mb-1 block font-mono text-[9px] uppercase tracking-wide">Point-in-time view</span><select value={String(record.selected_snapshot_id || "")} onChange={(event) => setRecord((current) => current ? { ...current, selected_snapshot_id: event.target.value } : current)} className="w-full rounded border border-[var(--color-border-soft)] bg-surface px-2 py-2 font-mono text-xs text-ink">{snapshots.map((snapshot) => <option key={snapshot.snapshot_id} value={snapshot.snapshot_id}>{formatDate(snapshot.collected_at)}{snapshot.is_current ? " · current" : ""}</option>)}</select></label><p>{snapshots.find((snapshot) => snapshot.snapshot_id === record.selected_snapshot_id)?.measurement_count.toLocaleString() || "0"} measurements · {snapshots.find((snapshot) => snapshot.snapshot_id === record.selected_snapshot_id)?.observation_count.toLocaleString() || "0"} observations</p><p>{snapshots.find((snapshot) => snapshot.snapshot_id === record.selected_snapshot_id)?.error_count ? `${snapshots.find((snapshot) => snapshot.snapshot_id === record.selected_snapshot_id)?.error_count} collection errors reported` : "No collection errors reported for this snapshot"}</p></div></ContextRailCard>}
        <ContextRailCard title="Source & observation boundary" Icon={ShieldCheck}><div className="space-y-3 text-xs leading-relaxed text-ink-muted"><p><strong className="text-ink">Observed:</strong> {formatDate(record.observed_at)}</p>{record.claim_boundary && <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-soft)] bg-canvas p-3"><strong className="mb-1 block text-ink">Explicit source boundary</strong>{String(record.claim_boundary)}</div>}{primaryUrl && <a href={String(primaryUrl)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 font-mono font-semibold text-accent hover:underline">Primary source <ExternalLink className="h-3.5 w-3.5" /></a>}</div></ContextRailCard>
        <ContextRailCard title="Ownership & canonical path" Icon={GitBranch}><EntityOwnership graph={record.entity_graph} onNavigate={onNavigate} /></ContextRailCard>
        {sourceObservations.length > 0 && <ContextRailCard title="Source observations" Icon={BadgeCheck}><ul className="divide-y divide-[var(--color-border-soft)]">{sourceObservations.map((item, index) => <li key={`${item.url || item.kind}-${index}`} className="py-3 text-xs">{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-words font-mono font-semibold text-accent hover:underline">{humanLabel(item.kind || "source")}<ExternalLink className="h-3.5 w-3.5" /></a> : <span className="text-ink-muted">{humanLabel(item.kind || "source")} · observed {formatDate(item.observed_at)}</span>}</li>)}</ul></ContextRailCard>}
      </aside>
      </div>
    </article>
  );
}
