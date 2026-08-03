import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Package, Search } from "lucide-react";
import {
  DependencyEvidence,
  PackageEvidence,
  RecordCollectionPageModel,
  RecordPageModel,
  RecordSummary,
  RepositoryEvidence,
  RepositorySignals,
  ReleaseEvidence,
  SsotGovernanceSummary,
  getRecordPageModel,
} from "../api/catalog.generated";
import { portfolioEntities } from "../data/entities";
import { PortfolioEntity } from "../types";
import { RepositorySignalStrip } from "./RepositorySignals";
import { EntityOwnership, EntityRelationshipRows } from "./EntityIdentity";

type Navigate = (path: string) => void;
type CollectionMode = "products" | "portfolio";

type RelatedResource = {
  id: string;
  kind?: string;
  name?: string;
  url?: string;
  route?: string;
  evidence_type?: string;
};

type CatalogPackage = PackageEvidence & { display_name?: string; route?: string };

type CatalogRepository = {
  id: string;
  name: string;
  full_name: string;
  route?: string;
  url?: string;
  observed_at?: string;
  metrics?: Record<string, number>;
  latest_release?: Record<string, unknown> | null;
  latest_deployment?: Record<string, unknown> | null;
  relationship_counts?: Record<string, number>;
  related_resources?: RelatedResource[];
  repository_count?: number;
  release_count?: number;
  deployment_count?: number;
  dependency_count?: number;
  dependent_count?: number;
  ssot_governed?: boolean;
  ssot_registry_url?: string | null;
  ssot_schema_version?: string | null;
  ssot_summary?: SsotGovernanceSummary;
};

type ProductEvidenceBundle = {
  generated_at: string;
  repository: CatalogRepository;
  packages: CatalogPackage[];
};

type ProductPageModel = RecordPageModel;

type CollectionRecord = {
  id: string;
  slug: string;
  recordType: "product" | "portfolio";
  kind: string;
  title: string;
  summary: string;
  maturity: string;
  organization: string;
  audience: string[];
  technologies: string[];
  featured: boolean;
  repositoryCount: number;
  packageCount: number;
  releaseCount: number;
  resourceCount: number;
  dependencyCount: number;
  dependentCount: number;
  signals?: RepositorySignals;
};

function initialProductModel(slug: string, recordType: "product" | "portfolio"): ProductPageModel | null {
  const model = globalThis.__GROUPSUM_PAGE_MODEL__ as ProductPageModel | null | undefined;
  return model?.kind === `${recordType}_record` && model.record.slug === slug ? model : null;
}

function initialCollectionModel(recordType: "product" | "portfolio"): RecordCollectionPageModel | null {
  const model = globalThis.__GROUPSUM_PAGE_MODEL__ as RecordCollectionPageModel | null | undefined;
  return model?.kind === `${recordType}_collection` ? model : null;
}

function evidenceBundle(model: ProductPageModel): ProductEvidenceBundle {
  const repositories = model.implementation.repositories;
  const primary = repositories[0];
  return {
    generated_at: model.generated_at,
    repository: {
      id: primary?.id || model.record.slug,
      name: primary?.name || model.record.slug,
      full_name: primary ? `${primary.owner}/${primary.name}` : model.record.slug,
      url: primary?.url,
      observed_at: primary?.observed_at,
      metrics: primary?.metrics || {},
      repository_count: repositories.length,
      release_count: model.implementation.release_summary.reduce(
        (total, item) => total + item.release_count,
        0,
      ),
      deployment_count: model.implementation.deployments.length,
      dependency_count: model.implementation.dependency_summary.dependencies,
      dependent_count: model.implementation.dependency_summary.dependents,
      related_resources: model.implementation.resources.map((resource) => ({
        id: resource.id,
        kind: resource.resource_type,
        name: resource.title,
        url: resource.route_key
          ? `/catalog/resources/${resource.resource_type}/${resource.route_key}`
          : resource.url,
        route: resource.route_key ? `/catalog/resources/${resource.resource_type}/${resource.route_key}` : undefined,
      })),
      ssot_governed: primary?.ssot_governed,
      ssot_registry_url: primary?.ssot_registry_url,
      ssot_schema_version: primary?.ssot_schema_version,
      ssot_summary: primary?.ssot_summary,
    },
    packages: model.implementation.packages,
  };
}

const organizationNames: Record<string, string> = {
  groupsum: "GroupSum",
  tigrbl: "Tigrbl",
  swarmauri: "Swarmauri",
};

const collectionKinds = new Set(["suite", "product", "application", "package-family"]);

function humanize(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ecosystemLabel(value: string): string {
  return ({ pypi: "PyPI", npm: "npm", crates: "crates.io", ghcr: "GHCR", github: "GitHub Releases", "github-npm": "GitHub npm" } as Record<string, string>)[value] || humanize(value);
}

const stableDate = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });
const stableTimestamp = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });
function formatObserved(value: string, includeTime = false): string {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : (includeTime ? stableTimestamp : stableDate).format(date);
}

function dependencyName(item: DependencyEvidence): string {
  return item.source_name || item.source_id.replace(/^[^:]+:/, "");
}

export function productRecordPath(slug: string): string {
  return `/products/records/${slug}`;
}

export function portfolioRecordPath(slug: string): string {
  return `/portfolio/records/${slug}`;
}

function productRoute(entity: PortfolioEntity): string {
  return productRecordPath(entity.slug);
}

function collectionRecordPath(record: CollectionRecord): string {
  return record.recordType === "portfolio"
    ? portfolioRecordPath(record.slug)
    : productRecordPath(record.slug);
}

function evidenceSignals(repository: RepositoryEvidence): RepositorySignals {
  return {
    repository_count: 1,
    metrics: {
      stars: Number(repository.metrics.stars || 0),
      forks: Number(repository.metrics.forks || 0),
      watchers: Number(repository.metrics.watchers || 0),
      contributors: Number(repository.metrics.contributors || 0),
      commits: Number(repository.metrics.commits || 0),
    },
    history: repository.history,
    commit_activity: repository.commit_activity,
    observed_at: repository.observed_at,
  };
}

function ProductRow({ record, onNavigate }: { record: CollectionRecord; onNavigate: Navigate }) {
  const path = collectionRecordPath(record);
  return (
    <article className="group border-b border-[var(--color-border-soft)] first:border-t">
      <a
        href={path}
        onClick={(event) => { event.preventDefault(); onNavigate(path); }}
        className="block py-6 sm:py-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
      >
        <div className="sm:grid sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:gap-6 sm:items-start">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wide text-ink-muted">
            <span className="text-accent font-semibold">{humanize(record.kind)}</span>
            <span>{humanize(record.maturity)}</span>
          </div>
          <div className="mt-2 sm:mt-0 min-w-0">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink group-hover:text-accent transition-colors">{record.title}</h2>
            <p className="text-sm text-ink-muted leading-relaxed mt-1 max-w-3xl">{record.summary}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] font-mono text-ink-muted">
              <span>{organizationNames[record.organization] || humanize(record.organization)}</span>
              {record.repositoryCount > 0 && <span>{record.repositoryCount} repos</span>}
              {record.packageCount > 0 && <span>{record.packageCount} packages</span>}
              {record.releaseCount > 0 && <span>{record.releaseCount.toLocaleString()} releases</span>}
              {record.resourceCount > 0 && <span>{record.resourceCount} resources</span>}
              {record.dependencyCount > 0 && <span>{record.dependencyCount} dependencies</span>}
              {record.dependentCount > 0 && <span>{record.dependentCount} dependents</span>}
            </div>
            <RepositorySignalStrip signals={record.signals} compact />
          </div>
          <span className="mt-4 sm:mt-1 inline-flex items-center gap-1 text-xs font-mono font-semibold text-accent">
            View record <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </a>
    </article>
  );
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
    releaseCount: 0,
    resourceCount: 0,
    dependencyCount: 0,
    dependentCount: 0,
    signals: undefined,
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
    releaseCount: record.release_count,
    resourceCount: record.resource_count,
    dependencyCount: record.dependency_count,
    dependentCount: record.dependent_count,
    signals: record.signals,
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
    fetch(`/api/v1/${mode}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("collection unavailable")))
      .then((value: RecordCollectionPageModel) => setCollectionModel(value))
      .catch((error: Error) => { if (error.name !== "AbortError") setCollectionModel((value) => value); });
    return () => controller.abort();
  }, [mode, collectionModel]);
  const baseRecords = useMemo(() => {
    const staticRecords = portfolioEntities
      .filter((entity) => entity.approved)
      .filter((entity) => mode !== "products" || collectionKinds.has(entity.kind))
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
      .filter((record) => !normalized || [record.title, record.summary, ...record.technologies].join(" ").toLowerCase().includes(normalized))
      .sort((left, right) => Number(right.featured) - Number(left.featured) || left.title.localeCompare(right.title));
  }, [baseRecords, kind, owner, query]);
  const productCount = baseRecords.filter((record) => record.kind === "product" || record.kind === "suite").length;
  const title = organization
    ? `${organizationNames[organization] || humanize(organization)} products and portfolio`
    : mode === "products" ? "Products built as connected systems" : "Product and engineering portfolio";
  const description = organization
    ? `Reviewed ${organizationNames[organization] || organization} products, applications, packages, and source-backed work in one navigable collection.`
    : mode === "products"
      ? "Start with the product. Each record connects its reviewed positioning to public repositories, packages, releases, deployments, examples, APIs, demos, and related work."
      : "A unified collection of products, suites, applications, packages, projects, and specifications, each linked to the evidence that supports it.";

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <header className="max-w-4xl space-y-5">
        <button onClick={() => organization ? onNavigate("/products") : onNavigate("/")} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> {organization ? "All products" : "GroupSum home"}
        </button>
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">{mode === "products" ? "Product collection" : "Reviewed portfolio"}</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-ink">{title}</h1>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-3xl">{description}</p>
        </div>
        <dl className="flex flex-wrap gap-x-8 gap-y-3 border-y border-[var(--color-border-soft)] py-4">
          <div><dt className="text-[10px] font-mono uppercase text-ink-muted">Visible records</dt><dd className="font-serif text-2xl font-bold text-ink">{baseRecords.length}</dd></div>
          <div><dt className="text-[10px] font-mono uppercase text-ink-muted">Products and suites</dt><dd className="font-serif text-2xl font-bold text-ink">{productCount}</dd></div>
          <div><dt className="text-[10px] font-mono uppercase text-ink-muted">Organizations</dt><dd className="font-serif text-2xl font-bold text-ink">{new Set(baseRecords.map((record) => record.organization)).size}</dd></div>
        </dl>
      </header>

      <section className="space-y-5" aria-label="Collection filters">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <label className="relative block flex-1 max-w-2xl">
            <span className="sr-only">Search product and portfolio records</span>
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, capabilities, and technologies" className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border-muted)] rounded-[var(--radius-sm)] text-sm text-ink focus:outline-none focus:border-accent" />
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
        {filtered.length > 0 ? filtered.map((record) => <ProductRow key={record.id} record={record} onNavigate={onNavigate} />) : <div className="border-y border-[var(--color-border-soft)] py-12 text-sm text-ink-muted">No records match these filters.</div>}
      </section>
    </div>
  );
}

function DetailRows({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return <dl className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{rows.map(([label, value]) => <div key={label} className="py-3 sm:flex sm:gap-6"><dt className="text-[10px] font-mono uppercase tracking-wide text-ink-muted sm:w-40 shrink-0">{label}</dt><dd className="text-sm text-ink mt-1 sm:mt-0 min-w-0 break-words">{value}</dd></div>)}</dl>;
}

function ProductSection({ id, title, intro, children }: { id?: string; title: string; intro?: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-24 border-t border-[var(--color-border-soft)] pt-8 space-y-4"><div className="max-w-3xl space-y-1"><h2 className="font-serif text-2xl font-bold text-ink">{title}</h2>{intro && <p className="text-sm text-ink-muted leading-relaxed">{intro}</p>}</div>{children}</section>;
}

function EvidenceMetrics({ bundle }: { bundle: ProductEvidenceBundle }) {
  const values = [
    ["Implementation repositories", bundle.repository.repository_count || 1],
    ["Packages", bundle.packages.length],
    ["Observed releases", bundle.repository.release_count || 0],
    ["Deployment records", bundle.repository.deployment_count || 0],
    ["Related resources", bundle.repository.related_resources?.length || 0],
    ["Dependencies", bundle.repository.dependency_count || 0],
    ["Observed dependents", bundle.repository.dependent_count || 0],
  ] as const;
  return <dl className="flex flex-wrap gap-x-8 gap-y-4 border-y border-[var(--color-border-soft)] py-5">{values.map(([label, value]) => <div key={label}><dt className="text-[10px] font-mono uppercase text-ink-muted">{label}</dt><dd className="font-serif text-2xl font-bold text-ink">{value.toLocaleString()}</dd></div>)}</dl>;
}

const ssotInventoryOrder = ["adrs", "specs", "features", "tests", "claims", "evidence", "issues", "boundaries", "profiles", "releases"];

function SsotRegistryReport({ registries }: { registries: ProductPageModel["governance"]["ssot_registries"] }) {
  if (!registries.length) return <p className="text-sm text-ink-muted">No canonical .ssot/registry.json was observed in an attached repository.</p>;
  return <ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">
    {registries.map((registry) => {
      const counts = registry.summary.counts || {};
      const coverage = registry.summary.coverage || {};
      return <li key={registry.repository_id} className="py-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2"><span className="font-serif text-lg font-bold text-ink">{registry.repository}</span>{registry.governed && <span className="px-2 py-1 rounded border border-accent text-[10px] font-mono uppercase font-semibold text-accent">SSOT governed</span>}</div>
          {registry.registry_url && <a href={registry.registry_url} target="_blank" rel="noreferrer" className="text-xs font-mono text-accent hover:underline">Canonical registry</a>}
        </div>
        <DetailRows rows={[
          ["Schema", registry.schema_version || "Not recorded"],
          ["Observed", registry.observed_at ? formatObserved(registry.observed_at, true) : "Not recorded"],
          ["Registry inventory", ssotInventoryOrder.map((key) => `${humanize(key)} ${Number(counts[key] || 0).toLocaleString()}`).join(" Â· ")],
          ["Claim evidence coverage", `${Number(coverage.claims_with_evidence || 0).toLocaleString()} linked Â· ${Number(coverage.claims_without_evidence || 0).toLocaleString()} without evidence Â· ${Number(coverage.claims_with_tests || 0).toLocaleString()} linked to tests`],
        ]} />
        <p className="text-xs text-ink-muted border-l-2 border-[var(--color-border-muted)] pl-3">{registry.summary.limitation || "Registry counts report governed artifacts and their declared linkage; they do not independently validate every public product claim."}</p>
      </li>;
    })}
  </ul>;
}

export function ProductRecordPage({
  slug,
  onNavigate,
  recordType = "product",
}: {
  slug: string;
  onNavigate: Navigate;
  recordType?: "product" | "portfolio";
}) {
  const entity = portfolioEntities.find((candidate) => candidate.slug === slug && candidate.approved);
  const initialModel = initialProductModel(slug, recordType);
  const [pageModel, setPageModel] = useState<ProductPageModel | null>(initialModel);
  const [bundle, setBundle] = useState<ProductEvidenceBundle | null>(() => initialModel ? evidenceBundle(initialModel) : null);
  const [evidenceState, setEvidenceState] = useState<"loading" | "ready" | "unavailable" | "error">(initialModel ? "ready" : "loading");
  const [packageEcosystem, setPackageEcosystem] = useState("all");
  useEffect(() => {
    if (pageModel) return;
    const controller = new AbortController();
    if (!bundle) setEvidenceState("loading");
    getRecordPageModel(`/api/v1/${recordType === "product" ? "products" : "portfolio"}/${slug}`, controller.signal)
      .then((value) => {
        const model = value as ProductPageModel;
        setPageModel(model);
        setBundle(evidenceBundle(model));
        setEvidenceState("ready");
      })
      .catch((error: Error) => {
        if (error.name === "AbortError" || bundle) return;
        if (!entity) {
          setEvidenceState(error.message.includes("404") ? "unavailable" : "error");
          return;
        }
        fetch(`/catalog/product-evidence/${entity.organization}/${entity.sourceName}.json`, { signal: controller.signal })
          .then((response) => response.ok ? response.json() : Promise.reject(new Error("fallback unavailable")))
          .then((value: ProductEvidenceBundle) => { setBundle(value); setEvidenceState("ready"); })
          .catch((fallbackError: Error) => { if (fallbackError.name !== "AbortError") setEvidenceState("error"); });
      });
    return () => controller.abort();
  }, [entity?.id, entity?.slug, pageModel, recordType, slug]);
  if (!entity && !pageModel) {
    const loading = evidenceState === "loading";
    return <div className="max-w-3xl mx-auto px-4 py-20 space-y-4"><h1 className="font-serif text-3xl font-bold text-ink">{loading ? "Loading portfolio evidence" : "Portfolio record unavailable"}</h1><p className="text-sm text-ink-muted">{loading ? "Loading the durable catalog record…" : "This public product or portfolio record could not be found."}</p><button onClick={() => onNavigate(recordType === "product" ? "/products" : "/portfolio")} className="text-xs font-mono text-accent hover:underline">Return to {recordType === "product" ? "products" : "portfolio"}</button></div>;
  }

  const children = entity ? portfolioEntities.filter((candidate) => candidate.approved && (candidate.parentId === entity.id || candidate.suiteId === entity.id)) : [];
  const relatedEditorial = (entity?.relatedProductSlugs || []).map((relatedSlug) => portfolioEntities.find((candidate) => candidate.slug === relatedSlug && candidate.approved)).filter((candidate): candidate is PortfolioEntity => Boolean(candidate));
  const connected = [...new Map([...children, ...relatedEditorial].map((candidate) => [candidate.id, candidate])).values()];
  const resourcesByKind = new Map<string, RelatedResource[]>();
  for (const resource of bundle?.repository.related_resources || []) {
    const kind = resource.kind || "resource";
    resourcesByKind.set(kind, [...(resourcesByKind.get(kind) || []), resource]);
  }
  const record = pageModel?.record;
  const recordOrganization = entity?.organization || String(record?.organization_slug || record?.organization_id || "groupsum");
  const displayName = entity?.displayName || String(record?.title || slug);
  const summary = entity?.summary || String(record?.summary || "Public catalog evidence record.");
  const displayKind = entity?.kind || String(record?.eyebrow || record?.record_type || recordType);
  const maturity = entity?.maturity || String(record?.maturity || "not classified");
  const primaryLink = entity?.links.find((link) => link.kind === "source") || entity?.links[0];
  const sourceUrl = primaryLink?.href || (record?.source_url ? String(record.source_url) : undefined);
  const taxonomyLabels = (taxonomy: string, fallback: string[]) =>
    pageModel?.taxonomies[taxonomy]?.map((item) => item.label) || fallback;
  const audience = taxonomyLabels("audience", entity?.audience || []);
  const ecosystems = taxonomyLabels("ecosystem", entity?.ecosystem.map(humanize) || []);
  const technologies = taxonomyLabels("technology", entity?.technologies || []);
  const languages = taxonomyLabels("language", []);
  const evidenceRows = pageModel?.governance.evidence.map((item) => ({
    label: String(item.title || item.evidence_type || "Observed evidence"),
    checkedAt: String(item.observed_at || pageModel.generated_at),
    url: item.source_url ? String(item.source_url) : undefined,
    rootedInSsot: Boolean(item.rooted_in_ssot),
  })) || entity?.evidence.map((item) => ({ ...item, url: undefined })) || [];
  const limitationRows = pageModel?.governance.limitations.map((item) =>
    String(item.description || item.title || "Limitation not described"),
  ) || entity?.limitations || [];
  const relatedLinks = entity?.links || [];
  const claimBoundary = entity?.claimBoundary || (
    record?.content && typeof record.content === "object" &&
    (record.content as Record<string, unknown>).reviewed_positioning === false
      ? "Catalog-generated evidence record. Product positioning has not been editorially reviewed."
      : undefined
  );
  const packages = bundle?.packages || [];
  const packageEcosystems = [...new Set(packages.map((item) => item.ecosystem))].sort();
  const filteredPackages = packages.filter(
    (item) => packageEcosystem === "all" || item.ecosystem === packageEcosystem,
  );
  const releaseRows = pageModel?.implementation.releases || [];
  const releaseSummary = pageModel?.implementation.release_summary || [];
  const dependencies = pageModel?.implementation.dependencies || [];
  const dependents = pageModel?.implementation.dependents || [];
  const dependencySummary = pageModel?.implementation.dependency_summary;
  const ssotRegistries = pageModel?.governance.ssot_registries || [];
  const claimRooting = pageModel?.governance.claim_rooting;
  const claims = pageModel?.governance.claims || [];

  return (
    <article className="max-w-[var(--content-max)] min-w-0 mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 overflow-x-clip">
      <header className="max-w-5xl min-w-0 space-y-6">
        <button onClick={() => onNavigate(recordType === "product" ? `/products/${recordOrganization}` : "/portfolio")} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> {recordType === "product" ? `${organizationNames[recordOrganization] || humanize(recordOrganization)} products` : "Portfolio collection"}</button>
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">{pageModel?.graph?.entity.type_label || humanize(displayKind)} record</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-ink">{displayName}</h1>
          <p className="text-lg sm:text-xl text-ink-muted leading-relaxed max-w-4xl break-words">{summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2.5 py-1 border border-[var(--color-border-soft)] rounded text-xs font-mono text-ink">{humanize(maturity)}</span>
          {ssotRegistries.some((registry) => registry.governed) && <span className="px-2.5 py-1 border border-accent rounded text-xs font-mono font-semibold text-accent">SSOT governed</span>}
          {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-accent text-white rounded-[var(--radius-sm)] text-xs font-mono font-semibold inline-flex items-center gap-1">{primaryLink?.label || "Public source"}<ExternalLink className="w-3.5 h-3.5" /></a>}
          <button onClick={() => onNavigate("/contact")} className="px-4 py-2 border border-[var(--color-border-muted)] rounded-[var(--radius-sm)] text-xs font-mono font-semibold text-ink hover:border-accent cursor-pointer">Discuss this product</button>
        </div>
        <EntityOwnership graph={pageModel?.graph} onNavigate={onNavigate} />
      </header>

      <nav aria-label="Product record sections" className="sticky top-16 z-20 bg-canvas/95 backdrop-blur border-y border-[var(--color-border-soft)] py-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono">
        {[['overview','Overview'],['implementation','Implementation'],['governance','SSOT governance'],['packages','Packages'],['releases','Releases'],['dependencies','Dependencies'],['resources','Related resources'],['evidence','Evidence']].map(([id, label]) => <a key={id} href={`#${id}`} className="text-ink-muted hover:text-accent">{label}</a>)}
      </nav>

      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 items-start">
        <aside className="lg:sticky lg:top-32 space-y-5 mb-10 lg:mb-0">
          <h2 className="font-serif text-xl font-bold text-ink">Product profile</h2>
          <DetailRows rows={[
            ["Audience", audience.join(", ") || "Not classified"],
            ["Record type", humanize(displayKind)],
            ["Maturity", humanize(maturity)],
            ["Ecosystem", ecosystems.join(", ") || "Not classified"],
            ["Technologies", technologies.join(", ") || "Not classified"],
            ["Languages", languages.join(", ") || "Not observed"],
          ]} />
        </aside>

        <div className="space-y-10 min-w-0">
          <ProductSection id="overview" title="What this product is for">
            <p className="text-base text-ink leading-relaxed max-w-3xl">{summary}</p>
            {claimBoundary && <aside className="border-l-2 border-accent pl-4 py-1 text-sm text-ink-muted"><strong className="block text-ink mb-1">Claim boundary</strong>{claimBoundary}</aside>}
          </ProductSection>

          <ProductSection id="implementation" title="Public implementation evidence" intro="Catalog observations strengthen this product record without replacing reviewed product positioning.">
            {evidenceState === "loading" && <p className="text-sm text-ink-muted" role="status">Loading repository and package evidence…</p>}
            {evidenceState === "error" && <p className="text-sm text-red-700" role="alert">Public evidence could not be loaded.</p>}
            {evidenceState === "unavailable" && <p className="text-sm text-ink-muted">No matching public repository is present in the current catalog scope.</p>}
            {bundle && <><EvidenceMetrics bundle={bundle} /><RepositorySignalStrip signals={pageModel?.implementation.signals} /><DetailRows rows={[
              ["Repository", <a href={bundle.repository.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{bundle.repository.full_name}</a>],
              ["Observed", formatObserved(bundle.generated_at, true)],
              ["Latest release", String(bundle.repository.latest_release?.name || bundle.repository.latest_release?.tag || "No GitHub release observed")],
              ["Latest deployment", bundle.repository.latest_deployment?.environment ? `${humanize(String(bundle.repository.latest_deployment.environment))} · ${humanize(String(bundle.repository.latest_deployment.state || "state not recorded"))}` : "No deployment observed"],
            ]} />
            {pageModel?.implementation.repositories.length ? <div className="space-y-3 pt-2"><h3 className="text-xs font-mono uppercase text-ink font-semibold">Attached repository activity</h3><ul className="divide-y divide-[var(--color-border-soft)] border-y border-[var(--color-border-soft)]">{pageModel.implementation.repositories.map((repository) => <li key={repository.id} className="py-4 space-y-3"><div className="flex flex-wrap items-baseline justify-between gap-2"><div className="flex flex-wrap items-center gap-2"><a href={repository.url} target="_blank" rel="noreferrer" className="font-serif text-lg font-bold text-accent hover:underline">{repository.owner}/{repository.name}</a>{repository.ssot_governed && <span className="px-2 py-1 rounded border border-accent text-[10px] font-mono uppercase font-semibold text-accent">SSOT governed</span>}</div><span className="text-[10px] font-mono uppercase text-ink-muted">{humanize(repository.role)}</span></div><RepositorySignalStrip signals={evidenceSignals(repository)} compact /></li>)}</ul></div> : null}</>}
          </ProductSection>

          <ProductSection id="governance" title="SSOT governance" intro="Canonical registry artifacts and linkage coverage from attached public repositories.">
            <SsotRegistryReport registries={ssotRegistries} />
          </ProductSection>

          <ProductSection id="packages" title="Packages" intro="Public packages attached through implementation, website, or documentation repositories. Their role is shown explicitly.">
            {packages.length > 0 ? <div className="space-y-4">
              <div className="flex flex-wrap gap-2" aria-label="Filter packages by registry">
                {["all", ...packageEcosystems].map((value) => <button key={value} type="button" onClick={() => setPackageEcosystem(value)} aria-pressed={packageEcosystem === value} className={`px-3 py-1.5 text-xs font-mono rounded border cursor-pointer ${packageEcosystem === value ? "bg-accent text-white border-accent" : "bg-surface text-ink-muted border-[var(--color-border-soft)] hover:border-accent"}`}>{value === "all" ? `All (${packages.length})` : `${ecosystemLabel(value)} (${packages.filter((item) => item.ecosystem === value).length})`}</button>)}
              </div>
              <ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{filteredPackages.slice(0, 50).map((pkg) => <li key={pkg.id} className="py-4 sm:flex sm:items-center sm:justify-between gap-5"><div className="min-w-0"><span className="text-[10px] font-mono uppercase text-accent">{ecosystemLabel(pkg.ecosystem)}{pkg.role ? ` · ${humanize(pkg.role)}` : ""}</span><h3 className="font-serif text-lg font-bold text-ink break-all">{pkg.display_name || pkg.name}</h3><p className="text-xs text-ink-muted mt-1">{pkg.latest_version ? `Latest ${pkg.latest_version}` : "Version not recorded"} · {pkg.release_count.toLocaleString()} releases · {pkg.dependency_count.toLocaleString()} dependencies · {pkg.dependent_count.toLocaleString()} observed dependents</p></div><a href={pkg.registry_url} target="_blank" rel="noreferrer" className="mt-2 sm:mt-0 text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 shrink-0"><Package className="w-3.5 h-3.5" /> {pkg.published ? `Open on ${ecosystemLabel(pkg.ecosystem)}` : "Open source manifest"}</a></li>)}</ul>
              {filteredPackages.length > 50 && <p className="text-xs text-ink-muted">Showing 50 of {filteredPackages.length} matching packages. Use the registry filter to narrow this list.</p>}
            </div> : <p className="text-sm text-ink-muted">{evidenceState === "loading" ? "Loading packages…" : "No public package records are attached to this product."}</p>}
          </ProductSection>

          <ProductSection id="releases" title="Release activity" intro="Registry and GitHub releases are aggregated on this parent record. Publication dates are shown when the source registry exposes them.">
            {releaseSummary.length > 0 ? <div className="space-y-5">
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 border-y border-[var(--color-border-soft)] py-5">{releaseSummary.map((item) => <div key={item.release_kind}><dt className="text-[10px] font-mono uppercase text-ink-muted">{ecosystemLabel(item.release_kind)}</dt><dd className="font-serif text-2xl font-bold text-ink">{item.release_count.toLocaleString()}</dd><dd className="text-[10px] text-ink-muted">{item.latest_at ? `Latest observation ${formatObserved(item.latest_at)}` : "Publication date unavailable"}</dd></div>)}</dl>
              <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Recent observed releases</h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{releaseRows.slice(0, 40).map((release: ReleaseEvidence) => <li key={release.id} className="py-3 sm:flex sm:items-baseline sm:justify-between gap-5"><div className="min-w-0"><span className="text-[10px] font-mono uppercase text-accent">{ecosystemLabel(release.ecosystem || release.release_kind)}</span><p className="text-sm text-ink break-all">{release.package_name || [release.repository_owner, release.repository_name].filter(Boolean).join("/") || displayName} <span className="font-mono text-ink-muted">{release.version}</span></p></div><div className="flex items-center gap-3 shrink-0"><span className="text-[10px] text-ink-muted">{release.published_at ? formatObserved(release.published_at) : "date not exposed"}</span><a href={release.url} target="_blank" rel="noreferrer" className="text-xs font-mono text-accent hover:underline">Release</a></div></li>)}</ul></div>
              {releaseSummary.reduce((total, item) => total + item.release_count, 0) > releaseRows.length && <p className="text-xs text-ink-muted">Showing the most recent {releaseRows.length} of {releaseSummary.reduce((total, item) => total + item.release_count, 0).toLocaleString()} observed releases. The complete release table remains available through the REST API.</p>}
            </div> : <p className="text-sm text-ink-muted">No registry or GitHub releases are attached to this record.</p>}
          </ProductSection>

          <ProductSection id="dependencies" title="Dependencies and dependents" intro="Manifest dependencies and reverse edges are summarized on the product. Dependents are complete within this catalog; registry-wide coverage is bounded where registries expose it.">
            {dependencySummary && (dependencySummary.dependencies > 0 || dependencySummary.dependents > 0) ? <div className="space-y-7">
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 border-y border-[var(--color-border-soft)] py-5">{[["Dependencies", dependencySummary.dependencies], ["Internal", dependencySummary.internal_dependencies], ["External", dependencySummary.external_dependencies], ["Observed dependents", dependencySummary.dependents]].map(([label, value]) => <div key={String(label)}><dt className="text-[10px] font-mono uppercase text-ink-muted">{label}</dt><dd className="font-serif text-2xl font-bold text-ink">{Number(value).toLocaleString()}</dd></div>)}</dl>
              {dependencies.length > 0 && <section><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Required by attached packages</h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{dependencies.slice(0, 50).map((item) => <li key={item.id} className="py-3 sm:flex sm:items-baseline sm:justify-between gap-5"><div className="text-sm text-ink min-w-0"><span className="font-medium break-all">{item.target_id.replace(/^[^:]+:/, "")}</span><span className="text-ink-muted"> required by {item.source_name}</span></div><span className="text-[10px] font-mono text-ink-muted shrink-0">{item.scope || "dependencies"}{item.requirement ? ` · ${item.requirement}` : ""}</span></li>)}</ul>{dependencySummary.dependencies > dependencies.length && <p className="text-xs text-ink-muted mt-2">Showing {dependencies.length} of {dependencySummary.dependencies.toLocaleString()} dependency edges.</p>}</section>}
              {dependents.length > 0 && <section><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Catalog and registry-observed dependents</h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{dependents.slice(0, 50).map((item) => <li key={item.id} className="py-3 sm:flex sm:items-baseline sm:justify-between gap-5"><span className="text-sm text-ink break-all">{dependencyName(item)}</span><span className="text-[10px] font-mono text-ink-muted shrink-0">{humanize(item.completeness)}</span></li>)}</ul>{dependencySummary.dependents > dependents.length && <p className="text-xs text-ink-muted mt-2">Showing {dependents.length} of {dependencySummary.dependents.toLocaleString()} dependent edges.</p>}</section>}
              <p className="text-xs text-ink-muted border-l-2 border-[var(--color-border-muted)] pl-3">{dependencySummary.dependent_coverage}</p>
            </div> : <p className="text-sm text-ink-muted">No manifest dependency or observed dependent edges are attached to this record.</p>}
          </ProductSection>

          <ProductSection id="resources" title="Demos, APIs, examples, and related resources" intro="These links are discovered from repository homepages, contracts, and source paths. A source path does not prove a live deployment.">
            {pageModel?.graph && <div className="mb-7"><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Typed resource relationships</h3><EntityRelationshipRows graph={pageModel.graph} onNavigate={onNavigate} exclude={["implemented_by", "distributed_as"]} /></div>}
            {resourcesByKind.size > 0 ? <div className="space-y-7">{[...resourcesByKind.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([resourceKind, resources]) => <section key={resourceKind} className="space-y-2"><h3 className="text-xs font-mono uppercase tracking-wide text-ink font-semibold">{humanize(resourceKind)} <span className="text-ink-muted">({resources.length})</span></h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{resources.slice(0, 20).map((resource) => <li key={resource.id} className="py-3"><a href={resource.url} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline inline-flex items-start gap-1 break-all">{resource.name || humanize(resourceKind)}<ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" /></a></li>)}</ul>{resources.length > 20 && <p className="text-xs text-ink-muted">Showing 20 of {resources.length} observed {humanize(resourceKind).toLowerCase()} resources.</p>}</section>)}</div> : <p className="text-sm text-ink-muted">{evidenceState === "loading" ? "Loading related resources…" : "No API, demo, example, showcase, documentation, UI, or website paths were observed for this repository."}</p>}
          </ProductSection>

          {connected.length > 0 && <ProductSection title="Connected portfolio records" intro="Reviewed products, applications, and packages grouped with this product."><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{connected.map((candidate) => <li key={candidate.id}><a href={productRoute(candidate)} onClick={(event) => { event.preventDefault(); onNavigate(productRoute(candidate)); }} className="group flex items-start justify-between gap-4 py-4"><div><span className="text-[10px] font-mono uppercase text-accent">{humanize(candidate.kind)}</span><h3 className="font-serif text-lg font-bold text-ink group-hover:text-accent">{candidate.displayName}</h3><p className="text-xs text-ink-muted mt-1">{candidate.summary}</p></div><ArrowRight className="w-4 h-4 text-accent shrink-0 mt-2" /></a></li>)}</ul></ProductSection>}

          <ProductSection id="evidence" title="SSOT evidence and limitations">
            <div className="space-y-6">
              {claimRooting && <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Claim rooting</h3><DetailRows rows={[["SSOT-rooted claims", claimRooting.rooted.toLocaleString()], ["Unrooted claims", claimRooting.unrooted.toLocaleString()], ["Status", humanize(claimRooting.status)]]} />{claimRooting.limitation && <p className="text-xs text-ink-muted border-l-2 border-[var(--color-border-muted)] pl-3 mt-3">{claimRooting.limitation}</p>}</div>}
              {claims.length > 0 && <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Claims</h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{claims.map((claim) => <li key={String(claim.id)} className="py-3 sm:flex sm:justify-between gap-4 text-sm"><span className="text-ink">{String(claim.statement)}</span><span className={`text-[10px] font-mono uppercase shrink-0 ${claim.rooted_in_ssot ? "text-accent" : "text-ink-muted"}`}>{claim.rooted_in_ssot ? "SSOT linked" : "Not SSOT linked"}</span></li>)}</ul></div>}
              <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">SSOT evidence</h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{evidenceRows.map((item, index) => <li key={`${item.label}-${index}`} className="py-3 sm:flex sm:justify-between gap-4 text-sm text-ink"><span className="font-medium">{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{item.label}</a> : item.label}<span className="text-ink-muted"> · observed {item.checkedAt}</span></span>{"rootedInSsot" in item && <span className={`text-[10px] font-mono uppercase shrink-0 ${item.rootedInSsot ? "text-accent" : "text-ink-muted"}`}>{item.rootedInSsot ? "SSOT linked" : "Not SSOT linked"}</span>}</li>)}</ul></div>
              <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Limitations</h3><ul className="list-disc pl-5 space-y-2 text-sm text-ink-muted">{limitationRows.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></div>
              {relatedLinks.length > 0 && <div className="flex flex-wrap gap-4">{relatedLinks.map((link) => <a key={`${link.kind}-${link.href}`} href={link.href} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline inline-flex items-center gap-1">{link.label}<ExternalLink className="w-3.5 h-3.5" /></a>)}</div>}
            </div>
          </ProductSection>
        </div>
      </div>
    </article>
  );
}
