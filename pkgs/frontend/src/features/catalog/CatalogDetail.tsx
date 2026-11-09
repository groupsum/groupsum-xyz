import { lazy, Suspense, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCatalogVersion } from "../../api/catalog-version";
import { type EntityGraph, getCatalogPackageMember, getCatalogReleaseMember, getCatalogRepositoryMember, getCatalogResourceMember, getCatalogTechnologyMember } from "../../api/catalog";
import { BadgeCheck, ExternalLink, FileCode2, GitBranch, Package, ShieldCheck } from "lucide-react";
import { EntityOwnership } from "./EntityIdentity";
import { ContextRailCard, RecordIdentityCard } from "./CatalogVisuals";

import { LinkedResourceSections } from "./CatalogCollections";
import { CatalogRecordNavigation } from "./CatalogRecordNavigation";
import { PackageDetail, ReleaseDetail, ResourceDetail, TechnologyDetail } from "./CatalogMemberDetails";
import { PackageIdentityCard } from "./PackageIdentityCard";
import { CatalogPageMetadata } from "./CatalogPageMetadata";
import { datasetOrder, formatDate, humanLabel, isCurrentPageLink, metricItems, recordDescription, recordTitle, resourceIcon, valueRecord, valueRecords, type CatalogRecord, type DatasetName, type DetailDatasetName } from "./CatalogRecordShared";
import { catalogDetailSegments } from "./catalog-detail-route.mjs";

const RepositoryDetailPage = lazy(() => import("./RepositoryDetailPage"));
const SsotEntityDetail = lazy(() => import("./SsotEntityDetail"));

function resourceRecord(model: Awaited<ReturnType<typeof getCatalogPackageMember>>, routeKey: string, kind: string) {
  const item = valueRecord(model.item);
  const legal = valueRecord(model.legal);
  const implementation = valueRecord(model.implementation);
  return {
    ...item,
    id: String(item.id || routeKey),
    kind,
    cache_snapshot_id: model.snapshot_id || globalThis.__GROUPSUM_CATALOG_VERSION__?.snapshot_id,
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
  } as CatalogRecord;
}

function MemberSectionNav({ record }: { record: CatalogRecord }) {
  const kind = String(record.kind || "record");
  const linkedSectionLabels = valueRecords(record.linked_sections).map((section) => String(section.label || humanLabel(String(section.type_key || "resource"))));
  const sections = kind === "package" ? ["Package overview", "Relationships", "Release history"]
      : kind === "resource" ? [`${String(record.type_label || humanLabel(String(record.resource_type || "resource")))} overview`, ...linkedSectionLabels]
        : ["Overview", "Connected resources", "Source observations"];
  return <nav aria-label="On this record" className="sticky top-16 z-10 -mx-4 border-y border-[var(--color-border-soft)] bg-[color-mix(in_srgb,var(--color-canvas)_94%,transparent)] px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-[var(--radius-sm)] sm:border sm:px-3">
    <ul className="flex flex-wrap items-center gap-1">{sections.map((section) => { const id = section.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); return <li key={section}><a href={`#${id}`} className="inline-flex min-h-9 items-center rounded-[3px] px-3 type-ui-label text-ink-muted hover:bg-[var(--color-surface)] hover:text-accent">{section}</a></li>; })}</ul>
  </nav>;
}

export function PublicCatalogDetail({ path, onNavigate }: { path: string; onNavigate: (path: string) => void }) {
  const segments = catalogDetailSegments(path);
  const dataset = segments[1] as DetailDatasetName;
  const staticModel = globalThis.__GROUPSUM_API_SNAPSHOT__ as (Awaited<ReturnType<typeof getCatalogPackageMember>> & { static_path?: string; static_snapshot_id?: string }) | null | undefined;
  const normalizedPath = path.replace(/\/$/, "");
  const version = useCatalogVersion();
  const routeKey = segments.at(-1) || "";
  const kind = ({ repositories: "repository", packages: "package", resources: "resource", technologies: "technology", releases: "release" } as Record<string, string>)[dataset];
  const mapModel = (model: Awaited<ReturnType<typeof getCatalogPackageMember>>) => {
    const base = resourceRecord(model, routeKey, kind);
    if (kind === "repository") {
      const implementation = valueRecord(model.implementation);
      return { ...base, packages: implementation.packages, github_releases: implementation.releases, languages: implementation.languages, technologies: implementation.technologies, ssot_governance: model.governance } as CatalogRecord;
    }
    if (kind === "technology") return { ...base, display_name: valueRecord(model.item).label || base.name, related_records: model.related_records } as CatalogRecord;
    return base;
  };
  const staticRecord = staticModel?.static_path === normalizedPath && version.snapshot_id === staticModel.static_snapshot_id ? mapModel(staticModel) : undefined;
  const member = useQuery({
    queryKey: ["catalog-member", dataset, normalizedPath, version.snapshot_id],
    queryFn: async ({ signal }) => {
      const model = dataset === "packages" ? await getCatalogPackageMember(routeKey, signal)
        : dataset === "repositories" ? await getCatalogRepositoryMember(segments.at(-2) || "", routeKey, signal)
          : dataset === "resources" ? await getCatalogResourceMember(segments.at(-2) || "resource", routeKey, signal)
            : dataset === "releases" ? await getCatalogReleaseMember(routeKey, signal)
              : await getCatalogTechnologyMember(routeKey, signal);
      return { ...mapModel(model), cache_snapshot_id: model.snapshot_id || version.snapshot_id };
    },
    initialData: staticRecord, staleTime: version.public_projection_available ? Infinity : 60_000,
    placeholderData: (previous, query) => query?.queryKey[2] === normalizedPath ? previous : undefined,
    retry: false,
  });
  const last = useRef<{ path: string; record: CatalogRecord } | undefined>(undefined);
  if (member.data && !member.isPlaceholderData) last.current = { path: normalizedPath, record: member.data };
  const missing = member.isError && String(member.error).includes("404");
  const visible = member.data || (!missing && last.current?.path === normalizedPath ? last.current.record : undefined);
  const record = visible;
  const state = record ? "ready" : member.isPending ? "loading" : String(member.error).includes("404") ? "missing" : "error";

  if (state === "loading") return <div className="max-w-3xl mx-auto px-4 py-20 text-sm text-ink-muted" role="status">Loading catalog record…</div>;
  if (state !== "ready" || !record) return <div className="max-w-3xl mx-auto px-4 py-20 space-y-4"><h1 className="font-serif text-3xl font-bold text-ink">Record unavailable</h1><p className="text-sm text-ink-muted">{state === "error" ? "The catalog could not be loaded." : "This route is not in the public catalog."}</p><button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent hover:underline cursor-pointer">Return to public catalog</button></div>;

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
  const RecordIcon = record.kind === "package" ? Package : record.kind === "resource" ? resourceIcon(String(record.resource_type || "resource")) : FileCode2;
  const ssot = String(record.resource_type || "").startsWith("governance.");
  return (
    <article className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8 sm:space-y-10">
      {member.isPlaceholderData && <p role="status" className="type-body-sm text-ink-muted">Updating catalog observations…</p>}
      {member.isError && <p role="status" className="type-body-sm text-ink-muted">Showing saved record. Updates could not be loaded. <button className="text-accent underline" onClick={() => member.refetch()}>Retry</button></p>}
      <CatalogPageMetadata record={{ ...record, route: String(record.route || normalizedPath), title: `${recordTitle(record)} ${record.kind} | GroupSum catalog`, description: recordDescription(record), schemaFamily: `catalog-${record.kind}`, sourceUrl: record.source_url || record.url }} />
      {record.kind === "repository" ? <Suspense fallback={<p role="status">Loading repository layout…</p>}><RepositoryDetailPage record={record} primaryUrl={primaryUrl} onNavigate={onNavigate} /></Suspense> : <>
      <CatalogRecordNavigation dataset={dataset} record={record} onNavigate={onNavigate} />
      {record.kind === "package"
        ? <PackageIdentityCard record={record} primaryUrl={primaryUrl} onNavigate={onNavigate} />
        : <RecordIdentityCard eyebrow={`${humanLabel(String(record.kind || "catalog"))} member`} title={recordTitle(record)} summary={recordDescription(record)} Icon={RecordIcon} pills={[{ label: record.description_source === "reviewed-editorial" ? "Reviewed description" : "Source-derived description" }]} actions={primaryUrl && <a href={String(primaryUrl)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-sm)] bg-accent px-4 text-xs font-mono font-semibold text-[var(--color-on-accent)] hover:bg-accent-hover">Open primary source <ExternalLink className="h-3.5 w-3.5" /></a>} facts={metricItems(record, 5)} />}
      <MemberSectionNav record={record} />
      <div className={record.kind === "package" ? "min-w-0" : "grid grid-cols-1 items-start gap-8 lg:grid-cols-12"}>
      <main className={record.kind === "package" ? "min-w-0 space-y-6" : "space-y-6 lg:col-span-8"}>
      {record.kind === "package" && <PackageDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "resource" && (ssot ? <Suspense fallback={null}><SsotEntityDetail record={record} onNavigate={onNavigate} /></Suspense> : <ResourceDetail record={record} onNavigate={onNavigate} />)}
      {record.kind === "release" && <ReleaseDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "technology" && <TechnologyDetail record={record} onNavigate={onNavigate} />}
      </main>
      {record.kind !== "package" && <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-32">
        <ContextRailCard title="Source & observation boundary" Icon={ShieldCheck}><div className="space-y-3 text-xs leading-relaxed text-ink-muted"><p><strong className="text-ink">Observed:</strong> {formatDate(record.observed_at)}</p>{record.claim_boundary && <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-soft)] bg-canvas p-3"><strong className="mb-1 block text-ink">Explicit source boundary</strong>{String(record.claim_boundary)}</div>}{primaryUrl && <a href={String(primaryUrl)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 font-mono font-semibold text-accent hover:underline">Primary source <ExternalLink className="h-3.5 w-3.5" /></a>}</div></ContextRailCard>
        <ContextRailCard title="Ownership & canonical path" Icon={GitBranch}><EntityOwnership graph={record.entity_graph} onNavigate={onNavigate} /></ContextRailCard>
        {sourceObservations.length > 0 && <ContextRailCard title="Source observations" Icon={BadgeCheck}><ul className="divide-y divide-[var(--color-border-soft)]">{sourceObservations.map((item, index) => <li key={`${item.url || item.kind}-${index}`} className="py-3 text-xs">{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-words font-mono font-semibold text-accent hover:underline">{humanLabel(item.kind || "source")}<ExternalLink className="h-3.5 w-3.5" /></a> : <span className="text-ink-muted">{humanLabel(item.kind || "source")} · observed {formatDate(item.observed_at)}</span>}</li>)}</ul></ContextRailCard>}
      </aside>}
      </div>
      </>}
    </article>
  );
}
