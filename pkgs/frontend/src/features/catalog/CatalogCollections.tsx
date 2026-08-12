import React, { useEffect, useMemo, useState } from "react";
import { getRepositoryMetricSnapshot, RepositoryMetricRecord, type RepositorySignals } from "../../api/catalog";
import { AlertTriangle, ArrowRight, Box, Calendar, CheckCircle2, Cpu, ExternalLink, FileCode, FolderGit2, GitBranch, Layers, Package, ShieldCheck, Star, Terminal } from "lucide-react";
import { RepositorySignalStrip } from "./RepositorySignals";
import { EntityOwnership } from "./EntityIdentity";
import { CatalogPill, CollectionHeader, ContextRailCard, FactPanel, MemberRowCard, RecordIdentityCard, SurfaceCard, factIcons, MetricBand, type MetricItem } from "./CatalogVisuals";
import { ExplorerFilterToolbar, TypeBadge, type ExplorerFilters } from "./CatalogExplorerUI";
import { PackageCollectionTable, RepositoryCollectionTable } from "./CatalogCollectionTables";
import { ResourceTypeDirectory } from "./ResourceTypeDirectory";
import { useCatalogCollection } from "../../hooks/useCatalogCollection";
import { useCatalogOverview } from "../../hooks/useCatalogOverview";
import type { CatalogViewRecord } from "../../types/catalog-view";

import { datasetDetails, datasetOrder, DetailSection, formatDate, humanLabel, isCurrentPageLink, labels, recordDescription, recordTitle, resourceIcon, valueRecord, valueRecords, valueStrings, type CatalogRecord, type DatasetName } from "./CatalogRecordShared";

export function CatalogSnapshotBand({
  onNavigate,
  owner,
  title = "Current public ecosystem",
}: {
  onNavigate: (path: string) => void;
  owner?: string;
  title?: string;
}) {
  const overview = useCatalogOverview();
  const [repositories, setRepositories] = useState<RepositoryMetricRecord[]>([]);
  const [repositorySummary, setRepositorySummary] = useState({ count: 0, stars: 0, commits: 0, contributors: 0 });
  const [metricsGeneratedAt, setMetricsGeneratedAt] = useState<string | null>(null);
  const [metricState, setMetricState] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    const controller = new AbortController();
    setMetricState("loading");
    getRepositoryMetricSnapshot(owner || "", controller.signal)
      .then((snapshot) => {
        const scoped = snapshot.repositories;
        setRepositories(scoped.slice(0, 4));
        setRepositorySummary(scoped.reduce(
          (totals, repository) => ({
            count: totals.count + 1,
            stars: totals.stars + Number(repository.metrics.stars || 0),
            commits: totals.commits + Number(repository.metrics.commits || 0),
            contributors: totals.contributors + Number(repository.metrics.contributors || 0),
          }),
          { count: 0, stars: 0, commits: 0, contributors: 0 },
        ));
        setMetricsGeneratedAt(snapshot.generated_at || null);
        setMetricState("ready");
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setMetricState("error");
      });
    return () => controller.abort();
  }, [owner]);
  const metrics: Array<[string, number | undefined]> = owner
    ? [
        ["Repositories", metricState === "ready" ? repositorySummary.count : undefined],
        ["Stars", metricState === "ready" ? repositorySummary.stars : undefined],
        ["Commits", metricState === "ready" ? repositorySummary.commits : undefined],
        ["Contributors", metricState === "ready" ? repositorySummary.contributors : undefined],
      ]
    : [
        ["Repositories", overview.data?.counts.repositories],
        ["Package records", overview.data?.counts.packages],
        ["Typed resources", overview.data?.counts.resources],
        ["Technologies", overview.data?.counts.technologies],
      ];
  const observedAt = overview.data?.generated_at || metricsGeneratedAt;

  return (
    <section className="border-y border-[var(--color-border-soft)] bg-[var(--color-surface)]">
      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-9 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent font-bold">Observed data · {observedAt ? formatDate(observedAt) : "Loading current observation"}</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">{title}</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Public records served by the catalog API from GitHub, repository manifests, PyPI, npm, crates.io, and GitHub Packages. Releases and deployments are summarized on their repository or package records; live availability remains a separate evidence state.
            </p>
          </div>
          <button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer">
            Explore complete catalog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map(([label, value]) => (
            <div key={String(label)} className="p-4 bg-canvas border border-[var(--color-border-soft)] rounded-[var(--radius-sm)]">
              <strong className="font-serif text-xl text-ink block">{value === undefined ? "—" : value.toLocaleString()}</strong>
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
  const route = String(record.route || "");
  const repository = valueRecords(record.repositories)[0] || valueRecord(record.repository);
  const context = dataset === "repositories"
    ? String(record.owner || "Owner not recorded")
    : dataset === "packages"
      ? humanLabel(String(record.ecosystem || "Unknown ecosystem"))
      : dataset === "technologies"
        ? `Category: ${humanLabel(String(record.category || "Uncategorized"))}`
        : repository.owner && repository.name
          ? `${String(repository.owner)}/${String(repository.name)}`
          : String(record.repository_name || record.repository || "Global Resource");
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
  const overview = useCatalogOverview();
  const collectionPresentation = {
    products: { Icon: Box, iconClass: "text-[#2E6B9E]", iconBackground: "bg-[#EBF3FA]" },
    portfolio: { Icon: Layers, iconClass: "text-[#5B4699]", iconBackground: "bg-[#F3E8FF]" },
    repositories: { Icon: FolderGit2, iconClass: "text-[#166534]", iconBackground: "bg-[#DCFCE7]" },
    packages: { Icon: Package, iconClass: "text-[#C46D20]", iconBackground: "bg-[#FEF3C7]" },
    resources: { Icon: FileCode, iconClass: "text-[#0369A1]", iconBackground: "bg-[#E0F2FE]" },
    technologies: { Icon: Cpu, iconClass: "text-[#B45309]", iconBackground: "bg-[#FFEDD5]" },
  } as const;
  const collections = [
    { key: "products", label: "Products", route: "/products", value: overview.data?.counts.products, description: "Reviewed public products with purpose, audience, maturity, and implementation evidence.", ...collectionPresentation.products },
    { key: "portfolio", label: "Portfolios", route: "/portfolio", value: overview.data?.counts.portfolio, description: "Strategic portfolio records grouping related products and implementation resources.", ...collectionPresentation.portfolio },
    ...datasetOrder.map((name) => ({ key: name, label: labels[name], route: `/catalog/${name}`, value: overview.data?.counts[name], description: datasetDetails[name].description, ...collectionPresentation[name] })),
  ];
  return <section className="catalog-explorer mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
    <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white p-8 shadow-sm">
      <div className="space-y-4">
        <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Supporting evidence &amp; public catalog explorer</span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">GroupSum Ecosystem Catalog</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-ink-muted sm:text-base">Traverse reviewed products and portfolio records into repositories, contained packages, typed resources, and observed stack evidence without losing ownership context.</p>
        <p className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs text-[#5C635E]"><Calendar className="h-3.5 w-3.5" aria-hidden="true" />Active Observation Period: 30-Day Window <span aria-hidden="true">&bull;</span> {overview.data?.generated_at ? `Refreshed ${formatDate(overview.data.generated_at)}` : overview.isError ? "Current observation unavailable" : "Loading current observation"}</p>
      </div>
    </div>
    {overview.isError && <div className="rounded-[var(--radius-sm)] border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-700" role="alert">Current catalog totals are temporarily unavailable. Stale generated totals are not shown.</div>}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => {
        const Icon = collection.Icon;
        return <article key={collection.key} className="group relative flex min-w-0 flex-col justify-between space-y-4 rounded-xl border border-[var(--color-border-soft)] bg-white p-6 shadow-sm transition-all duration-200 hover:border-accent-hover hover:bg-canvas">
          <div className="flex items-center justify-between gap-3"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${collection.iconBackground} ${collection.iconClass}`}><Icon className="h-6 w-6" aria-hidden="true" /></div><strong className="rounded-full border border-[var(--color-border-soft)] bg-surface px-3 py-1 font-mono text-xl font-bold tabular-nums text-ink">{collection.value === undefined ? "—" : collection.value.toLocaleString()}</strong></div>
          <div className="min-w-0 flex-1"><h2 className="font-serif text-2xl font-bold text-ink transition-colors group-hover:text-accent-hover"><a href={collection.route} onClick={(event) => { event.preventDefault(); onNavigate(collection.route); }} className="before:absolute before:inset-0 before:content-['']">{collection.label}</a></h2><p className="mt-3 text-xs leading-relaxed text-ink-muted">{collection.description}</p></div><span className="flex items-center justify-between border-t border-[var(--color-border-soft)] pt-3 font-mono text-xs font-semibold text-accent-hover">Browse Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
        </article>;
      })}
    </div>
    <SurfaceCard title="Canonical resource hierarchy" Icon={GitBranch} intro="Collection pages summarize a resource family; member pages preserve local ownership, evidence, metrics, and navigation to parents and children.">
      <p className="font-mono text-xs leading-relaxed text-ink-muted">Organization → product or portfolio → repository → package or typed resource → release evidence</p>
    </SurfaceCard>
  </section>;
}

export function PublicCatalogExplorer({ onNavigate, compact = false, fixedDataset, initialQuery = "", initialResourceType = "" }: { onNavigate: (path: string) => void; compact?: boolean; fixedDataset?: DatasetName; initialQuery?: string; initialResourceType?: string }) {
  const overview = useCatalogOverview();
  const [dataset, setDataset] = useState<DatasetName>(fixedDataset || "repositories");
  const [filters, setFilters] = useState<ExplorerFilters>({ search: initialQuery, owner: "", ecosystem: "", publication: "", resourceType: initialResourceType, sort: "recent" });
  const [page, setPage] = useState(1);
  const pageSize = compact ? 24 : 50;

  useEffect(() => {
    if (fixedDataset) setDataset(fixedDataset);
  }, [fixedDataset]);

  useEffect(() => setFilters((current) => ({ ...current, search: initialQuery })), [initialQuery]);
  useEffect(() => setFilters((current) => ({ ...current, resourceType: initialResourceType })), [initialResourceType]);

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
  useEffect(() => {
    const responsePage = Number(collection.data?.page || 0);
    if (!collection.isFetching && responsePage > 0 && responsePage !== page) {
      setPage(responsePage);
    }
  }, [collection.data?.page, collection.isFetching, page]);
  const records = useMemo(() => {
    const kind = dataset === "technologies" ? "technology" : dataset.slice(0, -1);
    return (collection.data?.records || []).map((record) => ({ ...record, kind })) as CatalogRecord[];
  }, [collection.data?.records, dataset]);
  const state = collection.isPending ? "loading" : collection.isError ? "error" : "ready";
  const aggregates = collection.data?.aggregates || {};
  const staticSnapshot = globalThis.__GROUPSUM_API_SNAPSHOT__ as { resource_types?: NonNullable<typeof collection.data>["resource_types"] } | null;
  const resourceTypes = collection.data?.resource_types || staticSnapshot?.resource_types || [];

  const summaryFacts = useMemo<MetricItem[]>(() => {
    if (dataset === "repositories") return [
      { label: "Repositories", value: Number(collection.data?.count || 0), icon: FolderGit2, color: "text-[#166534]" },
      { label: "Total Stars Observed", value: Number(aggregates.stars || 0), icon: Star, color: "text-[#B45309]" },
      { label: "SSOT Governed", value: Number(aggregates.ssot_governed || 0), icon: ShieldCheck, color: "text-indigo-600" },
      { label: "Contained Packages", value: Number(aggregates.contained_packages || 0), icon: CheckCircle2, color: "text-[#2E6B9E]" },
    ];
    if (dataset === "packages") return [
      { label: "Packages", value: Number(collection.data?.count || 0), icon: Package, color: "text-orange-600" },
      { label: "Published Registry", value: Number(aggregates.published || 0), icon: CheckCircle2, color: "text-[#0D47A1]" },
      { label: "Private / Candidates", value: Number(aggregates.unpublished || 0), icon: AlertTriangle, color: "text-[#92400E]", note: "Unpublished or candidate" },
      { label: "Ecosystems", value: Number(aggregates.ecosystems || 0), icon: ShieldCheck, color: "text-[#166534]" },
    ];
    if (dataset === "resources") return [
      { label: "Typed Resources", value: Number(collection.data?.count || 0), icon: FileCode, color: "text-[#0369A1]" },
      { label: "Populated Types", value: Number(aggregates.populated_types || 0), icon: CheckCircle2, color: "text-[#166534]" },
      { label: "Registered Tables", value: Number(aggregates.registered_types || 0), icon: Terminal, color: "text-[#9D174D]" },
      { label: "Resource Families", value: Number(aggregates.families || 0), icon: Layers, color: "text-[#B45309]" },
    ];
    return [{ label: "Categorical Technologies", value: Number(collection.data?.count || 0), icon: Cpu, color: "text-[#B45309]" }, { label: "Technology Categories", value: Number(aggregates.categories || 0), icon: Layers, color: "text-[#2E6B9E]" }, { label: "Language Distinction", value: "Strictly Separate", icon: ShieldCheck, color: "text-[#166534]", note: "Languages kept in language composition" }];
  }, [aggregates, collection.data?.count, dataset]);
  const pages = Number(collection.data?.page_count || 1);
  const currentPage = Number(collection.data?.page || 1);
  const visible = records;

  return (
    <section aria-busy={collection.isFetching} className="catalog-explorer mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {!compact && (
        <div>
          <CollectionHeader eyebrow={`${labels[dataset]} collection`} title={labels[dataset]} description={datasetDetails[dataset].description} observedAt={collection.data?.generated_at ? formatDate(collection.data.generated_at) : undefined} exportHref={`/catalog/site/${dataset}.json`} facts={summaryFacts} />
        </div>
      )}
      {!fixedDataset && <div className="flex flex-wrap gap-2" aria-label="Catalog datasets" role="tablist">
        {datasetOrder.map((name) => (
          <button key={name} type="button" role="tab" onClick={() => { setDataset(name); setPage(1); }} aria-selected={dataset === name} className={`min-h-20 min-w-0 flex-[1_1_16rem] rounded-[var(--radius-md)] border px-4 py-3 text-left cursor-pointer transition-colors ${dataset === name ? "bg-accent text-white border-accent" : "bg-[var(--color-surface)] text-ink-muted border-[var(--color-border-soft)] hover:border-[var(--color-border-accent-soft)]"}`}>
            <span className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-xs font-mono font-semibold">{React.createElement(datasetDetails[name].Icon, { className: "h-4 w-4", "aria-hidden": true })}{labels[name]}</span><strong className="font-serif text-lg tabular-nums">{overview.data?.counts[name] === undefined ? "—" : overview.data.counts[name].toLocaleString()}</strong></span>
            <span className={`mt-1 block text-[10px] leading-snug ${dataset === name ? "text-white/75" : "text-ink-muted"}`}>{datasetDetails[name].description}</span>
          </button>
        ))}
      </div>}
      <ExplorerFilterToolbar filters={filters} onChange={(next) => { setFilters(next); setPage(1); }} owners={dataset === "repositories" ? Object.keys(collection.data?.facets?.owner || {}) : []} ecosystems={dataset === "packages" ? Object.keys(collection.data?.facets?.ecosystem || {}) : []} publications={dataset === "packages" ? Object.keys(collection.data?.facets?.publication_status || {}) : []} resourceTypes={dataset === "resources" ? Object.keys(collection.data?.facets?.resource_type || {}) : []} sortOptions={[{ label: "Recent Activity", value: "recent" }, { label: "Most Activity", value: "activity" }, { label: "Name (A–Z)", value: "name" }]} total={Number(collection.data?.count || 0)} statusDetail={collection.isFetching && !collection.isPending ? `Updating to page ${page.toLocaleString()} of ${pages.toLocaleString()}…` : `Page ${currentPage.toLocaleString()} of ${pages.toLocaleString()}`} />
      {state === "loading" && <div className="p-10 text-center text-sm text-ink-muted" role="status">Loading {labels[dataset].toLowerCase()}…</div>}
      {state === "error" && <div className="p-6 border border-red-500/20 bg-red-500/5 text-sm text-red-700 rounded-[var(--radius-sm)]" role="alert">The catalog API could not be loaded. Try again shortly or use the downloadable normalized JSON below.</div>}
      {dataset === "resources" && resourceTypes.length > 0 && <ResourceTypeDirectory descriptors={resourceTypes} selectedType={filters.resourceType} onSelect={(resourceType) => { setFilters({ ...filters, resourceType }); setPage(1); if (fixedDataset) onNavigate(`/catalog/resources/?resource_type=${encodeURIComponent(resourceType)}`); }} />}
      {dataset === "resources" && <h2 className="font-serif text-xl font-bold text-ink">{filters.resourceType ? `${resourceTypes.find((descriptor) => descriptor.resource_type === filters.resourceType)?.label || humanLabel(filters.resourceType)} records` : "All typed resource records"}</h2>}
      {state === "ready" && (
        <>
          {dataset === "repositories" ? <RepositoryCollectionTable records={visible} onNavigate={onNavigate} /> : dataset === "packages" ? <PackageCollectionTable records={visible} onNavigate={onNavigate} /> : <div className="space-y-3">{visible.map((record) => <CollectionRow key={record.id} record={record} dataset={dataset} onNavigate={onNavigate} />)}</div>}
          {visible.length === 0 && <div className="p-10 text-center border border-[var(--color-border-soft)] rounded-[var(--radius-md)] text-sm text-ink-muted">No catalog records match this search.</div>}
          {pages > 1 && <div className="flex items-center justify-between gap-4"><button disabled={currentPage === 1 || collection.isFetching} onClick={() => setPage(Math.max(1, currentPage - 1))} className="px-3 py-2 text-xs font-mono border border-[var(--color-border-soft)] rounded disabled:opacity-40 cursor-pointer">Previous</button><button disabled={currentPage === pages || collection.isFetching} onClick={() => setPage(Math.min(pages, currentPage + 1))} className="px-3 py-2 text-xs font-mono border border-[var(--color-border-soft)] rounded disabled:opacity-40 cursor-pointer">Next</button></div>}
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
