import React, { useEffect, useMemo, useState } from "react";
import {
  catalogDatasetManifest,
  catalogOrganizations,
  catalogSummary,
} from "../../data/catalog.generated";
import { EntityGraph, getCatalogOverview, getRepositoryMetricSnapshot, RepositoryMetricRecord, type RepositorySignals } from "../../api/catalog.generated";
import { getCatalogPackageMember, getCatalogReleaseMember, getCatalogRepositoryMember, getCatalogResourceMember, getCatalogTechnologyMember } from "../../api/catalog";
import { Activity, ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Boxes, Braces, CalendarDays, Code2, ExternalLink, FileCode2, GitBranch, Globe2, Package, Scale, ServerCog, ShieldCheck } from "lucide-react";
import { RepositorySignalStrip } from "./RepositorySignals";
import { EntityOwnership } from "./EntityIdentity";
import { CatalogPill, CollectionHeader, ContextRailCard, FactPanel, MemberRowCard, RecordIdentityCard, SurfaceCard, factIcons, MetricBand, metricIcons, type MetricItem } from "./CatalogVisuals";
import { ExplorerFilterToolbar, TypeBadge, type ExplorerFilters } from "./CatalogExplorerUI";
import { PackageCollectionTable, RepositoryCollectionTable } from "./CatalogCollectionTables";
import { useCatalogCollection } from "../../hooks/useCatalogCollection";
import type { CatalogViewRecord } from "../../types/catalog-view";

import { datasetDetails, datasetOrder, DetailSection, formatDate, humanLabel, isCurrentPageLink, labels, metricItems, recordDescription, recordTitle, resourceIcon, valueRecord, valueRecords, valueStrings, type CatalogRecord, type DatasetName } from "./CatalogRecordShared";

export function CatalogSnapshotBand({
  onNavigate,
  owner,
  title = "Generated public ecosystem",
}: {
  onNavigate: (path: string) => void;
  owner?: string;
  title?: string;
}) {
  const organization = catalogOrganizations.find((item) => item.login === owner);
  const [repositories, setRepositories] = useState<RepositoryMetricRecord[]>([]);
  const [metricState, setMetricState] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    const controller = new AbortController();
    setMetricState("loading");
    getRepositoryMetricSnapshot("", controller.signal)
      .then((snapshot) => {
        const scoped = owner
          ? snapshot.repositories.filter((repository) => repository.owner === owner)
          : snapshot.repositories;
        setRepositories(scoped.slice(0, 4));
        setMetricState("ready");
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setMetricState("error");
      });
    return () => controller.abort();
  }, [owner]);
  const metrics = organization
    ? [
        ["Repositories", organization.repository_count],
        ["Package records", organization.package_count],
        ["Commits", organization.commits],
        ["Contributors", organization.contributors],
      ]
    : [
        ["Repositories", catalogSummary.repositories],
        ["Package records", catalogSummary.packages],
        ["Release records", catalogDatasetManifest.source_counts.releases],
        ["Typed resources", catalogDatasetManifest.counts.resources],
      ];

  return (
    <section className="border-y border-[var(--color-border-soft)] bg-[var(--color-surface)]">
      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-9 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent font-bold">Observed data · {formatDate(catalogSummary.generated_at)}</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">{title}</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              {organization?.description || "Public records compiled from GitHub, repository manifests, PyPI, npm, crates.io, and GitHub Packages. Releases and deployments are summarized on their repository or package records; live availability remains a separate evidence state."}
            </p>
          </div>
          <button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer">
            Explore complete catalog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map(([label, value]) => (
            <div key={String(label)} className="p-4 bg-canvas border border-[var(--color-border-soft)] rounded-[var(--radius-sm)]">
              <strong className="font-serif text-xl text-ink block">{Number(value).toLocaleString()}</strong>
              <span className="text-[10px] font-mono uppercase tracking-wide text-ink-muted">{label}</span>
            </div>
          ))}
        </div>
        <div className="min-h-[67rem] sm:min-h-[33rem] lg:min-h-[16rem]">
          {metricState === "loading" && <div className="min-h-[67rem] sm:min-h-[33rem] lg:min-h-[16rem] border-y border-[var(--color-border-soft)] py-8 text-sm text-ink-muted" role="status">Loading persisted repository activity…</div>}
          {metricState === "error" && <div className="min-h-[67rem] sm:min-h-[33rem] lg:min-h-[16rem] border-y border-[var(--color-border-soft)] py-6 text-sm text-ink-muted" role="alert">Persisted repository activity is temporarily unavailable.</div>}
          {repositories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {repositories.map((repository) => (
                <button key={repository.id} onClick={() => onNavigate(repository.route)} className="min-h-[16rem] text-left p-4 bg-canvas border border-[var(--color-border-soft)] rounded-[var(--radius-sm)] hover:border-accent transition-colors cursor-pointer space-y-3">
                  <div><span className="text-[10px] font-mono uppercase text-accent">{repository.owner}</span>
                  <h3 className="text-sm font-semibold text-ink mt-1">{repository.name}</h3>
                  <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2 mt-1">{repository.description}</p>
                  </div>
                  <RepositorySignalStrip signals={{ ...repository, repository_count: 1 }} compact />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function CollectionRow({ record, dataset, onNavigate }: { record: CatalogRecord; dataset: DatasetName; onNavigate: (path: string) => void }) {
  const type = String(record.resource_type || record.kind || dataset.slice(0, -1));
  const Icon = dataset === "resources" ? resourceIcon(type) : datasetDetails[dataset].Icon;
  const metrics = metricItems(record, 3);
  const route = String(record.route || "");
  const context = dataset === "repositories" ? String(record.owner || "Owner not recorded") : dataset === "packages" ? humanLabel(String(record.ecosystem || "Unknown ecosystem")) : dataset === "technologies" ? "Observed stack evidence" : String(record.repository || "Repository not linked");
  const technologies = dataset === "packages" ? valueStrings(record.technologies) : [];
  return <MemberRowCard
    title={recordTitle(record)}
    summary={recordDescription(record)}
    eyebrow={humanLabel(type)}
    owner={context}
    route={route}
    onNavigate={onNavigate}
    Icon={Icon}
    badge={dataset === "resources" ? <TypeBadge value={humanLabel(type)} /> : undefined}
    pills={[
      ...(record.kind === "repository" && Boolean(record.ssot_governance && valueRecord(record.ssot_governance).governed) ? ["SSOT governed"] : []),
      ...technologies.slice(0, 5),
    ]}
    facts={metrics.filter((item): item is MetricItem & { value: number } => typeof item.value === "number").map((item) => ({ label: item.label, value: item.value }))}
  />;
}

export function LinkedResourceSections({ sections, onNavigate }: { sections: unknown; onNavigate: (path: string) => void }) {
  return <>{valueRecords(sections).map((section) => {
    const members = valueRecords(section.members);
    if (!members.length) return null;
    const typeKey = String(section.type_key || "resource");
    const label = String(section.label || humanLabel(typeKey));
    const Icon = resourceIcon(typeKey);
    return <DetailSection key={typeKey} title={label} intro={`${members.length.toLocaleString()} directly linked ${members.length === 1 ? "resource" : "resources"}.`}>
      <ul className="divide-y divide-[var(--color-border-soft)]">
        {members.map((member) => <li key={String(member.id)} className="flex flex-wrap items-center gap-x-5 gap-y-3 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] border border-[var(--color-border-soft)] bg-canvas text-accent"><Icon className="h-4 w-4" aria-hidden="true" /></span>
          <div className="min-w-0 flex-[1_1_20rem]"><p className="break-words text-sm font-semibold text-ink">{String(member.name || "Untitled resource")}</p>{member.summary && <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{String(member.summary)}</p>}<p className="mt-1 text-[9px] font-mono uppercase tracking-wide text-ink-muted">{humanLabel(String(member.relationship || "linked"))} · {humanLabel(String(member.direction || "observed"))}</p></div>
          <div className="flex flex-wrap items-center gap-3">{member.route && <a href={String(member.route)} onClick={(event) => { event.preventDefault(); onNavigate(String(member.route)); }} className="inline-flex min-h-10 items-center text-xs font-mono font-semibold text-accent hover:underline">View {label.toLowerCase()}</a>}{member.source_url && !isCurrentPageLink(member.source_url) && <a href={String(member.source_url)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 text-xs font-mono text-accent hover:underline">Source <ExternalLink className="h-3.5 w-3.5" /></a>}</div>
        </li>)}
      </ul>
    </DetailSection>;
  })}</>;
}

export function PublicCatalogOverview({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [counts, setCounts] = useState<Record<DatasetName, number>>(() => Object.fromEntries(datasetOrder.map((name) => [name, Number(catalogDatasetManifest.counts[name] || 0)])) as Record<DatasetName, number>);
  const [primaryCounts, setPrimaryCounts] = useState({ products: 0, portfolio: 0 });
  useEffect(() => {
    const controller = new AbortController();
    getCatalogOverview(controller.signal).then((model) => {
      setCounts(Object.fromEntries(datasetOrder.map((name) => [name, Number(model.counts[name] || 0)])) as Record<DatasetName, number>);
      setPrimaryCounts({ products: Number(model.counts.products || 0), portfolio: Number(model.counts.portfolio || 0) });
    }).catch(() => undefined);
    return () => controller.abort();
  }, []);
  const collections = [
    { key: "products", label: "Products", route: "/products", value: primaryCounts.products, description: "Reviewed public products with purpose, audience, maturity, and implementation evidence.", Icon: Boxes },
    { key: "portfolio", label: "Portfolio", route: "/portfolio", value: primaryCounts.portfolio, description: "Strategic portfolio records grouping related products and implementation resources.", Icon: BadgeCheck },
    ...datasetOrder.map((name) => ({ key: name, label: labels[name], route: `/catalog/${name}`, value: counts[name], description: datasetDetails[name].description, Icon: datasetDetails[name].Icon })),
  ];
  return <section className="catalog-explorer mx-auto max-w-[var(--content-max)] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <CollectionHeader
      eyebrow="Supporting evidence and public catalog explorer"
      title="GroupSum ecosystem catalog"
      description="Traverse reviewed products and portfolio records into repositories, contained packages, typed resources, and observed stack evidence without losing ownership context."
      observedAt={formatDate(catalogSummary.generated_at)}
      exportHref="/catalog/catalog.json"
      facts={datasetOrder.map((name) => ({ label: labels[name], value: counts[name], icon: datasetDetails[name].Icon }))}
    />
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => {
        const Icon = collection.Icon;
        return <article key={collection.key} className="group relative flex min-w-0 items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-white p-4 transition-colors hover:border-accent hover:bg-[#FAF9F6]">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[3px] border border-[var(--color-border-soft)] bg-surface text-accent"><Icon className="h-4.5 w-4.5" aria-hidden="true" /></div>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-serif text-lg font-bold text-ink"><a href={collection.route} onClick={(event) => { event.preventDefault(); onNavigate(collection.route); }} className="hover:text-accent before:absolute before:inset-0 before:content-['']">{collection.label}</a></h2><strong className="font-mono text-lg tabular-nums text-ink">{collection.value.toLocaleString()}</strong></div><p className="mt-1 text-[11px] leading-relaxed text-ink-muted">{collection.description}</p><span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-accent">Browse collection <ArrowRight className="h-3.5 w-3.5" /></span></div>
        </article>;
      })}
    </div>
    <SurfaceCard title="Canonical resource hierarchy" Icon={GitBranch} intro="Collection pages summarize a resource family; member pages preserve local ownership, evidence, metrics, and navigation to parents and children.">
      <p className="font-mono text-xs leading-relaxed text-ink-muted">Organization → product or portfolio → repository → package or typed resource → release evidence</p>
    </SurfaceCard>
  </section>;
}

export function PublicCatalogExplorer({ onNavigate, compact = false, fixedDataset, initialQuery = "" }: { onNavigate: (path: string) => void; compact?: boolean; fixedDataset?: DatasetName; initialQuery?: string }) {
  const [dataset, setDataset] = useState<DatasetName>(fixedDataset || "repositories");
  const [filters, setFilters] = useState<ExplorerFilters>({ search: initialQuery, owner: "", ecosystem: "", publication: "", resourceType: "", sort: "name" });
  const [page, setPage] = useState(1);
  const pageSize = compact ? 24 : 50;

  useEffect(() => {
    if (fixedDataset) setDataset(fixedDataset);
  }, [fixedDataset]);

  useEffect(() => setFilters((current) => ({ ...current, search: initialQuery })), [initialQuery]);

  const collection = useCatalogCollection(dataset, {
    page,
    page_size: pageSize,
    q: filters.search || undefined,
    owner: dataset === "repositories" ? filters.owner || undefined : undefined,
    ecosystem: dataset === "packages" ? filters.ecosystem || undefined : undefined,
    publication_status: dataset === "packages" ? filters.publication || undefined : undefined,
    resource_type: dataset === "resources" ? filters.resourceType || undefined : undefined,
    repository_owner: dataset === "resources" ? filters.owner || undefined : undefined,
    sort: filters.sort,
  });
  const records = useMemo(() => {
    const kind = dataset === "technologies" ? "technology" : dataset.slice(0, -1);
    return (collection.data?.records || []).map((record) => ({ ...record, kind })) as CatalogRecord[];
  }, [collection.data?.records, dataset]);
  const state = collection.isPending ? "loading" : collection.isError ? "error" : "ready";

  const facetValues = (name: string) => Object.keys(collection.data?.facets?.[name] || {}).sort();
  const filterOptions = {
    owners: dataset === "resources" ? facetValues("repository_owner") : facetValues("owner"),
    ecosystems: facetValues("ecosystem"),
    publications: facetValues("publication_status"),
    resourceTypes: facetValues("resource_type"),
  };
  const summaryFacts = useMemo<MetricItem[]>(() => {
    if (dataset === "repositories") return [
      { label: "Repositories", value: Number(collection.data?.count || 0), icon: Code2, color: "text-emerald-700" },
      { label: "Stars on page", value: records.reduce((total, record) => total + Number(valueRecord(record.metrics).stars || 0), 0), icon: metricIcons.stars, color: "text-amber-600" },
      { label: "SSOT governed on page", value: records.filter((record) => Boolean(record.ssot_governed)).length, icon: ShieldCheck, color: "text-indigo-600" },
      { label: "Packages on page", value: records.reduce((total, record) => total + Number(record.package_count || 0), 0), icon: Package, color: "text-orange-600" },
    ];
    if (dataset === "packages") return [
      { label: "Packages", value: Number(collection.data?.count || 0), icon: Package, color: "text-orange-600" },
      { label: "Published on page", value: records.filter((record) => Boolean(record.published) || record.publication_status === "published").length, icon: BadgeCheck, color: "text-sky-600" },
      { label: "Releases on page", value: records.reduce((total, record) => total + Number(record.release_count || 0), 0), icon: metricIcons.releases, color: "text-violet-600" },
      { label: "Ecosystems", value: filterOptions.ecosystems.length, icon: Boxes, color: "text-emerald-700" },
    ];
    if (dataset === "resources") return [
      { label: "Typed resources", value: records.length, icon: Braces },
      { label: "Resource types", value: filterOptions.resourceTypes.length, icon: FileCode2 },
      { label: "Source-linked", value: records.filter((record) => Boolean(record.url || record.source_url)).length, icon: ExternalLink },
      { label: "Repository-owned", value: records.filter((record) => Boolean(record.repository || record.repository_id)).length, icon: GitBranch },
    ];
    return [{ label: "Technology tags", value: records.length, icon: ServerCog }, { label: "Repository references", value: records.reduce((total, record) => total + Number(record.repository_count || 0), 0), icon: Code2 }];
  }, [collection.data?.count, dataset, filterOptions, records]);
  const pages = Number(collection.data?.page_count || 1);
  const visible = records;

  return (
    <section className="catalog-explorer max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {!compact && (
        <div className="space-y-5">
          <button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Catalog overview</button>
          <CollectionHeader eyebrow={`${labels[dataset]} collection`} title={labels[dataset]} description={datasetDetails[dataset].description} observedAt={formatDate(catalogSummary.generated_at)} exportHref={`/catalog/site/${dataset}.json`} facts={summaryFacts} />
        </div>
      )}
      {!fixedDataset && <div className="flex flex-wrap gap-2" aria-label="Catalog datasets" role="tablist">
        {datasetOrder.map((name) => (
          <button key={name} type="button" role="tab" onClick={() => setDataset(name)} aria-selected={dataset === name} className={`min-h-20 min-w-0 flex-[1_1_16rem] rounded-[var(--radius-md)] border px-4 py-3 text-left cursor-pointer transition-colors ${dataset === name ? "bg-accent text-white border-accent" : "bg-[var(--color-surface)] text-ink-muted border-[var(--color-border-soft)] hover:border-[var(--color-border-accent-soft)]"}`}>
            <span className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-xs font-mono font-semibold">{React.createElement(datasetDetails[name].Icon, { className: "h-4 w-4", "aria-hidden": true })}{labels[name]}</span><strong className="font-serif text-lg tabular-nums">{Number(catalogDatasetManifest.counts[name]).toLocaleString()}</strong></span>
            <span className={`mt-1 block text-[10px] leading-snug ${dataset === name ? "text-white/75" : "text-ink-muted"}`}>{datasetDetails[name].description}</span>
          </button>
        ))}
      </div>}
      <ExplorerFilterToolbar filters={filters} onChange={(next) => { setFilters(next); setPage(1); }} owners={dataset === "repositories" ? Object.keys(collection.data?.facets?.owner || {}) : []} ecosystems={dataset === "packages" ? Object.keys(collection.data?.facets?.ecosystem || {}) : []} publications={dataset === "packages" ? Object.keys(collection.data?.facets?.publication_status || {}) : []} resourceTypes={dataset === "resources" ? Object.keys(collection.data?.facets?.resource_type || {}) : []} sortOptions={[{ label: "Name (A–Z)", value: "name" }, { label: "Most activity", value: "activity" }, { label: "Recently observed", value: "recent" }]} total={Number(collection.data?.count || 0)} />
      {state === "loading" && <div className="p-10 text-center text-sm text-ink-muted" role="status">Loading {labels[dataset].toLowerCase()}…</div>}
      {state === "error" && <div className="p-6 border border-red-500/20 bg-red-500/5 text-sm text-red-700 rounded-[var(--radius-sm)]" role="alert">The generated dataset could not be loaded. The normalized JSON remains available from the download links below.</div>}
      {state === "ready" && (
        <>
          <div className="text-xs font-mono text-ink-muted">{Number(collection.data?.count || 0).toLocaleString()} matching records · page {page.toLocaleString()} of {pages.toLocaleString()}</div>
          {dataset === "repositories" ? <RepositoryCollectionTable records={visible} onNavigate={onNavigate} /> : dataset === "packages" ? <PackageCollectionTable records={visible} onNavigate={onNavigate} /> : <div className="space-y-3">{visible.map((record) => <CollectionRow key={record.id} record={record} dataset={dataset} onNavigate={onNavigate} />)}</div>}
          {visible.length === 0 && <div className="p-10 text-center border border-[var(--color-border-soft)] rounded-[var(--radius-md)] text-sm text-ink-muted">No generated records match this search.</div>}
          {pages > 1 && <div className="flex items-center justify-between gap-4"><button disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="px-3 py-2 text-xs font-mono border border-[var(--color-border-soft)] rounded disabled:opacity-40 cursor-pointer">Previous</button><button disabled={page === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))} className="px-3 py-2 text-xs font-mono border border-[var(--color-border-soft)] rounded disabled:opacity-40 cursor-pointer">Next</button></div>}
        </>
      )}
      <div className="flex flex-wrap gap-4 text-xs font-mono">
        <a href="/catalog/catalog.json" className="text-accent hover:underline">Complete normalized catalog</a>
        <a href="/catalog/site/manifest.json" className="text-accent hover:underline">Dataset manifest</a>
        <a href="/catalog/schema.json" className="text-accent hover:underline">Catalog schema</a>
      </div>
    </section>
  );
}
