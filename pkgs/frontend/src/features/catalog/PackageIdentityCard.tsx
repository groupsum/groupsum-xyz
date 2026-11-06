import { BadgeCheck, CircleDot, ExternalLink, GitBranch, Package, Scale } from "lucide-react";
import { CatalogPill } from "./CatalogVisuals";
import { CatalogLink } from "./CatalogLink";
import { humanLabel, recordDescription, recordTitle, valueRecords, valueStrings, type CatalogRecord } from "./CatalogRecordShared";

export function PackageIdentityCard({ record, primaryUrl }: { record: CatalogRecord; primaryUrl?: unknown; onNavigate?: (path: string) => void }) {
  const raw = record as Record<string, unknown>;
  const repositories = valueRecords(record.repositories);
  const published = record.published || record.publication_status === "published";
  const legal = valueRecords(record.legal_observations);
  const externalUrl = typeof primaryUrl === "string" ? primaryUrl : undefined;
  const manifest = String(raw.manifest_path || repositories[0]?.path || "");
  const facts = [{ label: "Releases", count: Number(record.release_count || 0), hash: "release-history" },
    { label: "Dependencies", count: Number(record.dependency_count || 0), hash: "dependencies" },
    { label: "Dependents", count: Number(record.dependent_count || 0), hash: "dependents" }];
  return <header id="package-overview" className="record-header min-w-0 space-y-3 border-b border-[var(--color-border-soft)] pb-3">
    <div className="flex flex-wrap items-center gap-2"><Package className="h-5 w-5 shrink-0 text-signal" aria-hidden="true" /><h1 className="type-display-lg min-w-0 break-words">{recordTitle(record)}</h1>{record.latest_version && <strong className="type-technical break-all">{String(record.latest_version)}</strong>}<CatalogPill>{String(record.ecosystem || "unknown")}</CatalogPill><CatalogPill Icon={published ? BadgeCheck : CircleDot} tone={published ? "accent" : "neutral"}>{published ? "Published" : humanLabel(String(record.publication_status || "not observed"))}</CatalogPill>{externalUrl && <a href={externalUrl} target="_blank" rel="noreferrer" className="type-control inline-flex min-h-8 items-center gap-1 text-accent">{published && record.registry_url ? "Registry" : "Manifest"}<ExternalLink className="h-3 w-3" /></a>}</div>
    <p className="type-body-sm max-w-5xl text-ink-muted">{recordDescription(record)}</p>
    <div className="type-technical flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
      {repositories.map((repository, index) => { const owner = String(repository.owner || ""); const name = String(repository.name || ""); const route = String(repository.route || (owner && name ? `/catalog/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(name)}` : "")); return <span key={String(repository.id || index)} className="inline-flex min-w-0 max-w-full items-center gap-1"><GitBranch className="h-3 w-3 shrink-0 text-accent" /><CatalogLink href={route} className="truncate text-accent" title={`${owner}/${name}`}>{owner}/{name}</CatalogLink></span>; })}
      {manifest && <span className="min-w-0 max-w-full truncate text-ink-muted" title={manifest}>{record.source_url ? <a href={String(record.source_url)} target="_blank" rel="noreferrer" className="text-accent">{manifest}</a> : manifest}</span>}
      <span className="text-ink-muted">{humanLabel(String(record.package_kind || "package"))}</span>
      {raw.version_declared && raw.version_declared !== record.latest_version ? <span>Declared {String(raw.version_declared)}</span> : null}
    </div>
    <div className="type-control flex flex-wrap gap-x-5 gap-y-2">{facts.map((fact) => <a key={fact.hash} href={`#${fact.hash}`} className="min-h-8 text-accent"><strong className="tabular-nums">{fact.count.toLocaleString()}</strong> {fact.label}</a>)}{typeof raw.downloads === "number" && raw.downloads_source && raw.downloads_window ? <span>{raw.downloads.toLocaleString()} downloads · {String(raw.downloads_window)} · {String(raw.downloads_source)}</span> : null}</div>
    <div className="type-body-sm flex flex-wrap items-center gap-x-3 gap-y-1"><Scale className="h-3.5 w-3.5 text-accent" /><span>{String(record.license_expression || raw.license || "License not observed")}</span>{legal.filter((item) => item.url && ["license-file", "notice-file"].includes(String(item.kind))).map((item, index) => <a key={index} href={String(item.url)} target="_blank" rel="noreferrer" className="text-accent underline">{item.kind === "notice-file" ? "Notice" : "License file"}{item.scope === "inherited" ? " (inherited)" : ""}</a>)}</div>
    <details><summary className="type-control min-h-8 cursor-pointer text-accent">Details &amp; evidence</summary><div className="type-body-sm space-y-2 border-t border-[var(--color-border-soft)] py-2 text-ink-muted">
      {manifest && <p className="break-all">Manifest: {manifest}</p>}<p>Owner: {String(raw.owner || raw.repository || "Not recorded")}</p><p>Observed: {record.observed_at ? new Date(record.observed_at).toLocaleString() : "Not recorded"}</p><p>License status: {humanLabel(String(raw.license_status || "not observed"))}</p>
      {!!valueStrings(record.technologies).length && <p aria-label="Package technology stack">Technologies: {valueStrings(record.technologies).join(" · ")}</p>}
      {raw.claim_boundary ? <p>{String(raw.claim_boundary)}</p> : null}
      <ul className="space-y-1">{legal.map((item, index) => <li key={index} className="break-words">{humanLabel(String(item.kind || "legal evidence"))} · {String(item.scope || "direct")} · {String(item.path || item.expression || item.name || "Observed evidence")}{item.url ? <> · <a href={String(item.url)} target="_blank" rel="noreferrer" className="text-accent">Source ↗</a></> : null}</li>)}</ul><p>Legal metadata is source-reported and scoped to this package; it is not legal advice.</p>
      {valueRecords(record.evidence).length > 0 && <ul>{valueRecords(record.evidence).map((item, index) => <li key={index}>{String(item.kind || "Source")}{item.url ? <> · <a href={String(item.url)} className="text-accent" target="_blank" rel="noreferrer">Evidence ↗</a></> : null}</li>)}</ul>}
    </div></details>
  </header>;
}
