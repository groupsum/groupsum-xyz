import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Box, Building2, CheckCircle2, ExternalLink, FileCode2, GitBranch, Info, Layers, Package, Search, ShieldCheck } from "lucide-react";
import {
  RecordCollectionPageModel,
  RecordSummary,
  RepositorySignals,
  getRecordCollectionPageModel,
} from "../../api/catalog";
import { portfolioEntities } from "../../data/entities";
import { PortfolioEntity } from "../../types";
import { RepositorySignalStrip } from "../catalog/RepositorySignals";
import { EntityOwnership } from "../catalog/EntityIdentity";
import { CollectionHeader, ContextRailCard, MemberRowCard, RecordIdentityCard, SurfaceCard, factIcons } from "../catalog/CatalogVisuals";
import { ExplorerProductPortfolioCollection } from "./ExplorerProductPortfolioCollection";

import { collectionKinds, collectionRecordPath, formatObserved, humanize, initialCollectionModel, organizationNames, productRecordPath, productRoute, type CollectionMode, type CollectionRecord, type Navigate } from "./ProductPortfolioShared";

function ProductRow({ record, onNavigate }: { record: CollectionRecord; onNavigate: Navigate }) {
  const path = collectionRecordPath(record);
  return <MemberRowCard
    title={record.title}
    summary={record.summary}
    eyebrow={humanize(record.kind)}
    owner={organizationNames[record.organization] || humanize(record.organization)}
    route={path}
    onNavigate={onNavigate}
    Icon={record.recordType === "portfolio" ? Layers : Box}
    pills={[humanize(record.maturity)]}
    facts={[
      { label: "Repositories", value: record.repositoryCount },
      { label: "Packages", value: record.packageCount },
      { label: "Resources", value: record.resourceCount },
    ]}
  />;
}

function staticCollectionRecord(entity: PortfolioEntity): CollectionRecord {
  return {
    id: entity.id,
    slug: entity.slug,
    recordType: entity.kind === "project" ? "portfolio" : "product",
    kind: entity.kind,
    title: entity.displayName,
    summary: entity.summary,
    maturity: entity.maturity,
    organization: entity.organization,
    audience: entity.audience,
    technologies: entity.technologies,
    featured: entity.featured,
    repositoryCount: 0,
    packageCount: 0,
    resourceCount: 0,
  };
}

function backendCollectionRecord(record: RecordSummary): CollectionRecord {
  return {
    id: record.id,
    slug: record.slug,
    recordType: record.record_type === "portfolio" ? "portfolio" : "product",
    kind: record.eyebrow || record.record_type,
    title: record.title,
    summary: record.summary,
    maturity: record.maturity || "not classified",
    organization: record.organization_id,
    audience: [],
    technologies: record.technologies,
    featured: record.featured,
    repositoryCount: record.repository_count,
    packageCount: record.package_count,
    resourceCount: record.resource_count,
  };
}

export function ProductCollectionPage({
  mode,
  organization,
  onNavigate,
}: {
  mode: CollectionMode;
  organization?: string;
  onNavigate: Navigate;
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [owner, setOwner] = useState(organization || "all");
  const collectionType = mode === "products" ? "product" : "portfolio";
  const [collectionModel, setCollectionModel] = useState<RecordCollectionPageModel | null>(
    () => initialCollectionModel(collectionType),
  );
  useEffect(() => {
    if (collectionModel) return;
    const controller = new AbortController();
    getRecordCollectionPageModel(mode, controller.signal)
      .then((value) => setCollectionModel(value))
      .catch((error: Error) => { if (error.name !== "AbortError") setCollectionModel((value) => value); });
    return () => controller.abort();
  }, [mode, collectionModel]);
  const baseRecords = useMemo(() => {
    const staticRecords = portfolioEntities
      .filter((entity) => entity.approved)
      .filter((entity) => mode === "products" ? collectionKinds.has(entity.kind) : entity.kind === "project")
      .map(staticCollectionRecord);
    const merged = new Map(staticRecords.map((record) => [`${record.recordType}:${record.slug}`, record]));
    for (const backend of collectionModel?.records || []) {
      const record = backendCollectionRecord(backend);
      const key = `${record.recordType}:${record.slug}`;
      const editorial = merged.get(key);
      merged.set(key, editorial ? {
        ...editorial,
        ...record,
        kind: editorial.kind,
        audience: editorial.audience,
        technologies: [...new Set([...editorial.technologies, ...record.technologies])],
      } : record);
    }
    return [...merged.values()].filter((record) => !organization || record.organization === organization);
  }, [collectionModel, mode, organization]);
  const kinds = useMemo(() => [...new Set(baseRecords.map((record) => record.kind))].sort(), [baseRecords]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return baseRecords
      .filter((record) => owner === "all" || record.organization === owner)
      .filter((record) => kind === "all" || record.kind === kind)
      .filter((record) => !normalized || [record.title, record.summary, ...record.audience].join(" ").toLowerCase().includes(normalized))
      .sort((left, right) => Number(right.featured) - Number(left.featured) || left.title.localeCompare(right.title));
  }, [baseRecords, kind, owner, query]);
  const productCount = baseRecords.filter((record) => record.kind === "product" || record.kind === "suite").length;
  const title = organization
    ? `${organizationNames[organization] || humanize(organization)} products and portfolio`
    : mode === "products" ? "Products built as connected systems" : "Product and engineering portfolio";
  const description = organization
    ? `Reviewed ${organizationNames[organization] || organization} products, applications, packages, and source-backed work in one navigable collection.`
    : mode === "products"
      ? "Start with the product. Each record connects its reviewed positioning to public repositories, packages, releases, deployments, and typed resources."
      : "A unified collection of products, suites, applications, packages, projects, and specifications, each linked to the evidence that supports it.";

  return <ExplorerProductPortfolioCollection
    mode={mode}
    records={baseRecords}
    observedAt={collectionModel?.generated_at}
    organization={organization}
    onNavigate={onNavigate}
  />;

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <button onClick={() => organization ? onNavigate("/products") : onNavigate("/")} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5" /> {organization ? "All products" : "GroupSum home"}
      </button>
      <CollectionHeader
        eyebrow={mode === "products" ? "Primary product evaluation collection" : "Reviewed portfolio collection"}
        title={title}
        description={description}
        observedAt={collectionModel?.generated_at ? formatObserved(collectionModel.generated_at) : undefined}
        exportHref="/catalog/catalog.json"
        facts={[
          { label: "Visible records", value: baseRecords.length, icon: mode === "products" ? Box : Layers },
          { label: "Products & suites", value: productCount, icon: Box },
          { label: "Organizations", value: new Set(baseRecords.map((record) => record.organization)).size, icon: Building2 },
          { label: "Repositories", value: baseRecords.reduce((total, record) => total + record.repositoryCount, 0), icon: GitBranch },
          { label: "Packages", value: baseRecords.reduce((total, record) => total + record.packageCount, 0), icon: Package },
        ]}
      />

      <section className="space-y-5" aria-label="Collection filters">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <label className="relative block flex-1 max-w-2xl">
            <span className="sr-only">Search product and portfolio records</span>
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, capabilities, and audiences" className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border-muted)] rounded-[var(--radius-sm)] text-sm text-ink focus:outline-none focus:border-accent" />
          </label>
          {!organization && <div className="flex flex-wrap gap-2" aria-label="Filter by organization">
            {["all", "groupsum", "tigrbl", "swarmauri"].map((value) => <button key={value} onClick={() => setOwner(value)} aria-pressed={owner === value} className={`px-3 py-2 text-xs font-mono rounded-[var(--radius-sm)] border cursor-pointer ${owner === value ? "bg-accent text-white border-accent" : "text-ink-muted bg-[var(--color-surface)] border-[var(--color-border-soft)] hover:border-accent"}`}>{value === "all" ? "All organizations" : organizationNames[value]}</button>)}
          </div>}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-[var(--color-border-soft)] pb-3" aria-label="Filter by record type">
          {["all", ...kinds].map((value) => <button key={value} onClick={() => setKind(value)} aria-pressed={kind === value} className={`text-xs font-mono pb-1 border-b-2 cursor-pointer ${kind === value ? "text-accent border-accent" : "text-ink-muted border-transparent hover:text-ink"}`}>{value === "all" ? "All record types" : humanize(value)}</button>)}
        </div>
      </section>

      <section aria-live="polite" aria-label="Product and portfolio records">
        <p className="text-xs font-mono text-ink-muted mb-3">{filtered.length} matching records</p>
        {filtered.length > 0 ? <div className="space-y-3">{filtered.map((record) => <ProductRow key={record.id} record={record} onNavigate={onNavigate} />)}</div> : <div className="rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] py-12 text-center text-sm text-ink-muted">No records match these filters.</div>}
      </section>
    </div>
  );
}
