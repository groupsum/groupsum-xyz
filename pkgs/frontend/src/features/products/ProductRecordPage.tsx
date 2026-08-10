import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Box, Building2, CheckCircle2, ExternalLink, FileCode2, GitBranch, Info, Layers, Package, Search, ShieldCheck } from "lucide-react";
import {
  PackageResource,
  RecordCollectionPageModel,
  RecordPageModel,
  RecordSummary,
  RepositoryResource,
  RepositorySignals,
  getRecordPageModel,
} from "../../api/catalog";
import { getProductEvidence } from "../../api/content";
import { portfolioEntities } from "../../data/entities";
import { PortfolioEntity } from "../../types";
import { RepositorySignalStrip } from "../catalog/RepositorySignals";
import { EntityOwnership } from "../catalog/EntityIdentity";
import { CollectionHeader, ContextRailCard, MemberRowCard, RecordIdentityCard, SurfaceCard, factIcons } from "../catalog/CatalogVisuals";
import { ExplorerProductPortfolioCollection } from "./ExplorerProductPortfolioCollection";

import { catalogBundle, ecosystemLabel, formatObserved, humanize, initialProductModel, organizationNames, portfolioRecordPath, productRecordPath, productRoute, repositorySignals, type Navigate, type ProductCatalogBundle, type ProductPageModel } from "./ProductPortfolioShared";

function DetailRows({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return <dl className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{rows.map(([label, value]) => <div key={label} className="py-3 sm:flex sm:gap-6"><dt className="text-[10px] font-mono uppercase tracking-wide text-ink-muted sm:w-40 shrink-0">{label}</dt><dd className="text-sm text-ink mt-1 sm:mt-0 min-w-0 break-words">{value}</dd></div>)}</dl>;
}

function ProductSection({ id, title, intro, children }: { id?: string; title: string; intro?: string; children: React.ReactNode }) {
  const icons = { overview: CheckCircle2, implementation: GitBranch, governance: ShieldCheck, packages: Package, releases: ArrowRight, dependencies: Layers, resources: FileCode2, evidence: Info } as const;
  return <SurfaceCard id={id} title={title} intro={intro} Icon={id ? icons[id as keyof typeof icons] || CheckCircle2 : CheckCircle2}>{children}</SurfaceCard>;
}

function InventoryMetrics({ bundle }: { bundle: ProductCatalogBundle }) {
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
  const [bundle, setBundle] = useState<ProductCatalogBundle | null>(() => initialModel ? catalogBundle(initialModel) : null);
  const [catalogState, setCatalogState] = useState<"loading" | "ready" | "unavailable" | "error">(initialModel ? "ready" : "loading");
  const [packageEcosystem, setPackageEcosystem] = useState("all");
  useEffect(() => {
    if (pageModel) return;
    const controller = new AbortController();
    if (!bundle) setCatalogState("loading");
    getRecordPageModel(`/api/v1/${recordType === "product" ? "products" : "portfolio"}/${slug}`, controller.signal)
      .then((value) => {
        const model = value as ProductPageModel;
        setPageModel(model);
        setBundle(catalogBundle(model));
        setCatalogState("ready");
      })
      .catch((error: Error) => {
        if (error.name === "AbortError" || bundle) return;
        if (!entity) {
          setCatalogState(error.message.includes("404") ? "unavailable" : "error");
          return;
        }
        getProductEvidence<ProductCatalogBundle>(entity.organization, entity.sourceName, controller.signal)
          .then((value) => { setBundle(value); setCatalogState("ready"); })
          .catch((fallbackError: Error) => { if (fallbackError.name !== "AbortError") setCatalogState("error"); });
      });
    return () => controller.abort();
  }, [entity?.id, entity?.slug, pageModel, recordType, slug]);
  if (!entity && !pageModel) {
    const loading = catalogState === "loading";
    return <div className="max-w-3xl mx-auto px-4 py-20 space-y-4"><h1 className="font-serif text-3xl font-bold text-ink">{loading ? "Loading portfolio inventory" : "Portfolio record unavailable"}</h1><p className="text-sm text-ink-muted">{loading ? "Loading the durable catalog record…" : "This public product or portfolio record could not be found."}</p><button onClick={() => onNavigate(recordType === "product" ? "/products" : "/portfolio")} className="text-xs font-mono text-accent hover:underline">Return to {recordType === "product" ? "products" : "portfolio"}</button></div>;
  }

  const children = entity ? portfolioEntities.filter((candidate) => candidate.approved && (candidate.parentId === entity.id || candidate.suiteId === entity.id)) : [];
  const relatedEditorial = (entity?.relatedProductSlugs || []).map((relatedSlug) => portfolioEntities.find((candidate) => candidate.slug === relatedSlug && candidate.approved)).filter((candidate): candidate is PortfolioEntity => Boolean(candidate));
  const connected = [...new Map([...children, ...relatedEditorial].map((candidate) => [candidate.id, candidate])).values()];
  const record = pageModel?.record;
  const recordOrganization = entity?.organization || String(record?.organization_slug || record?.organization_id || "groupsum");
  const displayName = entity?.displayName || String(record?.title || slug);
  const summary = entity?.summary || String(record?.summary || "Public catalog inventory record.");
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
  const observationRows = (pageModel?.editorial.observations?.map((item) => ({
    label: String((item.payload as Record<string, unknown> | undefined)?.label || item.observation_type || "Inventory observation"),
    checkedAt: String(item.observed_at || pageModel.generated_at),
    url: item.source_url ? String(item.source_url) : undefined,
  })) || entity?.evidence.map((item) => ({ ...item, url: undefined })) || []).map((item) => isSelfLink(item.url) ? { ...item, url: undefined } : item);
  const limitationRows = pageModel?.editorial.limitations.map((item) =>
    String(item.description || item.title || "Limitation not described"),
  ) || entity?.limitations || [];
  const relatedLinks = entity?.links || [];
  const claimBoundary = entity?.claimBoundary || (
    record?.content && typeof record.content === "object" &&
    (record.content as Record<string, unknown>).reviewed_positioning === false
      ? "Catalog-generated inventory record. Product positioning has not been editorially reviewed."
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
  const linkedSections = pageModel?.linked_sections || [];
  const resourceCount = linkedSections.reduce((total, section) => total + section.count, 0)
    || pageModel?.implementation.resources.length
    || bundle?.repository.related_resources?.length
    || 0;
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
          { label: "Linked resources", value: resourceCount, icon: FileCode2 },
        ]}
      />

      <nav aria-label="Product record sections" className="sticky top-16 z-20 bg-canvas/95 backdrop-blur border-y border-[var(--color-border-soft)] py-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono">
        {[['overview','Overview'],['implementation','Implementation'],['governance','SSOT governance'],['packages','Packages'],['releases','Releases'],['dependencies','Dependencies'],['resources','Related resources'],['observations','Source observations']].map(([id, label]) => <a key={id} href={`#${id}`} className="text-ink-muted hover:text-accent">{label}</a>)}
      </nav>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <aside className="space-y-6 lg:order-2 lg:col-span-4 lg:sticky lg:top-32">
          <ContextRailCard title="Source & observation boundary" Icon={ShieldCheck}>
            <div className="space-y-3 text-xs text-ink-muted">
              <p><strong className="text-ink">Inventory state:</strong> {catalogState === "ready" ? "Observed from linked sources" : humanize(catalogState)}</p>
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
          </ProductSection>

          <ProductSection id="implementation" title="Public implementation inventory" intro="Catalog observations strengthen this product record without replacing reviewed product positioning or becoming SSOT evidence.">
            {catalogState === "loading" && <p className="text-sm text-ink-muted" role="status">Loading repository and package inventory…</p>}
            {catalogState === "error" && <p className="text-sm text-red-700" role="alert">Public inventory could not be loaded.</p>}
            {catalogState === "unavailable" && <p className="text-sm text-ink-muted">No matching public repository is present in the current catalog scope.</p>}
            {bundle && <><InventoryMetrics bundle={bundle} /><DetailRows rows={[
              ["Observed", formatObserved(bundle.generated_at, true)],
            ]} />
            {repositories.length ? <div className="space-y-3 pt-2"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xs font-mono uppercase text-ink font-semibold">Repository implementation map</h3><span className="text-[10px] font-mono text-ink-muted">{repositories.length} attached repositories</span></div><p className="text-xs text-ink-muted">Metrics remain owned by each repository card and are never promoted to the product.</p><ul className="space-y-3">{repositories.map((repository) => {
              const repositoryPath = `/catalog/repositories/${repository.owner}/${repository.name}`;
              return <li key={repository.id} className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-canvas p-4 transition-colors hover:border-accent"><div className="flex flex-wrap items-start justify-between gap-2"><div><span className="text-[10px] font-mono uppercase text-ink-muted">{humanize(repository.role)}</span><div className="mt-1 flex flex-wrap items-center gap-2"><a href={repositoryPath} onClick={(event) => { event.preventDefault(); onNavigate(repositoryPath); }} className="font-serif text-lg font-bold text-accent hover:underline">{repository.owner}/{repository.name}</a>{repository.governance.governed && <span className="px-2 py-1 rounded border border-accent text-[10px] font-mono uppercase font-semibold text-accent">SSOT governed</span>}</div></div><a href={repositoryPath} onClick={(event) => { event.preventDefault(); onNavigate(repositoryPath); }} className="inline-flex min-h-10 items-center text-xs font-mono font-semibold text-accent hover:underline">View repository detail <ArrowRight className="h-3.5 w-3.5" /></a></div>{repository.description && <p className="text-xs leading-relaxed text-ink-muted">{repository.description}</p>}<div className="border-t border-[var(--color-border-soft)] pt-3"><RepositorySignalStrip signals={repositorySignals(repository)} compact /></div></li>;
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
            </div> : <p className="text-sm text-ink-muted">{catalogState === "loading" ? "Loading packages…" : "No public package records are attached to this product."}</p>}
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

          {linkedSections.map((section, sectionIndex) => {
            const members = Array.isArray(section.members) ? section.members : [];
            const sectionId = sectionIndex === 0 ? "resources" : `resources-${section.type_key.replace(/[^a-z0-9]+/gi, "-")}`;
            return <ProductSection key={section.type_key} id={sectionId} title={section.label} intro={`${section.count.toLocaleString()} directly linked ${section.count === 1 ? "resource" : "resources"}.`}>
              <ul className="divide-y divide-[var(--color-border-soft)]">{members.map((member) => <li key={String(member.id)} className="flex flex-wrap items-center justify-between gap-4 py-3"><div className="min-w-0"><p className="break-words text-sm font-semibold text-ink">{String(member.name || "Untitled resource")}</p>{member.summary && <p className="mt-1 text-xs text-ink-muted">{String(member.summary)}</p>}<span className="mt-1 block text-[9px] font-mono uppercase text-ink-muted">{humanize(String(member.relationship || "linked"))}</span></div>{member.route && <a href={String(member.route)} onClick={(event) => { event.preventDefault(); onNavigate(String(member.route)); }} className="inline-flex min-h-10 items-center gap-1 text-xs font-mono font-semibold text-accent hover:underline">Inspect {section.label.toLowerCase()} <ArrowRight className="h-3.5 w-3.5" /></a>}</li>)}</ul>
            </ProductSection>;
          })}

          {connected.length > 0 && <ProductSection title="Connected portfolio records" intro="Reviewed products, applications, and packages grouped with this product."><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{connected.map((candidate) => <li key={candidate.id}><a href={productRoute(candidate)} onClick={(event) => { event.preventDefault(); onNavigate(productRoute(candidate)); }} className="group flex items-start justify-between gap-4 py-4"><div><span className="text-[10px] font-mono uppercase text-accent">{humanize(candidate.kind)}</span><h3 className="font-serif text-lg font-bold text-ink group-hover:text-accent">{candidate.displayName}</h3><p className="text-xs text-ink-muted mt-1">{candidate.summary}</p></div><ArrowRight className="w-4 h-4 text-accent shrink-0 mt-2" /></a></li>)}</ul></ProductSection>}

          <ProductSection id="observations" title="Source observations and limitations" intro="These inventory and editorial source checks are not SSOT evidence records.">
            <div className="space-y-6">
              <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Observed sources</h3><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{observationRows.map((item, index) => <li key={`${item.label}-${index}`} className="py-3 text-sm text-ink"><span className="font-medium">{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{item.label}</a> : item.label}<span className="text-ink-muted"> · observed {item.checkedAt}</span></span></li>)}</ul></div>
              <div><h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Limitations</h3><ul className="list-disc pl-5 space-y-2 text-sm text-ink-muted">{limitationRows.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></div>
              {relatedLinks.length > 0 && <div className="flex flex-wrap gap-4">{relatedLinks.map((link) => <a key={`${link.kind}-${link.href}`} href={link.href} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline inline-flex items-center gap-1">{link.label}<ExternalLink className="w-3.5 h-3.5" /></a>)}</div>}
            </div>
          </ProductSection>
        </div>
      </div>
    </article>
  );
}
