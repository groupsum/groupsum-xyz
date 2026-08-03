import React, { useEffect, useMemo, useState } from "react";
import {
  catalogDatasetManifest,
  catalogOrganizations,
  catalogSummary,
  catalogTechnologies,
} from "../data/catalog.generated";
import { EntityGraph, getEntityPageModel, getRepositoryMetricSnapshot, RepositoryMetricRecord } from "../api/catalog.generated";
import { ArrowLeft, ArrowRight, ExternalLink, Search } from "lucide-react";
import { RepositorySignalStrip } from "./RepositorySignals";
import { EntityOwnership, EntityRelationshipRows } from "./EntityIdentity";

type CatalogRecord = Record<string, unknown> & {
  id: string;
  kind?: string;
  name?: string;
  display_name?: string;
  full_name?: string;
  description?: string;
  route?: string;
  url?: string;
  registry_url?: string;
  observed_at?: string;
  claim_boundary?: string;
  metrics?: Record<string, number>;
  evidence?: Array<{ kind?: string; url?: string; observed_at?: string }>;
  legal_evidence?: Array<Record<string, unknown>>;
  ssot_governance?: Record<string, unknown>;
  entity_graph?: EntityGraph | null;
};

const datasetOrder = ["repositories", "packages", "resources", "technologies"] as const;
type DatasetName = (typeof datasetOrder)[number];

const labels: Record<DatasetName, string> = {
  repositories: "Repositories",
  packages: "Packages",
  resources: "APIs, demos & examples",
  technologies: "Technologies",
};

function recordTitle(record: CatalogRecord): string {
  return String(record.display_name || record.full_name || record.name || record.id);
}

function recordDescription(record: CatalogRecord): string {
  if (record.description) return String(record.description);
  if (record.repository) return `Observed in ${String(record.repository)}.`;
  return "Public catalog record derived from the linked source evidence.";
}

function formatDate(value?: string): string {
  if (!value) return "not recorded";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString();
}

function recordMetrics(record: CatalogRecord): Array<[string, number]> {
  if (record.metrics) return Object.entries(record.metrics).slice(0, 8);
  if (record.kind === "package") return [
    ["releases", Number(record.release_count || 0)],
    ["dependencies", Number(record.dependency_count || 0)],
    ["downstream", Number(record.downstream_count || 0)],
    ["relationships", Number(record.relationship_count || 0)],
  ];
  if (record.kind === "technology") return [["repositories", Number(record.repository_count || 0)]];
  return [];
}

function valueRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function valueStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function valueRecords(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];
}

function humanLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function DetailRows({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  const visible = rows.filter(([, value]) => value !== null && value !== undefined && value !== "");
  if (!visible.length) return null;
  return (
    <dl className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">
      {visible.map(([label, value]) => (
        <div key={label} className="py-3 sm:py-4 sm:flex sm:items-baseline sm:gap-8">
          <dt className="text-[10px] font-mono uppercase tracking-wide text-ink-muted sm:w-44 sm:shrink-0">{label}</dt>
          <dd className="text-sm text-ink mt-1 sm:mt-0 min-w-0 break-words">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function DetailSection({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--color-border-soft)] pt-7 space-y-4">
      <div className="max-w-2xl space-y-1">
        <h2 className="font-serif text-xl font-bold text-ink">{title}</h2>
        {intro && <p className="text-sm text-ink-muted leading-relaxed">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function MetricRows({ values }: { values: Record<string, unknown> }) {
  return <DetailRows rows={Object.entries(values).filter(([, value]) => typeof value === "number").map(([key, value]) => [humanLabel(key), Number(value).toLocaleString()])} />;
}

function RelationshipRows({ values }: { values: unknown }) {
  const relationships = valueRecord(values);
  if (!Object.keys(relationships).length) return <p className="text-sm text-ink-muted">No catalog relationships were observed for this record.</p>;
  return <DetailRows rows={Object.entries(relationships).map(([key, value]) => [humanLabel(key), Number(value).toLocaleString()])} />;
}

function LegalSection({ record }: { record: CatalogRecord }) {
  const legal = valueRecords(record.legal_evidence);
  return <DetailSection title="License and notices" intro="Observed metadata and repository files are reported as evidence, not legal advice.">
    <DetailRows rows={[["License expression", String(record.license_expression || record.license || "Not observed")], ["Evidence status", humanLabel(String(record.license_status || (legal.length ? "observed" : "not observed")))]]} />
    {legal.length > 0 ? <ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{legal.map((item, index) => <li key={`${String(item.url)}-${index}`} className="py-3 sm:flex sm:justify-between gap-4"><div><span className="text-[10px] font-mono uppercase text-accent">{humanLabel(String(item.kind || "legal evidence"))} · {humanLabel(String(item.scope || "direct"))}</span><p className="text-sm text-ink">{String(item.name || item.path || "License or notice")}</p>{item.expression && <p className="text-xs text-ink-muted mt-1">{String(item.expression)}</p>}</div>{item.url && <a href={String(item.url)} target="_blank" rel="noreferrer" className="text-xs font-mono text-accent hover:underline shrink-0">View evidence</a>}</li>)}</ul> : <p className="text-sm text-ink-muted">No license or notice evidence was observed for this resource.</p>}
  </DetailSection>;
}

const ssotCountOrder = ["adrs", "specs", "features", "tests", "claims", "evidence", "issues", "boundaries", "profiles", "releases"];

function SsotGovernanceSection({ governance }: { governance: Record<string, unknown> }) {
  const counts = valueRecord(governance.counts);
  const coverage = valueRecord(governance.coverage);
  const registryUrl = String(governance.registry_url || "");
  return <DetailSection title="SSOT governance" intro="Counts and linkage coverage are reported directly from the repository's canonical .ssot/registry.json.">
    <DetailRows rows={[
      ["Registry", registryUrl ? <a href={registryUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">View canonical registry</a> : "Not available"],
      ["Schema version", String(governance.schema_version || "Not recorded")],
      ["Observed", formatDate(governance.observed_at as string | undefined)],
      ["Source digest", governance.source_sha256 ? <code className="font-mono text-xs">{String(governance.source_sha256).slice(0, 16)}â€¦</code> : "Not recorded"],
    ]} />
    <div>
      <h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Registry inventory</h3>
      <DetailRows rows={ssotCountOrder.map((key) => [humanLabel(key), Number(counts[key] || 0).toLocaleString()])} />
    </div>
    <div>
      <h3 className="text-xs font-mono uppercase text-ink font-semibold mb-2">Claim and evidence linkage</h3>
      <DetailRows rows={Object.entries(coverage).map(([key, value]) => [humanLabel(key), Number(value || 0).toLocaleString()])} />
    </div>
    <p className="text-xs text-ink-muted border-l-2 border-[var(--color-border-muted)] pl-3">{String(governance.limitation || "Registry presence and reported linkage do not independently validate every public product claim.")}</p>
  </DetailSection>;
}

function RepositoryDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const commit = valueRecord(record.latest_commit);
  const release = valueRecord(record.latest_release);
  const deployment = valueRecord(record.latest_deployment);
  const technologies = valueStrings(record.technologies);
  const resources = valueRecords(record.related_resources);
  return (
    <>
      <DetailSection title="Repository overview">
        <DetailRows rows={[
          ["Owner", String(record.owner || "Not recorded")],
          ["Visibility", humanLabel(String(record.visibility || "not recorded"))],
          ["Default branch", String(record.default_branch || "Not recorded")],
          ["License", String(record.license || "Not declared")],
          ["Created", formatDate(record.created_at as string | undefined)],
          ["Last pushed", formatDate(record.pushed_at as string | undefined)],
        ]} />
      </DetailSection>
      <DetailSection title="Observed activity" intro="Counts describe the current public repository snapshot.">
        <MetricRows values={valueRecord(record.metrics)} />
      </DetailSection>
      {record.ssot_governance && Boolean(record.ssot_governance.governed) && <SsotGovernanceSection governance={record.ssot_governance} />}
      {technologies.length > 0 && <DetailSection title="Verified technologies" intro="Language labels come from GitHub language byte counts.">
        <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Verified technologies">
          {technologies.map((technology) => <li key={technology} className="text-sm text-ink border-b border-[var(--color-border-muted)] pb-1">{technology}</li>)}
        </ul>
      </DetailSection>}
      <DetailSection title="Latest observed events">
        <DetailRows rows={[
          ["Commit", commit.message ? <span>{String(commit.message)}{commit.url && <> · <a href={String(commit.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View commit</a></>}</span> : "No commit observed"],
          ["Commit date", formatDate(commit.committed_at as string | undefined)],
          ["Release", release.tag ? <span>{String(release.name || release.tag)}{release.url && <> · <a href={String(release.url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View release</a></>}</span> : "No GitHub release observed"],
          ["Release date", formatDate(release.published_at as string | undefined)],
          ["Deployment", deployment.environment ? `${String(deployment.environment)} · ${humanLabel(String(deployment.state || "state not recorded"))}` : "No deployment observed"],
          ["Deployment update", deployment.updated_at ? formatDate(String(deployment.updated_at)) : null],
          ["Deployment evidence", deployment.log_url ? <a href={String(deployment.log_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View deployment log</a> : null],
        ]} />
      </DetailSection>
      <DetailSection title="Relationships" intro="Relationship types are aggregated from repository manifests and catalog links.">
        <RelationshipRows values={record.relationship_counts} />
      </DetailSection>
      {resources.length > 0 && <DetailSection title="Related resources" intro="Source-backed APIs, demos, documentation, examples, showcases, UIs, and websites attached to this repository.">
        <ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">
          {resources.map((resource) => <li key={String(resource.id)} className="py-3 sm:flex sm:items-baseline sm:justify-between gap-5"><div><span className="text-[10px] font-mono uppercase text-accent">{humanLabel(String(resource.kind || "resource"))}</span><p className="text-sm text-ink break-all">{String(resource.name || "Related resource")}</p></div><div className="flex gap-3">{resource.route && <button onClick={() => onNavigate(String(resource.route))} className="text-xs font-mono text-accent hover:underline cursor-pointer">View details</button>}{resource.url && <a href={String(resource.url)} target="_blank" rel="noreferrer" className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1">Source <ExternalLink className="w-3.5 h-3.5" /></a>}</div></li>)}
        </ul>
      </DetailSection>}
      <LegalSection record={record} />
    </>
  );
}

function PackageDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const registryLink = record.registry_url ? <a href={String(record.registry_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{String(record.registry_url)}</a> : "Not confirmed";
  const sourceLink = record.source_url ? <a href={String(record.source_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">View manifest</a> : "Not recorded";
  return (
    <>
      <DetailSection title="Package overview">
        <DetailRows rows={[
          ["Owner", String(record.owner || "Not recorded")],
          ["Ecosystem", humanLabel(String(record.ecosystem || "unknown"))],
          ["Repository", String(record.repository || "Not linked")],
          ["Publication", humanLabel(String(record.publication_status || "not confirmed"))],
          ["Latest version", String(record.latest_version || "Not recorded")],
          ["Declared version", String(record.version_declared || "Not recorded")],
          ["Registry", registryLink],
          ["Manifest", sourceLink],
        ]} />
      </DetailSection>
      <DetailSection title="Observed package activity">
        <DetailRows rows={[
          ["Release versions", Number(record.release_count || 0).toLocaleString()],
          ["Dependencies", Number(record.dependency_count || 0).toLocaleString()],
          ["Downstream records", Number(record.downstream_count || 0).toLocaleString()],
          ["Downstream coverage", humanLabel(String(record.downstream_completeness || "not observed"))],
          ["Relationships", Number(record.relationship_count || 0).toLocaleString()],
          ["Downloads", typeof record.downloads === "number" ? record.downloads.toLocaleString() : "Not reported by this source"],
        ]} />
      </DetailSection>
      <DetailSection title="Relationships" intro="Dependency and containment relationships are summarized by observed type.">
        <RelationshipRows values={record.relationship_counts} />
      </DetailSection>
      {valueRecords(record.releases).length > 0 && <DetailSection title="Release history" intro="Each registry or GitHub release has a typed evidence record."><ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{valueRecords(record.releases).slice(0, 100).map((release) => <li key={String(release.id)} className="py-3 flex items-baseline justify-between gap-4"><div><span className="text-[10px] font-mono uppercase text-accent">{humanLabel(String(release.release_kind || "release"))}</span><p className="text-sm text-ink">{String(release.version || "Unversioned release")}</p></div>{release.route && <button onClick={() => onNavigate(String(release.route))} className="text-xs font-mono text-accent hover:underline cursor-pointer">View release</button>}</li>)}</ul></DetailSection>}
      <LegalSection record={record} />
    </>
  );
}

function ResourceDetail({ record }: { record: CatalogRecord }) {
  return <>
    <DetailSection title={`${humanLabel(String(record.resource_type || "resource"))} overview`} intro="This is a typed implementation-evidence resource attached to its parent repository or product.">
      <DetailRows rows={[["Resource type", humanLabel(String(record.resource_type || "resource"))], ["Repository", String(record.repository || "Not linked")], ["Repository path", String(record.path || "Not recorded")], ["Evidence type", humanLabel(String(record.evidence_type || "source"))]]} />
    </DetailSection>
    <LegalSection record={record} />
  </>;
}

function ReleaseDetail({ record, onNavigate }: { record: CatalogRecord; onNavigate: (path: string) => void }) {
  const parent = valueRecord(record.parent);
  return <>
    <DetailSection title="Release evidence" intro="Version, publication, download, and status fields are registry- or GitHub-observed facts.">
      <DetailRows rows={[["Release kind", humanLabel(String(record.release_kind || record.resource_type || "release"))], ["Version", String(record.version || "Not recorded")], ["Published", formatDate(record.published_at as string | undefined)], ["Downloads", typeof record.downloads === "number" ? record.downloads.toLocaleString() : "Not reported"], ["Prerelease", record.prerelease ? "Yes" : "No"], ["Draft", record.draft ? "Yes" : "No"]]} />
      {parent.route_key && <button onClick={() => onNavigate(`/catalog/packages/${String(parent.ecosystem)}/${String(parent.route_key)}`)} className="text-xs font-mono text-accent hover:underline cursor-pointer">View parent package</button>}
    </DetailSection>
    <LegalSection record={record} />
  </>;
}

function TechnologyDetail({ record }: { record: CatalogRecord }) {
  const repositories = valueStrings(record.repositories);
  return (
    <>
      <DetailSection title="Technology usage" intro="Usage is derived from GitHub language observations, not marketing descriptions.">
        <DetailRows rows={[
          ["Repositories", Number(record.repository_count || 0).toLocaleString()],
          ["Observed bytes", Number(record.bytes || 0).toLocaleString()],
        ]} />
      </DetailSection>
      <DetailSection title="Observed repositories">
        {repositories.length > 0 ? <ul className="divide-y divide-[var(--color-border-soft)] border-y border-[var(--color-border-soft)]">
          {repositories.map((repository) => <li key={repository} className="py-3"><a href={`https://github.com/${repository}`} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline inline-flex items-center gap-1">{repository}<ExternalLink className="w-3.5 h-3.5" /></a></li>)}
        </ul> : <p className="text-sm text-ink-muted">No repositories were observed.</p>}
      </DetailSection>
    </>
  );
}

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
        ["Relationships", catalogDatasetManifest.source_counts.relationships],
      ];

  return (
    <section className="border-y border-[var(--color-border-soft)] bg-[var(--color-surface)]">
      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-9 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent font-bold">Observed data · {formatDate(catalogSummary.generated_at)}</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">{title}</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              {organization?.description || "Public records compiled from GitHub, repository manifests, PyPI, npm, crates.io, and GitHub Packages. Releases, deployments, and relationships are summarized on their repository or package records; live availability remains a separate evidence state."}
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

export function PublicCatalogExplorer({ onNavigate, compact = false }: { onNavigate: (path: string) => void; compact?: boolean }) {
  const [dataset, setDataset] = useState<DatasetName>("repositories");
  const [records, setRecords] = useState<CatalogRecord[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const pageSize = compact ? 24 : 50;

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    setPage(1);
    fetch(`/catalog/site/${dataset}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`catalog response ${response.status}`);
        return response.json();
      })
      .then((value: CatalogRecord[]) => {
        setRecords(value);
        setState("ready");
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, [dataset]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return records;
    return records.filter((record) => JSON.stringify(record).toLowerCase().includes(normalized));
  }, [query, records]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {!compact && (
        <header className="max-w-4xl space-y-5">
          <button onClick={() => onNavigate("/products")} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Product collection</button>
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">Supporting evidence index</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-ink">Public catalog</h1>
            <p className="text-ink-muted text-base sm:text-lg leading-relaxed">Use the product and portfolio pages for cohesive product evaluation. This secondary index exposes the repository, package, and technology evidence used to strengthen those records.</p>
          </div>
        </header>
      )}
      <div className="flex flex-wrap gap-2" aria-label="Catalog datasets">
        {datasetOrder.map((name) => (
          <button key={name} type="button" onClick={() => setDataset(name)} aria-pressed={dataset === name} className={`px-3 py-2 rounded-[var(--radius-sm)] border text-xs font-mono cursor-pointer ${dataset === name ? "bg-accent text-white border-accent" : "bg-[var(--color-surface)] text-ink-muted border-[var(--color-border-soft)] hover:border-accent"}`}>
            {labels[name]} ({Number(catalogDatasetManifest.counts[name]).toLocaleString()})
          </button>
        ))}
      </div>
      <label className="relative block max-w-2xl">
        <span className="sr-only">Search {labels[dataset]}</span>
        <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
        <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={`Search ${labels[dataset].toLowerCase()}...`} className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border-muted)] rounded-[var(--radius-sm)] text-sm text-ink focus:outline-none focus:border-accent" />
      </label>
      {state === "loading" && <div className="p-10 text-center text-sm text-ink-muted" role="status">Loading {labels[dataset].toLowerCase()}…</div>}
      {state === "error" && <div className="p-6 border border-red-500/20 bg-red-500/5 text-sm text-red-700 rounded-[var(--radius-sm)]" role="alert">The generated dataset could not be loaded. The normalized JSON remains available from the download links below.</div>}
      {state === "ready" && (
        <>
          <div className="text-xs font-mono text-ink-muted">{filtered.length.toLocaleString()} matching records · page {page.toLocaleString()} of {pages.toLocaleString()}</div>
          <div className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">
            {visible.map((record) => (
              <article key={record.id} className="py-5 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6 sm:items-start">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase text-accent">{String(record.kind || dataset.slice(0, -1))}</span>
                  <h2 className="font-serif text-lg font-bold text-ink break-words">{recordTitle(record)}</h2>
                  <p className="text-xs text-ink-muted leading-relaxed mt-1 break-words">{recordDescription(record)}</p>
                  {recordMetrics(record).length > 0 && <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">{recordMetrics(record).map(([key, value]) => <span key={key} className="text-[9px] font-mono text-ink-muted">{key}: {value.toLocaleString()}</span>)}</div>}
                </div>
                <div className="flex sm:flex-col sm:items-end flex-wrap items-center gap-3 text-[10px] font-mono mt-4 sm:mt-0">
                  <span className="text-ink-muted">Observed {formatDate(record.observed_at)}</span>
                  {record.route && <button onClick={() => onNavigate(record.route!)} className="text-accent hover:underline cursor-pointer">View record</button>}
                  {(record.url || record.registry_url) && <a href={String(record.url || record.registry_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline inline-flex items-center gap-1">Source <ExternalLink className="w-3 h-3" /></a>}
                </div>
              </article>
            ))}
          </div>
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

export function PublicCatalogDetail({ path, onNavigate }: { path: string; onNavigate: (path: string) => void }) {
  const segments = path.split(/[?#]/)[0].split("/").filter(Boolean);
  const dataset = segments[1] as DatasetName | "releases";
  const normalizedPath = `/${segments.join("/")}`;
  const [record, setRecord] = useState<CatalogRecord | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    if (dataset === "releases") {
      const controller = new AbortController();
      const routeKey = segments.at(-1) || "";
      fetch(`/api/v1/catalog/releases/${encodeURIComponent(routeKey)}`, { signal: controller.signal })
        .then((response) => { if (!response.ok) throw new Error(`catalog response ${response.status}`); return response.json(); })
        .then((model: Record<string, unknown>) => {
          const item = valueRecord(model.item);
          const legal = valueRecord(model.legal);
          setRecord({
            ...item,
            id: String(item.id || routeKey),
            kind: "release",
            resource_type: model.resource_type,
            parent: model.parent,
            legal_evidence: valueRecords(legal.evidence),
            license_expression: legal.license_expression,
            license_status: legal.status,
          } as CatalogRecord);
          setState("ready");
        })
        .catch((error: Error) => { if (error.name !== "AbortError") setState(error.message.includes("404") ? "missing" : "error"); });
      return () => controller.abort();
    }
    if (!datasetOrder.includes(dataset as DatasetName)) {
      setState("missing");
      return;
    }
    const controller = new AbortController();
    fetch(`/catalog/site/${dataset}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`catalog response ${response.status}`);
        return response.json();
      })
      .then((records: CatalogRecord[]) => {
        const match = records.find((item) => item.route === normalizedPath);
        if (!match) { setRecord(null); setState("missing"); return; }
        if (dataset === "packages" || dataset === "resources") {
          const routeKey = segments.at(-1) || "";
          fetch(`/api/v1/catalog/${dataset}/${encodeURIComponent(routeKey)}`, { signal: controller.signal })
            .then((response) => response.ok ? response.json() : Promise.reject(new Error(`resource response ${response.status}`)))
            .then((model: Record<string, unknown>) => {
              const item = valueRecord(model.item); const legal = valueRecord(model.legal); const implementation = valueRecord(model.implementation);
              setRecord({ ...match, ...item, resource_type: model.resource_type || match.resource_type, parent: model.parent, entity_graph: model.graph as EntityGraph | null, legal_evidence: valueRecords(legal.evidence), license_expression: legal.license_expression, license_status: legal.status, releases: implementation.releases, dependencies: implementation.dependencies, dependents: implementation.dependents, downloads: valueRecord(implementation.downloads).value } as CatalogRecord);
              setState("ready");
            })
            .catch(() => { setRecord(match); setState("ready"); });
          return;
        }
        if (dataset === "repositories") {
          const owner = String(match.owner || segments.at(-2) || ""); const name = String(match.name || segments.at(-1) || "");
          getEntityPageModel(`entity:repositories:github:${owner}/${name}`, controller.signal)
            .then((model) => { setRecord({ ...match, entity_graph: model.graph }); setState("ready"); })
            .catch(() => { setRecord(match); setState("ready"); });
          return;
        }
        setRecord(match); setState("ready");
      })
      .catch((error: Error) => { if (error.name !== "AbortError") setState("error"); });
    return () => controller.abort();
  }, [dataset, normalizedPath, path]);

  if (state === "loading") return <div className="max-w-3xl mx-auto px-4 py-20 text-sm text-ink-muted" role="status">Loading generated catalog record…</div>;
  if (state !== "ready" || !record) return <div className="max-w-3xl mx-auto px-4 py-20 space-y-4"><h1 className="font-serif text-3xl font-bold text-ink">Catalog record unavailable</h1><p className="text-sm text-ink-muted">{state === "error" ? "The generated catalog could not be loaded. Please try again shortly." : "The route is not present in the current generated public dataset."}</p><button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent hover:underline cursor-pointer">Return to public catalog</button></div>;

  const primaryUrl = record.url || record.registry_url || record.source_url;
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8 sm:space-y-10">
      <button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Public catalog</button>
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase text-accent">Generated {String(record.kind || "catalog record")}</span>
          {record.kind === "repository" && Boolean(record.ssot_governance?.governed) && <span className="px-2 py-1 rounded border border-accent text-[10px] font-mono uppercase font-semibold text-accent">SSOT governed</span>}
        </div>
        <div className="space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink break-words tracking-tight">{recordTitle(record)}</h1>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-3xl">{recordDescription(record)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-ink-muted">
          <span>Observed {formatDate(record.observed_at)}</span>
          <span>{record.description_source === "reviewed-editorial" ? "Reviewed description" : "Source-derived description"}</span>
          {primaryUrl && <a href={String(primaryUrl)} target="_blank" rel="noreferrer" className="text-accent hover:underline inline-flex items-center gap-1">Open primary source <ExternalLink className="w-3.5 h-3.5" /></a>}
        </div>
      </header>
      <EntityOwnership graph={record.entity_graph} onNavigate={onNavigate} />
      {record.claim_boundary && <aside className="border-l-2 border-accent pl-4 py-1 text-sm text-ink-muted leading-relaxed"><strong className="text-ink block mb-1">Source boundary</strong>{String(record.claim_boundary)}</aside>}
      {record.kind === "repository" && <RepositoryDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "package" && <PackageDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "resource" && <ResourceDetail record={record} />}
      {record.kind === "release" && <ReleaseDetail record={record} onNavigate={onNavigate} />}
      {record.kind === "technology" && <TechnologyDetail record={record} />}
      {record.entity_graph && <DetailSection title="Connected resources" intro="Typed graph relationships keep ownership, implementation, distribution, and source-code roles explicit."><EntityRelationshipRows graph={record.entity_graph} onNavigate={onNavigate} /></DetailSection>}
      {record.evidence && record.evidence.length > 0 && <DetailSection title="Source provenance"><ul className="divide-y divide-[var(--color-border-soft)] border-y border-[var(--color-border-soft)]">{record.evidence.map((item, index) => <li key={`${item.url || item.kind}-${index}`} className="py-3 text-sm">{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="text-accent hover:underline inline-flex items-center gap-1">{humanLabel(item.kind || "source")}<ExternalLink className="w-3.5 h-3.5" /></a> : <span className="text-ink-muted">{humanLabel(item.kind || "source")} · observed {formatDate(item.observed_at)}</span>}</li>)}</ul></DetailSection>}
    </article>
  );
}

export function CatalogTechnologySummary() {
  return <div className="flex flex-wrap gap-2">{catalogTechnologies.map((item) => <span key={item.id} className="text-[10px] font-mono px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded text-ink-muted">{item.name} · {item.repository_count} repos</span>)}</div>;
}
