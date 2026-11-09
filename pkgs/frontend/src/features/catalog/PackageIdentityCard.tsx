import { BadgeCheck, CircleDot, ExternalLink, GitBranch, Package, Scale } from "lucide-react";
import { CatalogPill } from "./CatalogVisuals";
import { CatalogLink } from "./CatalogLink";
import { formatDate, humanLabel, recordTitle, valueRecords, valueStrings, type CatalogRecord } from "./CatalogRecordShared";

export function PackageIdentityCard({ record, primaryUrl }: { record: CatalogRecord; primaryUrl?: unknown; onNavigate?: (path: string) => void }) {
  const raw = record as Record<string, unknown>;
  const repositories = valueRecords(record.repositories);
  const published = record.published || record.publication_status === "published";
  const legal = valueRecords(record.legal_observations);
  const externalUrl = typeof primaryUrl === "string" ? primaryUrl : undefined;
  const manifest = String(raw.manifest_path || repositories[0]?.path || "");
  const description = String(record.description || "").trim();
  const boilerplate = `Observed ${record.ecosystem} package record for ${record.name}.`;
  const technologies = valueStrings(record.technologies);
  const licenseFiles = legal.filter((item) => item.url && ["license-file", "notice-file"].includes(String(item.kind)));
  const shownUrls = new Set([externalUrl, manifest && record.source_url, ...licenseFiles.map((item) => item.url)]);
  const evidence = [...legal, ...valueRecords(record.evidence)].filter(({ url }) => {
    if (typeof url !== "string" || !url || shownUrls.has(url)) return false;
    shownUrls.add(url);
    return true;
  });
  const facts = [{ label: "Releases", count: Number(record.release_count || 0), hash: "release-history" },
    { label: "Dependencies", count: Number(record.dependency_count || 0), hash: "dependencies" },
    { label: "Dependents", count: Number(record.dependent_count || 0), hash: "dependents" }];
  return <header id="package-overview" className="record-header min-w-0 space-y-3 border-b border-[var(--color-border-soft)] pb-3">
    <div className="flex flex-wrap items-center gap-2"><Package className="h-5 w-5 shrink-0 text-signal" aria-hidden="true" /><h1 className="type-display-lg min-w-0 break-words">{recordTitle(record)}</h1>{record.latest_version && <strong className="type-technical break-all">{String(record.latest_version)}</strong>}<CatalogPill>{String(record.ecosystem || "unknown")}</CatalogPill><CatalogPill Icon={published ? BadgeCheck : CircleDot} tone={published ? "signal" : "neutral"}>{published ? "Published" : publicationLabel(record.publication_status || record.package_kind)}</CatalogPill>{externalUrl && <a href={externalUrl} target="_blank" rel="noreferrer" className="type-control inline-flex min-h-8 items-center gap-1 text-accent">{published && record.registry_url ? "Registry" : "Manifest"}<ExternalLink className="h-3 w-3" /></a>}</div>
    {description && description !== boilerplate && <p className="type-body-sm max-w-5xl text-ink-muted">{description}</p>}
    <div className="type-technical flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
      {repositories.map((repository, index) => { const owner = String(repository.owner || ""); const name = String(repository.name || ""); const route = String(repository.route || (owner && name ? `/catalog/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(name)}` : "")); return <span key={String(repository.id || index)} className="inline-flex min-w-0 max-w-full items-center gap-1"><GitBranch className="h-3 w-3 shrink-0 text-accent" /><CatalogLink href={route} className="truncate text-accent" title={`${owner}/${name}`}>{owner}/{name}</CatalogLink></span>; })}
      {manifest && <span className="min-w-0 max-w-full truncate text-ink-muted" title={manifest}>{record.source_url ? <a href={String(record.source_url)} target="_blank" rel="noreferrer" className="text-accent">{manifest}</a> : manifest}</span>}
      {record.package_kind && !["Published", "Private"].includes(publicationLabel(record.package_kind)) && <span className="text-ink-muted">{humanLabel(String(record.package_kind))}</span>}
      {raw.version_declared && raw.version_declared !== record.latest_version ? <span>Declared {String(raw.version_declared)}</span> : null}
      <span className="text-ink-muted">Last observed: {record.observed_at ? <time dateTime={record.observed_at}>{formatDate(record.observed_at)}</time> : "not recorded"}</span>
      {technologies.length > 0 && <span className="text-ink-muted [overflow-wrap:anywhere]">Technologies: {technologies.join(" · ")}</span>}
    </div>
    <div className="type-control flex flex-wrap gap-x-5 gap-y-2">{facts.map((fact) => <a key={fact.hash} href={`#${fact.hash}`} className="min-h-8 text-accent"><strong className="tabular-nums">{fact.count.toLocaleString()}</strong> {fact.label}</a>)}{typeof raw.downloads === "number" && raw.downloads_source && raw.downloads_window ? <span>{raw.downloads.toLocaleString()} downloads · {String(raw.downloads_window)} · {String(raw.downloads_source)}</span> : null}</div>
    <div className="type-body-sm flex flex-wrap items-center gap-x-3 gap-y-1"><Scale className="h-3.5 w-3.5 text-accent" /><span>{String(record.license_expression || raw.license || "License not observed")}</span>{licenseFiles.map((item, index) => <a key={index} href={String(item.url)} target="_blank" rel="noreferrer" className="text-accent underline">{item.kind === "notice-file" ? "Notice" : "License file"}{item.scope === "inherited" ? " (inherited)" : ""}</a>)}</div>
    {evidence.length > 0 && <ul aria-label="Source evidence" className="type-body-sm flex flex-wrap gap-x-3 gap-y-1 [overflow-wrap:anywhere]">{evidence.map((item) => <li key={String(item.url)}><a href={String(item.url)} target="_blank" rel="noreferrer" className="text-accent underline">{humanLabel(String(item.name || item.kind || "Source evidence"))}{item.scope === "inherited" ? " (inherited)" : ""}</a></li>)}</ul>}
  </header>;
}
import { publicationLabel } from "./package-publication";
