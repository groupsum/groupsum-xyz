import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Package, Search } from "lucide-react";
import { portfolioEntities } from "../data/entities";
import { PortfolioEntity } from "../types";

type Navigate = (path: string) => void;
type CollectionMode = "products" | "portfolio";

type RelatedResource = {
  id: string;
  kind?: string;
  name?: string;
  url?: string;
  evidence_type?: string;
};

type CatalogPackage = {
  id: string;
  name: string;
  display_name?: string;
  ecosystem?: string;
  latest_version?: string;
  release_count?: number;
  dependency_count?: number;
  route?: string;
  registry_url?: string;
};

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
};

type ProductEvidenceBundle = {
  generated_at: string;
  repository: CatalogRepository;
  packages: CatalogPackage[];
};

const organizationNames: Record<string, string> = {
  groupsum: "GroupSum",
  tigrbl: "Tigrbl",
  swarmauri: "Swarmauri",
};

const collectionKinds = new Set(["suite", "product", "application", "package-family"]);

function humanize(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function productRecordPath(slug: string): string {
  return `/products/records/${slug}`;
}

function productRoute(entity: PortfolioEntity): string {
  return productRecordPath(entity.slug);
}

function ProductRow({ entity, onNavigate }: { entity: PortfolioEntity; onNavigate: Navigate }) {
  const children = portfolioEntities.filter((candidate) => candidate.parentId === entity.id || candidate.suiteId === entity.id).length;
  return (
    <article className="group border-b border-[var(--color-border-soft)] first:border-t">
      <a
        href={productRoute(entity)}
        onClick={(event) => { event.preventDefault(); onNavigate(productRoute(entity)); }}
        className="block py-6 sm:py-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
      >
        <div className="sm:grid sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:gap-6 sm:items-start">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wide text-ink-muted">
            <span className="text-accent font-semibold">{humanize(entity.kind)}</span>
            <span>{humanize(entity.maturity)}</span>
          </div>
          <div className="mt-2 sm:mt-0 min-w-0">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink group-hover:text-accent transition-colors">{entity.displayName}</h2>
            <p className="text-sm text-ink-muted leading-relaxed mt-1 max-w-3xl">{entity.summary}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] font-mono text-ink-muted">
              <span>{organizationNames[entity.organization]}</span>
              <span>{entity.audience.join(" · ")}</span>
              {children > 0 && <span>{children} connected records</span>}
            </div>
          </div>
          <span className="mt-4 sm:mt-1 inline-flex items-center gap-1 text-xs font-mono font-semibold text-accent">
            View record <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </a>
    </article>
  );
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
  const baseEntities = useMemo(() => portfolioEntities.filter((entity) => {
    if (!entity.approved) return false;
    if (mode === "products" && !collectionKinds.has(entity.kind)) return false;
    return !organization || entity.organization === organization;
  }), [mode, organization]);
  const kinds = useMemo(() => [...new Set(baseEntities.map((entity) => entity.kind))].sort(), [baseEntities]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return baseEntities
      .filter((entity) => owner === "all" || entity.organization === owner)
      .filter((entity) => kind === "all" || entity.kind === kind)
      .filter((entity) => !normalized || [entity.displayName, entity.summary, entity.sourceName, ...entity.technologies].join(" ").toLowerCase().includes(normalized))
      .sort((left, right) => Number(right.featured) - Number(left.featured) || left.displayName.localeCompare(right.displayName));
  }, [baseEntities, kind, owner, query]);
  const productCount = baseEntities.filter((entity) => entity.kind === "product" || entity.kind === "suite").length;
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
          <div><dt className="text-[10px] font-mono uppercase text-ink-muted">Reviewed records</dt><dd className="font-serif text-2xl font-bold text-ink">{baseEntities.length}</dd></div>
          <div><dt className="text-[10px] font-mono uppercase text-ink-muted">Products and suites</dt><dd className="font-serif text-2xl font-bold text-ink">{productCount}</dd></div>
          <div><dt className="text-[10px] font-mono uppercase text-ink-muted">Organizations</dt><dd className="font-serif text-2xl font-bold text-ink">{new Set(baseEntities.map((entity) => entity.organization)).size}</dd></div>
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
        {filtered.length > 0 ? filtered.map((entity) => <ProductRow key={entity.id} entity={entity} onNavigate={onNavigate} />) : <div className="border-y border-[var(--color-border-soft)] py-12 text-sm text-ink-muted">No reviewed records match these filters.</div>}
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
  const metrics = bundle.repository.metrics || {};
  const values = [
    ["Packages", bundle.packages.length],
    ["Releases", metrics.github_releases || 0],
    ["Deployments", metrics.deployments || 0],
    ["Relationships", metrics.relationships || 0],
    ["Related resources", bundle.repository.related_resources?.length || 0],
  ] as const;
  return <dl className="flex flex-wrap gap-x-8 gap-y-4 border-y border-[var(--color-border-soft)] py-5">{values.map(([label, value]) => <div key={label}><dt className="text-[10px] font-mono uppercase text-ink-muted">{label}</dt><dd className="font-serif text-2xl font-bold text-ink">{value.toLocaleString()}</dd></div>)}</dl>;
}

export function ProductRecordPage({ slug, onNavigate }: { slug: string; onNavigate: Navigate }) {
  const entity = portfolioEntities.find((candidate) => candidate.slug === slug && candidate.approved);
  const [bundle, setBundle] = useState<ProductEvidenceBundle | null>(null);
  const [evidenceState, setEvidenceState] = useState<"loading" | "ready" | "unavailable" | "error">("loading");
  useEffect(() => {
    if (!entity) return;
    const controller = new AbortController();
    setEvidenceState("loading");
    fetch(`/catalog/product-evidence/${entity.organization}/${entity.sourceName}.json`, { signal: controller.signal })
      .then((response) => {
        if (response.status === 404) { setEvidenceState("unavailable"); return null; }
        if (!response.ok) throw new Error(`product evidence response ${response.status}`);
        return response.json();
      })
      .then((value: ProductEvidenceBundle | null) => { if (value) { setBundle(value); setEvidenceState("ready"); } })
      .catch((error: Error) => { if (error.name !== "AbortError") setEvidenceState("error"); });
    return () => controller.abort();
  }, [entity?.id]);
  if (!entity) return <div className="max-w-3xl mx-auto px-4 py-20 space-y-4"><h1 className="font-serif text-3xl font-bold text-ink">Product record unavailable</h1><p className="text-sm text-ink-muted">This reviewed product or portfolio record could not be found.</p><button onClick={() => onNavigate("/products")} className="text-xs font-mono text-accent hover:underline">Return to products</button></div>;

  const children = portfolioEntities.filter((candidate) => candidate.approved && (candidate.parentId === entity.id || candidate.suiteId === entity.id));
  const relatedEditorial = (entity.relatedProductSlugs || []).map((relatedSlug) => portfolioEntities.find((candidate) => candidate.slug === relatedSlug && candidate.approved)).filter((candidate): candidate is PortfolioEntity => Boolean(candidate));
  const connected = [...new Map([...children, ...relatedEditorial].map((candidate) => [candidate.id, candidate])).values()];
  const resourcesByKind = new Map<string, RelatedResource[]>();
  for (const resource of bundle?.repository.related_resources || []) {
    const kind = resource.kind || "resource";
    resourcesByKind.set(kind, [...(resourcesByKind.get(kind) || []), resource]);
  }
  const primaryLink = entity.links.find((link) => link.kind === "source") || entity.links[0];

  return (
    <article className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <header className="max-w-5xl space-y-6">
        <button onClick={() => onNavigate(`/products/${entity.organization}`)} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> {organizationNames[entity.organization]} products</button>
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">{humanize(entity.kind)} · {organizationNames[entity.organization]}</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-ink">{entity.displayName}</h1>
          <p className="text-lg sm:text-xl text-ink-muted leading-relaxed max-w-4xl">{entity.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2.5 py-1 border border-[var(--color-border-soft)] rounded text-xs font-mono text-ink">{humanize(entity.maturity)}</span>
          {primaryLink && <a href={primaryLink.href} target="_blank" rel="noreferrer" className="px-4 py-2 bg-accent text-white rounded-[var(--radius-sm)] text-xs font-mono font-semibold inline-flex items-center gap-1">{primaryLink.label}<ExternalLink className="w-3.5 h-3.5" /></a>}
          <button onClick={() => onNavigate("/contact")} className="px-4 py-2 border border-[var(--color-border-muted)] rounded-[var(--radius-sm)] text-xs font-mono font-semibold text-ink hover:border-accent cursor-pointer">Discuss this product</button>
        </div>
      </header>

      <nav aria-label="Product record sections" className="sticky top-16 z-20 bg-canvas/95 backdrop-blur border-y border-[var(--color-border-soft)] py-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono">
        {[['overview','Overview'],['implementation','Implementation'],['packages','Packages'],['resources','Related resources'],['evidence','Evidence']].map(([id, label]) => <a key={id} href={`#${id}`} className="text-ink-muted hover:text-accent">{label}</a>)}
      </nav>

      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 items-start">
        <aside className="lg:sticky lg:top-32 space-y-5 mb-10 lg:mb-0">
          <h2 className="font-serif text-xl font-bold text-ink">Product profile</h2>
          <DetailRows rows={[
            ["Organization", organizationNames[entity.organization]],
            ["Audience", entity.audience.join(", ")],
            ["Record type", humanize(entity.kind)],
            ["Maturity", humanize(entity.maturity)],
            ["Ecosystem", entity.ecosystem.map(humanize).join(", ")],
            ["Technologies", entity.technologies.join(", ")],
          ]} />
        </aside>

        <div className="space-y-10 min-w-0">
          <ProductSection id="overview" title="What this product is for">
            <p className="text-base text-ink leading-relaxed max-w-3xl">{entity.summary}</p>
            {entity.claimBoundary && <aside className="border-l-2 border-accent pl-4 py-1 text-sm text-ink-muted"><strong className="block text-ink mb-1">Claim boundary</strong>{entity.claimBoundary}</aside>}
          </ProductSection>

          <ProductSection id="implementation" title="Public implementation evidence" intro="Catalog observations strengthen this product record without replacing reviewed product positioning.">
            {evidenceState === "loading" && <p className="text-sm text-ink-muted" role="status">Loading repository and package evidence…</p>}
            {evidenceState === "error" && <p className="text-sm text-red-700" role="alert">Public evidence could not be loaded.</p>}
            {evidenceState === "unavailable" && <p className="text-sm text-ink-muted">No matching public repository is present in the current catalog scope.</p>}
            {bundle && <><EvidenceMetrics bundle={bundle} /><DetailRows rows={[
              ["Repository", <a href={bundle.repository.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{bundle.repository.full_name}</a>],
              ["Observed", new Date(bundle.generated_at).toLocaleString()],
              ["Latest release", String(bundle.repository.latest_release?.name || bundle.repository.latest_release?.tag || "No GitHub release observed")],
              ["Latest deployment", bundle.repository.latest_deployment?.environment ? `${humanize(String(bundle.repository.latest_deployment.environment))} · ${humanize(String(bundle.repository.latest_deployment.state || "state not recorded"))}` : "No deployment observed"],
            ]} /></>}
          </ProductSection>

          <ProductSection id="packages" title="Packages" intro="Published and manifest-discovered packages connected to the product repository.">
            {bundle?.packages.length ? <ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{bundle.packages.map((pkg) => <li key={pkg.id} className="py-4 sm:flex sm:items-center sm:justify-between gap-5"><div><span className="text-[10px] font-mono uppercase text-accent">{pkg.ecosystem}</span><h3 className="font-serif text-lg font-bold text-ink">{pkg.display_name || pkg.name}</h3><p className="text-xs text-ink-muted mt-1">{pkg.latest_version ? `Latest ${pkg.latest_version}` : "Version not recorded"} · {pkg.release_count || 0} releases · {pkg.dependency_count || 0} dependencies</p></div>{pkg.route && <a href={pkg.route} onClick={(event) => { event.preventDefault(); onNavigate(pkg.route!); }} className="mt-2 sm:mt-0 text-xs font-mono text-accent hover:underline inline-flex items-center gap-1"><Package className="w-3.5 h-3.5" /> Package evidence</a>}</li>)}</ul> : <p className="text-sm text-ink-muted">{evidenceState === "loading" ? "Loading packages…" : "No package records are attached to this product repository."}</p>}
          </ProductSection>

          <ProductSection id="resources" title="Demos, APIs, examples, and related resources" intro="These links are discovered from repository homepages, contracts, and source paths. A source path does not prove a live deployment.">
            {resourcesByKind.size > 0 ? <div className="space-y-7">{[...resourcesByKind.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([resourceKind, resources]) => <section key={resourceKind} className="space-y-2"><h3 className="text-xs font-mono uppercase tracking-wide text-ink font-semibold">{humanize(resourceKind)} <span className="text-ink-muted">({resources.length})</span></h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{resources.slice(0, 20).map((resource) => <li key={resource.id} className="py-3"><a href={resource.url} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline inline-flex items-start gap-1 break-all">{resource.name || humanize(resourceKind)}<ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" /></a></li>)}</ul>{resources.length > 20 && <p className="text-xs text-ink-muted">Showing 20 of {resources.length} observed {humanize(resourceKind).toLowerCase()} resources.</p>}</section>)}</div> : <p className="text-sm text-ink-muted">{evidenceState === "loading" ? "Loading related resources…" : "No API, demo, example, showcase, documentation, UI, or website paths were observed for this repository."}</p>}
          </ProductSection>

          {connected.length > 0 && <ProductSection title="Connected portfolio records" intro="Reviewed products, applications, and packages grouped with this product."><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{connected.map((candidate) => <li key={candidate.id}><a href={productRoute(candidate)} onClick={(event) => { event.preventDefault(); onNavigate(productRoute(candidate)); }} className="group flex items-start justify-between gap-4 py-4"><div><span className="text-[10px] font-mono uppercase text-accent">{humanize(candidate.kind)}</span><h3 className="font-serif text-lg font-bold text-ink group-hover:text-accent">{candidate.displayName}</h3><p className="text-xs text-ink-muted mt-1">{candidate.summary}</p></div><ArrowRight className="w-4 h-4 text-accent shrink-0 mt-2" /></a></li>)}</ul></ProductSection>}

          <ProductSection id="evidence" title="Evidence and limitations">
            <div className="space-y-6">
              <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Reviewed evidence</h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{entity.evidence.map((item, index) => <li key={`${item.label}-${index}`} className="py-3 text-sm text-ink"><span className="font-medium">{item.label}</span><span className="text-ink-muted"> · checked {item.checkedAt}</span></li>)}</ul></div>
              <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Limitations</h3><ul className="list-disc pl-5 space-y-2 text-sm text-ink-muted">{entity.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></div>
              {entity.links.length > 0 && <div className="flex flex-wrap gap-4">{entity.links.map((link) => <a key={`${link.kind}-${link.href}`} href={link.href} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline inline-flex items-center gap-1">{link.label}<ExternalLink className="w-3.5 h-3.5" /></a>)}</div>}
            </div>
          </ProductSection>
        </div>
      </div>
    </article>
  );
}
