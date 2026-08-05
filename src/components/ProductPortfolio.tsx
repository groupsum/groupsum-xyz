import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Box, Building2, CheckCircle2, ExternalLink, FileCode2, GitBranch, Info, Layers, Package, Search, ShieldCheck } from "lucide-react";
import {
  PackageEvidence,
  RecordCollectionPageModel,
  RecordPageModel,
  RecordSummary,
  RepositoryEvidence,
  RepositorySignals,
  getRecordPageModel,
} from "../api/catalog.generated";
import { portfolioEntities } from "../data/entities";
import { PortfolioEntity } from "../types";
import { RepositorySignalStrip } from "./RepositorySignals";
import { EntityOwnership } from "./EntityIdentity";
import { CollectionHeader, ContextRailCard, MemberRowCard, RecordIdentityCard, SurfaceCard, factIcons } from "./CatalogVisuals";
import { ExplorerProductPortfolioCollection } from "./ExplorerProductPortfolioCollection";

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
  deployment_count?: number;
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
  resourceCount: number;
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
      deployment_count: model.implementation.deployments.length,
      related_resources: model.implementation.resources.map((resource) => ({
        id: resource.id,
        kind: resource.resource_type,
        name: resource.title,
        url: resource.route_key
          ? `/catalog/resources/${resource.resource_type}/${resource.route_key}`
          : resource.url,
        route: resource.route_key ? `/catalog/resources/${resource.resource_type}/${resource.route_key}` : undefined,
      })),
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
      ? "Start with the product. Each record connects its reviewed positioning to public repositories, packages, releases, deployments, examples, APIs, demos, and related work."
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

function DetailRows({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return <dl className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{rows.map(([label, value]) => <div key={label} className="py-3 sm:flex sm:gap-6"><dt className="text-[10px] font-mono uppercase tracking-wide text-ink-muted sm:w-40 shrink-0">{label}</dt><dd className="text-sm text-ink mt-1 sm:mt-0 min-w-0 break-words">{value}</dd></div>)}</dl>;
}

function ProductSection({ id, title, intro, children }: { id?: string; title: string; intro?: string; children: React.ReactNode }) {
  const icons = { overview: CheckCircle2, implementation: GitBranch, governance: ShieldCheck, packages: Package, releases: ArrowRight, dependencies: Layers, resources: FileCode2, evidence: Info } as const;
  return <SurfaceCard id={id} title={title} intro={intro} Icon={id ? icons[id as keyof typeof icons] || CheckCircle2 : CheckCircle2}>{children}</SurfaceCard>;
}

function EvidenceMetrics({ bundle }: { bundle: ProductEvidenceBundle }) {
  const values = [
    ["Attached repositories", bundle.repository.repository_count || 0],
    ["Packages", bundle.packages.length],
    ["Deployment records", bundle.repository.deployment_count || 0],
    ["Related resources", bundle.repository.related_resources?.length || 0],
  ] as const;
  return <dl className="flex flex-wrap gap-x-8 gap-y-4 border-y border-[var(--color-border-soft)] py-5">{values.map(([label, value]) => <div key={label}><dt className="text-[10px] font-mono uppercase text-ink-muted">{label}</dt><dd className="font-serif text-2xl font-bold text-ink">{value.toLocaleString()}</dd></div>)}</dl>;
}

const ssotInventoryOrder = ["adrs", "specs", "features", "tests", "claims", "evidence", "issues", "boundaries", "profiles", "releases"];

function SsotRegistryReport({ registries }: { registries: ProductPageModel["governance"]["repositories"] }) {
  if (!registries.length) return <p className="text-sm text-ink-muted">No public repository is attached to this record.</p>;
  return <ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">
    {registries.map((registry) => {
      const counts = registry.summary.counts || {};
      const coverage = registry.summary.coverage || {};
      const inventory = registry.summary.inventory || {};
      const claims = inventory.claims || [];
      const evidence = inventory.evidence || [];
      return <li key={registry.repository_id} className="py-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2"><span className="font-serif text-lg font-bold text-ink">{registry.repository}</span><span className="text-[10px] font-mono uppercase text-ink-muted">{humanize(registry.role)}</span>{registry.governed && <span className="px-2 py-1 rounded border border-accent text-[10px] font-mono uppercase font-semibold text-accent">SSOT governed</span>}</div>
          {registry.registry_url && <a href={registry.registry_url} target="_blank" rel="noreferrer" className="text-xs font-mono text-accent hover:underline">Canonical registry</a>}
        </div>
        <DetailRows rows={[
          ["Schema", registry.schema_version || "Not recorded"],
          ["Observed", registry.observed_at ? formatObserved(registry.observed_at, true) : "Not recorded"],
          ["Registry inventory", ssotInventoryOrder.map((key) => `${humanize(key)} ${Number(counts[key] || 0).toLocaleString()}`).join(" · ")],
          ["Claim evidence coverage", `${Number(coverage.claims_with_evidence || 0).toLocaleString()} linked · ${Number(coverage.claims_without_evidence || 0).toLocaleString()} without evidence · ${Number(coverage.claims_with_tests || 0).toLocaleString()} linked to tests`],
        ]} />
        {claims.length > 0 && <div><h4 className="text-[10px] font-mono uppercase text-ink font-semibold mb-2">Registry claims</h4><ul className="divide-y divide-[var(--color-border-soft)] border-y border-[var(--color-border-soft)]">{claims.slice(0, 20).map((claim) => <li key={claim.id} className="py-2 text-xs text-ink"><span className="font-mono text-accent">{claim.id}</span>{claim.statement || claim.title || claim.name ? <span className="text-ink-muted"> · {claim.statement || claim.title || claim.name}</span> : null}</li>)}</ul></div>}
        {evidence.length > 0 && <div><h4 className="text-[10px] font-mono uppercase text-ink font-semibold mb-2">Registry evidence</h4><ul className="divide-y divide-[var(--color-border-soft)] border-y border-[var(--color-border-soft)]">{evidence.slice(0, 20).map((item) => <li key={item.id} className="py-2 text-xs text-ink"><span className="font-mono text-accent">{item.id}</span>{item.title || item.name ? <span className="text-ink-muted"> · {item.title || item.name}</span> : null}</li>)}</ul></div>}
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
  const recordPath = recordType === "product" ? productRecordPath(slug) : portfolioRecordPath(slug);
  const isSelfLink = (value?: string) => {
    if (!value) return false;
    try { return new URL(value, "https://groupsum.xyz").pathname.replace(/\/+$/, "") === recordPath.replace(/\/+$/, ""); }
    catch { return false; }
  };
  const evidenceRows = (pageModel?.editorial.evidence.map((item) => ({
    label: String(item.title || item.evidence_type || "Observed evidence"),
    checkedAt: String(item.observed_at || pageModel.generated_at),
    url: item.source_url ? String(item.source_url) : undefined,
    rootedInSsot: Boolean(item.rooted_in_ssot),
  })) || entity?.evidence.map((item) => ({ ...item, url: undefined })) || []).map((item) => isSelfLink(item.url) ? { ...item, url: undefined } : item);
  const limitationRows = pageModel?.editorial.limitations.map((item) =>
    String(item.description || item.title || "Limitation not described"),
  ) || entity?.limitations || [];
  const relatedLinks = entity?.links || [];
  const claimBoundary = entity?.claimBoundary || (
    record?.content && typeof record.content === "object" &&
    (record.content as Record<string, unknown>).reviewed_positioning === false
      ? "Catalog-generated evidence record. Product positioning has not been editorially reviewed."
      : undefined
  );
  const repositories = pageModel?.implementation.repositories || [];
  const packages = pageModel?.implementation.packages || bundle?.packages || [];
  const packageEcosystems = [...new Set(packages.map((item) => item.ecosystem))].sort();
  const filteredPackages = packages.filter(
    (item) => packageEcosystem === "all" || item.ecosystem === packageEcosystem,
  );
  const repositoryReleaseGroups = repositories.filter((repository) => repository.release_count > 0);
  const packageReleaseGroups = packages.filter((pkg) => pkg.release_count > 0);
  const dependencyGroups = packages.filter((pkg) => pkg.dependency_summary.edge_count > 0 || pkg.dependent_summary.edge_count > 0);
  const ssotRegistries = pageModel?.governance.repositories || [];
  const claims = pageModel?.editorial.claims || [];
  const resourceCount = pageModel?.implementation.resources.length || bundle?.repository.related_resources?.length || 0;
  const recordIcon = recordType === "portfolio" ? Layers : Box;

  return (
    <article className="max-w-[var(--content-max)] min-w-0 mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 overflow-x-clip">
      <button onClick={() => onNavigate(recordType === "product" ? `/products/${recordOrganization}` : "/portfolio")} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> {recordType === "product" ? `${organizationNames[recordOrganization] || humanize(recordOrganization)} products` : "Portfolio collection"}</button>
      <RecordIdentityCard
        eyebrow={`${pageModel?.graph?.entity.type_label || humanize(displayKind)} record`}
        title={displayName}
        summary={summary}
        Icon={recordIcon}
        pills={[{ label: humanize(maturity), tone: "accent" }]}
        actions={<>{sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-sm)] bg-accent px-4 text-xs font-mono font-semibold text-white hover:bg-accent-hover">{primaryLink?.label || "Public source"}<ExternalLink className="h-3.5 w-3.5" /></a>}<button onClick={() => onNavigate("/contact")} className="min-h-10 rounded-[var(--radius-sm)] border border-[var(--color-border-muted)] px-4 text-xs font-mono font-semibold text-ink hover:border-accent cursor-pointer">Discuss this product</button></>}
        facts={[
          { label: "Owner org", value: organizationNames[recordOrganization] || humanize(recordOrganization), icon: Building2 },
          { label: "Audience", value: audience.slice(0, 2).join(" / ") || "Not classified", icon: factIcons.owner },
          { label: "Repositories", value: repositories.length, icon: GitBranch },
          { label: "Packages", value: packages.length, icon: Package },
          { label: "Typed resources", value: resourceCount, icon: FileCode2 },
        ]}
      />

      <nav aria-label="Product record sections" className="sticky top-16 z-20 bg-canvas/95 backdrop-blur border-y border-[var(--color-border-soft)] py-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono">
        {[['overview','Overview'],['implementation','Implementation'],['governance','SSOT governance'],['packages','Packages'],['releases','Releases'],['dependencies','Dependencies'],['resources','Related resources'],['evidence','Evidence']].map(([id, label]) => <a key={id} href={`#${id}`} className="text-ink-muted hover:text-accent">{label}</a>)}
      </nav>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <aside className="space-y-6 lg:order-2 lg:col-span-4 lg:sticky lg:top-32">
          <ContextRailCard title="Evidence & provenance boundary" Icon={ShieldCheck}>
            <div className="space-y-3 text-xs text-ink-muted">
              <p><strong className="text-ink">Evidence state:</strong> {evidenceState === "ready" ? "Observed and source-backed" : humanize(evidenceState)}</p>
              <p><strong className="text-ink">Last observed:</strong> {formatObserved(pageModel?.generated_at || bundle?.generated_at || new Date(0).toISOString(), true)} UTC</p>
              {claimBoundary && <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-soft)] bg-canvas p-3"><strong className="mb-1 block text-ink">Explicit boundary</strong>{claimBoundary}</div>}
              {limitationRows.length > 0 && <ul className="list-disc space-y-1 pl-4">{limitationRows.slice(0, 5).map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>}
              {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 font-mono font-semibold text-accent hover:underline">Primary source<ExternalLink className="h-3.5 w-3.5" /></a>}
            </div>
          </ContextRailCard>
          <ContextRailCard title="Record ownership & path" Icon={Building2}>
            <EntityOwnership graph={pageModel?.graph} onNavigate={onNavigate} />
            <DetailRows rows={[["Organization", organizationNames[recordOrganization] || humanize(recordOrganization)], ["Record slug", slug], ["Record type", humanize(displayKind)]]} />
          </ContextRailCard>
          <ContextRailCard title="Product profile" Icon={Info}>
            <DetailRows rows={[
              ["Audience", audience.join(", ") || "Not classified"],
              ["Maturity", humanize(maturity)],
              ["Ecosystem", ecosystems.join(", ") || "Not classified"],
            ]} />
          </ContextRailCard>
        </aside>

        <div className="min-w-0 space-y-8 lg:order-1 lg:col-span-8">
          <ProductSection id="overview" title="What this product is for">
            <p className="text-base text-ink leading-relaxed max-w-3xl">{summary}</p>
            {claims.length > 0 && <ul className="space-y-2">{claims.slice(0, 6).map((claim) => <li key={String(claim.id)} className="flex items-start gap-2 text-sm text-ink-muted"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />{String(claim.statement)}</li>)}</ul>}
          </ProductSection>

          <ProductSection id="implementation" title="Public implementation evidence" intro="Catalog observations strengthen this product record without replacing reviewed product positioning.">
            {evidenceState === "loading" && <p className="text-sm text-ink-muted" role="status">Loading repository and package evidence…</p>}
            {evidenceState === "error" && <p className="text-sm text-red-700" role="alert">Public evidence could not be loaded.</p>}
            {evidenceState === "unavailable" && <p className="text-sm text-ink-muted">No matching public repository is present in the current catalog scope.</p>}
            {bundle && <><EvidenceMetrics bundle={bundle} /><DetailRows rows={[
              ["Observed", formatObserved(bundle.generated_at, true)],
            ]} />
            {repositories.length ? <div className="space-y-3 pt-2"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xs font-mono uppercase text-ink font-semibold">Repository implementation map</h3><span className="text-[10px] font-mono text-ink-muted">{repositories.length} attached repositories</span></div><p className="text-xs text-ink-muted">Metrics remain owned by each repository card and are never promoted to the product.</p><ul className="space-y-3">{repositories.map((repository) => {
              const repositoryPath = `/catalog/repositories/${repository.owner}/${repository.name}`;
              return <li key={repository.id} className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-canvas p-4 transition-colors hover:border-accent"><div className="flex flex-wrap items-start justify-between gap-2"><div><span className="text-[10px] font-mono uppercase text-ink-muted">{humanize(repository.role)}</span><div className="mt-1 flex flex-wrap items-center gap-2"><a href={repositoryPath} onClick={(event) => { event.preventDefault(); onNavigate(repositoryPath); }} className="font-serif text-lg font-bold text-accent hover:underline">{repository.owner}/{repository.name}</a>{repository.governance.governed && <span className="px-2 py-1 rounded border border-accent text-[10px] font-mono uppercase font-semibold text-accent">SSOT governed</span>}</div></div><a href={repositoryPath} onClick={(event) => { event.preventDefault(); onNavigate(repositoryPath); }} className="inline-flex min-h-10 items-center text-xs font-mono font-semibold text-accent hover:underline">View repository detail <ArrowRight className="h-3.5 w-3.5" /></a></div>{repository.description && <p className="text-xs leading-relaxed text-ink-muted">{repository.description}</p>}<div className="border-t border-[var(--color-border-soft)] pt-3"><RepositorySignalStrip signals={evidenceSignals(repository)} compact /></div></li>;
            })}</ul></div> : null}</>}
          </ProductSection>

          <ProductSection id="governance" title="Repository SSOT governance" intro="Each repository reports its own canonical registry, governed inventory, claims, evidence, and linkage coverage. Governance is never promoted to the product.">
            <SsotRegistryReport registries={ssotRegistries} />
          </ProductSection>

          <ProductSection id="packages" title="Packages" intro="Public packages attached through implementation, website, or documentation repositories. Their role is shown explicitly.">
            {packages.length > 0 ? <div className="space-y-4">
              <div className="flex flex-wrap gap-2" aria-label="Filter packages by registry">
                {["all", ...packageEcosystems].map((value) => <button key={value} type="button" onClick={() => setPackageEcosystem(value)} aria-pressed={packageEcosystem === value} className={`px-3 py-1.5 text-xs font-mono rounded border cursor-pointer ${packageEcosystem === value ? "bg-accent text-white border-accent" : "bg-surface text-ink-muted border-[var(--color-border-soft)] hover:border-accent"}`}>{value === "all" ? `All (${packages.length})` : `${ecosystemLabel(value)} (${packages.filter((item) => item.ecosystem === value).length})`}</button>)}
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">{filteredPackages.slice(0, 50).map((pkg) => {
                const packagePath = `/catalog/packages/${pkg.ecosystem}/${pkg.route_key}`;
                const parents = pkg.repositories.map((repository) => `${repository.owner}/${repository.name}${repository.path ? ` · ${repository.path}` : ""}`).join(", ");
                return <li key={pkg.id} className="flex min-w-0 flex-col justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-canvas p-4 transition-colors hover:border-accent"><div className="min-w-0"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[10px] font-mono uppercase text-accent">{ecosystemLabel(pkg.ecosystem)}{pkg.role ? ` · ${humanize(pkg.role)}` : ""}</span><span className="rounded border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-2 py-1 text-[9px] font-mono uppercase text-ink-muted">{humanize(pkg.package_kind)}</span></div><h3 className="mt-2 break-all font-serif text-lg font-bold text-ink">{pkg.name}</h3><p className="mt-1 text-xs text-ink-muted">Contained by {parents || "repository not linked"}</p><dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--color-border-soft)] pt-3 text-[10px] font-mono"><div><dt className="text-ink-muted">Version</dt><dd className="font-semibold text-ink">{pkg.latest_version || "Not recorded"}</dd></div><div><dt className="text-ink-muted">Releases</dt><dd className="font-semibold text-ink">{pkg.release_count.toLocaleString()}</dd></div><div><dt className="text-ink-muted">Dependencies</dt><dd className="font-semibold text-ink">{pkg.dependency_summary.edge_count.toLocaleString()}</dd></div><div><dt className="text-ink-muted">Dependents</dt><dd className="font-semibold text-ink">{pkg.dependent_summary.edge_count.toLocaleString()}</dd></div></dl></div><a href={packagePath} onClick={(event) => { event.preventDefault(); onNavigate(packagePath); }} className="inline-flex min-h-10 items-center justify-between gap-1 text-xs font-mono font-semibold text-accent hover:underline"><span className="inline-flex items-center gap-1"><Package className="h-3.5 w-3.5" />Inspect package</span><ArrowRight className="h-3.5 w-3.5" /></a></li>;
              })}</ul>
              {filteredPackages.length > 50 && <p className="text-xs text-ink-muted">Showing 50 of {filteredPackages.length} matching packages. Use the registry filter to narrow this list.</p>}
            </div> : <p className="text-sm text-ink-muted">{evidenceState === "loading" ? "Loading packages…" : "No public package records are attached to this product."}</p>}
          </ProductSection>

          <ProductSection id="releases" title="Release activity by owner" intro="This product member summarizes release-owning relatives. Repository records provide aggregate analytics; package records provide their comprehensive local timelines.">
            {packageReleaseGroups.length > 0 || repositoryReleaseGroups.length > 0 ? <ul className="divide-y divide-[var(--color-border-soft)]">
              {packageReleaseGroups.map((pkg) => { const path = `/catalog/packages/${pkg.ecosystem}/${pkg.route_key}`; const latest = pkg.releases[0]; return <li key={pkg.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><span className="text-[10px] font-mono uppercase text-accent">{ecosystemLabel(pkg.ecosystem)} package</span><h3 className="font-serif text-lg font-bold text-ink">{pkg.name}</h3><p className="text-xs text-ink-muted">{pkg.release_count.toLocaleString()} releases{latest ? ` · latest ${latest.version}` : ""}</p></div><a href={path} onClick={(event) => { event.preventDefault(); onNavigate(path); }} className="inline-flex min-h-11 items-center gap-1 text-xs font-mono font-semibold text-accent hover:underline">Full package timeline <ArrowRight className="h-3.5 w-3.5" /></a></li>; })}
              {repositoryReleaseGroups.map((repository) => { const path = `/catalog/repositories/${repository.owner}/${repository.name}`; const latest = repository.releases[0]; return <li key={repository.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><span className="text-[10px] font-mono uppercase text-accent">Repository</span><h3 className="font-serif text-lg font-bold text-ink">{repository.owner}/{repository.name}</h3><p className="text-xs text-ink-muted">{repository.release_count.toLocaleString()} GitHub releases{latest ? ` · latest ${latest.version}` : ""}</p></div><a href={path} onClick={(event) => { event.preventDefault(); onNavigate(path); }} className="inline-flex min-h-11 items-center gap-1 text-xs font-mono font-semibold text-accent hover:underline">Repository release analytics <ArrowRight className="h-3.5 w-3.5" /></a></li>; })}
            </ul> : <p className="text-sm text-ink-muted">No package or repository release records are attached.</p>}
          </ProductSection>

          <ProductSection id="dependencies" title="Dependencies and dependents by package" intro="Every edge is grouped under the package that owns it. Counts are package metrics, not product attributes.">
            {dependencyGroups.length > 0 ? <div className="space-y-8">{dependencyGroups.map((pkg) => <section key={pkg.id} className="space-y-4"><div><span className="text-[10px] font-mono uppercase text-accent">{ecosystemLabel(pkg.ecosystem)} · {humanize(pkg.package_kind)}</span><h3 className="font-serif text-xl font-bold text-ink">{pkg.name}</h3><p className="text-xs text-ink-muted">Manifest {pkg.manifest_path || "path not recorded"}</p></div><dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 border-y border-[var(--color-border-soft)] py-4">{[["Dependency edges", pkg.dependency_summary.edge_count], ["Unique targets", pkg.dependency_summary.unique_target_count], ["Internal edges", pkg.dependency_summary.internal_edge_count], ["Dependent edges", pkg.dependent_summary.edge_count]].map(([label, value]) => <div key={String(label)}><dt className="text-[10px] font-mono uppercase text-ink-muted">{label}</dt><dd className="font-serif text-2xl font-bold text-ink">{Number(value).toLocaleString()}</dd></div>)}</dl>{pkg.dependencies.length > 0 && <div><h4 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Dependencies</h4><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{pkg.dependencies.slice(0, 50).map((item) => <li key={item.id} className="py-3 sm:flex sm:items-baseline sm:justify-between gap-5"><span className="text-sm text-ink break-all">{item.target_id.replace(/^[^:]+:/, "")}</span><span className="text-[10px] font-mono text-ink-muted">{item.scope || "dependencies"}{item.requirement ? ` · ${item.requirement}` : ""}</span></li>)}</ul></div>}{pkg.dependents.length > 0 && <div><h4 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Observed dependents</h4><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{pkg.dependents.slice(0, 50).map((item) => <li key={item.id} className="py-3 sm:flex sm:items-baseline sm:justify-between gap-5"><span className="text-sm text-ink break-all">{item.source_name || item.source_id}</span><span className="text-[10px] font-mono text-ink-muted">{humanize(item.completeness)}</span></li>)}</ul><p className="text-xs text-ink-muted border-l-2 border-[var(--color-border-muted)] pl-3 mt-3">{pkg.dependent_summary.coverage}</p></div>}</section>)}</div> : <p className="text-sm text-ink-muted">No package-owned dependency or dependent edges were observed.</p>}
          </ProductSection>

          <ProductSection id="resources" title="Demos, APIs, examples, and related resources" intro="These links are discovered from repository homepages, contracts, and source paths. A source path does not prove a live deployment.">
            {resourcesByKind.size > 0 ? <div className="space-y-7">{[...resourcesByKind.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([resourceKind, resources]) => <section key={resourceKind} className="space-y-2"><h3 className="text-xs font-mono uppercase tracking-wide text-ink font-semibold">{humanize(resourceKind)} <span className="text-ink-muted">({resources.length})</span></h3><ul className="space-y-2">{resources.slice(0, 20).map((resource) => { const resourcePath = resource.route || (resource.url?.startsWith("/catalog/") ? resource.url : undefined); return <li key={resource.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border-soft)] bg-canvas p-3.5"><div className="min-w-0"><span className="text-[9px] font-mono uppercase tracking-wide text-accent">{humanize(resourceKind)}</span><p className="break-words text-sm font-semibold text-ink">{resource.name || humanize(resourceKind)}</p></div><div className="flex flex-wrap items-center gap-3">{resourcePath && <a href={resourcePath} onClick={(event) => { event.preventDefault(); onNavigate(resourcePath); }} className="inline-flex min-h-10 items-center gap-1 text-xs font-mono font-semibold text-accent hover:underline">Inspect resource <ArrowRight className="h-3.5 w-3.5" /></a>}{resource.url && !resource.url.startsWith("/catalog/") && <a href={resource.url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 text-xs font-mono text-accent hover:underline">Source <ExternalLink className="h-3.5 w-3.5" /></a>}</div></li>; })}</ul>{resources.length > 20 && <p className="text-xs text-ink-muted">Showing 20 of {resources.length} observed {humanize(resourceKind).toLowerCase()} resources.</p>}</section>)}</div> : <p className="text-sm text-ink-muted">{evidenceState === "loading" ? "Loading related resources…" : "No API, demo, example, showcase, documentation, UI, or website paths were observed for this repository."}</p>}
          </ProductSection>

          {connected.length > 0 && <ProductSection title="Connected portfolio records" intro="Reviewed products, applications, and packages grouped with this product."><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{connected.map((candidate) => <li key={candidate.id}><a href={productRoute(candidate)} onClick={(event) => { event.preventDefault(); onNavigate(productRoute(candidate)); }} className="group flex items-start justify-between gap-4 py-4"><div><span className="text-[10px] font-mono uppercase text-accent">{humanize(candidate.kind)}</span><h3 className="font-serif text-lg font-bold text-ink group-hover:text-accent">{candidate.displayName}</h3><p className="text-xs text-ink-muted mt-1">{candidate.summary}</p></div><ArrowRight className="w-4 h-4 text-accent shrink-0 mt-2" /></a></li>)}</ul></ProductSection>}

          <ProductSection id="evidence" title="Editorial evidence and limitations">
            <div className="space-y-6">
              {claims.length > 0 && <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Reviewed product claims</h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{claims.map((claim) => <li key={String(claim.id)} className="py-3 text-sm text-ink">{String(claim.statement)}</li>)}</ul></div>}
              <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Editorial evidence sources</h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{evidenceRows.map((item, index) => <li key={`${item.label}-${index}`} className="py-3 text-sm text-ink"><span className="font-medium">{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{item.label}</a> : item.label}<span className="text-ink-muted"> · observed {item.checkedAt}</span></span></li>)}</ul></div>
              <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Limitations</h3><ul className="list-disc pl-5 space-y-2 text-sm text-ink-muted">{limitationRows.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></div>
              {relatedLinks.length > 0 && <div className="flex flex-wrap gap-4">{relatedLinks.map((link) => <a key={`${link.kind}-${link.href}`} href={link.href} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline inline-flex items-center gap-1">{link.label}<ExternalLink className="w-3.5 h-3.5" /></a>)}</div>}
            </div>
          </ProductSection>
        </div>
      </div>
    </article>
  );
}
