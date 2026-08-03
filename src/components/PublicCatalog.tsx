import React, { useEffect, useMemo, useState } from "react";
import {
  catalogDatasetManifest,
  catalogFeaturedRepositories,
  catalogOrganizations,
  catalogSummary,
  catalogTechnologies,
} from "../data/catalog.generated";
import { ArrowLeft, ArrowRight, ExternalLink, Search } from "lucide-react";

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
};

const datasetOrder = ["repositories", "packages", "releases", "deployments", "technologies", "surfaces", "relationships"] as const;
type DatasetName = (typeof datasetOrder)[number];

const labels: Record<DatasetName, string> = {
  repositories: "Repositories",
  packages: "Packages",
  releases: "Releases",
  deployments: "Deployments",
  technologies: "Technologies",
  surfaces: "Surfaces",
  relationships: "Relationships",
};

function recordTitle(record: CatalogRecord): string {
  return String(record.display_name || record.full_name || record.name || record.id);
}

function recordDescription(record: CatalogRecord): string {
  if (record.description) return String(record.description);
  if (record.kind === "github-deployment") {
    return `${String(record.repository || "Repository")} · ${String(record.environment || "environment not named")} · ${String(record.state || "state not observed")}`;
  }
  if (record.source && record.target) return `${String(record.source)} → ${String(record.target)}`;
  if (record.repository) return `Observed in ${String(record.repository)}.`;
  return "Public catalog record derived from the linked source evidence.";
}

function formatDate(value?: string): string {
  if (!value) return "not recorded";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString();
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
  const repositories = owner
    ? organization?.featured_repositories.slice(0, 4) || []
    : catalogFeaturedRepositories.slice(0, 4);
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
        ["Release records", catalogDatasetManifest.counts.releases],
        ["Relationships", catalogSummary.relationships],
      ];

  return (
    <section className="border-y border-[var(--color-border-soft)] bg-[var(--color-surface)]">
      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-9 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent font-bold">Observed data · {formatDate(catalogSummary.generated_at)}</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">{title}</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              {organization?.description || "Public records compiled from GitHub, repository manifests, PyPI, npm, crates.io, and GitHub Packages. Source, release, deployment, and live availability remain separate evidence states."}
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
        {repositories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {repositories.map((repository) => (
              <button key={repository.id} onClick={() => onNavigate(repository.route)} className="text-left p-4 bg-canvas border border-[var(--color-border-soft)] rounded-[var(--radius-sm)] hover:border-accent transition-colors cursor-pointer">
                <span className="text-[10px] font-mono uppercase text-accent">{owner || repository.owner}</span>
                <h3 className="text-sm font-semibold text-ink mt-1">{repository.name || repository.display_name}</h3>
                <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2 mt-1">{repository.description}</p>
              </button>
            ))}
          </div>
        )}
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
    <section className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      {!compact && (
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">Automated evidence catalog</span>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-ink">Public ecosystem records</h1>
          <p className="text-ink-muted leading-relaxed">Browse display-safe records generated from the complete normalized catalog. Missing registry observations and bounded downstream coverage are retained as limitations, not converted into negative claims.</p>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visible.map((record) => (
              <article key={record.id} className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-accent">{String(record.kind || dataset.slice(0, -1))}</span>
                  <h2 className="font-serif text-lg font-bold text-ink break-words">{recordTitle(record)}</h2>
                  <p className="text-xs text-ink-muted leading-relaxed mt-1 break-words">{recordDescription(record)}</p>
                </div>
                {record.metrics && <div className="flex flex-wrap gap-2">{Object.entries(record.metrics).slice(0, 6).map(([key, value]) => <span key={key} className="text-[9px] font-mono bg-canvas border border-[var(--color-border-soft)] px-1.5 py-0.5 rounded text-ink-muted">{key}: {Number(value).toLocaleString()}</span>)}</div>}
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
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
  const dataset = segments[1] as DatasetName;
  const normalizedPath = `/${segments.join("/")}`;
  const [record, setRecord] = useState<CatalogRecord | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    if (!datasetOrder.includes(dataset)) {
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
        setRecord(match || null);
        setState(match ? "ready" : "missing");
      })
      .catch((error: Error) => { if (error.name !== "AbortError") setState("error"); });
    return () => controller.abort();
  }, [dataset, normalizedPath]);

  if (state === "loading") return <div className="max-w-3xl mx-auto px-4 py-20 text-sm text-ink-muted" role="status">Loading generated catalog record…</div>;
  if (state !== "ready" || !record) return <div className="max-w-3xl mx-auto px-4 py-20 space-y-4"><h1 className="font-serif text-3xl font-bold text-ink">Catalog record unavailable</h1><p className="text-sm text-ink-muted">The route is not present in the current generated public dataset.</p><button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent hover:underline cursor-pointer">Return to public catalog</button></div>;

  const hidden = new Set(["id", "kind", "name", "display_name", "full_name", "description", "route", "evidence"]);
  return (
    <article className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button onClick={() => onNavigate("/catalog")} className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Public catalog</button>
      <header className="max-w-4xl space-y-3">
        <span className="text-xs font-mono uppercase text-accent">Generated {String(record.kind || "catalog record")}</span>
        <h1 className="font-serif text-4xl font-bold text-ink break-words">{recordTitle(record)}</h1>
        <p className="text-base text-ink-muted leading-relaxed">{recordDescription(record)}</p>
        <p className="text-xs font-mono text-ink-muted">Observed {formatDate(record.observed_at)} · {record.description_source === "reviewed-editorial" ? "reviewed description" : "source-derived description"}</p>
      </header>
      {record.claim_boundary && <aside className="p-5 border-l-4 border-accent bg-[var(--color-surface)] text-sm text-ink-muted"><strong className="text-ink block mb-1">Claim boundary</strong>{String(record.claim_boundary)}</aside>}
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(record).filter(([key, value]) => !hidden.has(key) && value !== null && value !== undefined && value !== "").map(([key, value]) => (
          <div key={key} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-sm)] min-w-0">
            <dt className="text-[10px] font-mono uppercase tracking-wide text-ink-muted">{key.replace(/_/g, " ")}</dt>
            <dd className="text-xs text-ink mt-1 break-words whitespace-pre-wrap">{typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}</dd>
          </div>
        ))}
      </dl>
      {record.evidence && record.evidence.length > 0 && <section className="space-y-3"><h2 className="font-serif text-xl font-bold text-ink">Evidence</h2>{record.evidence.map((item, index) => item.url ? <a key={`${item.url}-${index}`} href={item.url} target="_blank" rel="noreferrer" className="block text-sm text-accent hover:underline">{item.kind || "source"} · {item.url}</a> : <span key={index} className="block text-sm text-ink-muted">{item.kind || "source"} · observed {formatDate(item.observed_at)}</span>)}</section>}
    </article>
  );
}

export function CatalogTechnologySummary() {
  return <div className="flex flex-wrap gap-2">{catalogTechnologies.map((item) => <span key={item.id} className="text-[10px] font-mono px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded text-ink-muted">{item.name} · {item.repository_count} repos</span>)}</div>;
}
