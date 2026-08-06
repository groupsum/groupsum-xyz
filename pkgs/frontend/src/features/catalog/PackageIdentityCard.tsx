import { BadgeCheck, CircleDot, ExternalLink, GitBranch, Package } from "lucide-react";
import { CatalogPill } from "./CatalogVisuals";
import {
  humanLabel,
  recordDescription,
  recordTitle,
  valueRecords,
  type CatalogRecord,
} from "./CatalogRecordShared";

export function PackageIdentityCard({
  record,
  primaryUrl,
  onNavigate,
}: {
  record: CatalogRecord;
  primaryUrl?: unknown;
  onNavigate: (path: string) => void;
}) {
  const rawRecord = record as unknown as Record<string, unknown>;
  const repository = valueRecords(record.repositories)[0] || {};
  const owner = String(repository.owner || "").trim();
  const name = String(repository.name || "").trim();
  const repositoryLabel = owner && name ? `${owner}/${name}` : String(record.repository || "Repository not linked");
  const repositoryRoute = String(repository.route || record.repository_route || (owner && name ? `/catalog/repositories/${owner}/${name}` : ""));
  const manifestPath = String(repository.path || rawRecord.manifest_path || "Not recorded");
  const published = record.published || record.publication_status === "published";
  const externalUrl = typeof primaryUrl === "string" ? primaryUrl : undefined;
  const dependencyCount = valueRecords(record.dependencies).length || Number(record.dependency_count || 0);
  const dependentCount = valueRecords(record.dependents).length || Number(record.downstream_count || record.dependent_count || 0);

  const facts = [
    ["Latest version", String(record.latest_version || "Not recorded")],
    ["Package kind", humanLabel(String(record.package_kind || "Package candidate"))],
    ["Declared dependencies", `${dependencyCount.toLocaleString()} deps`],
    ["Observed dependents", dependentCount.toLocaleString()],
  ];

  return <header className="space-y-5 rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div className="flex min-w-0 flex-[1_1_36rem] items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[4px] border border-amber-300 bg-amber-50 text-orange-700"><Package className="h-7 w-7" aria-hidden="true" /></div>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CatalogPill tone="signal">{humanLabel(String(record.ecosystem || "unknown"))} package member</CatalogPill>
            <CatalogPill tone={published ? "accent" : "neutral"} Icon={published ? BadgeCheck : CircleDot}>{published ? "Published" : humanLabel(String(record.publication_status || "Candidate"))}</CatalogPill>
          </div>
          <h1 className="break-words font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">{recordTitle(record)}</h1>
          <p className="max-w-4xl text-xs leading-relaxed text-ink-muted sm:text-sm">{recordDescription(record)}</p>
        </div>
      </div>
      {externalUrl && <a href={externalUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1.5 rounded-[4px] bg-ink px-4 text-xs font-mono font-semibold text-white hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{published && record.registry_url ? "Registry page" : "Source manifest"}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>}
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[var(--color-border-soft)] bg-canvas px-3 py-2.5 text-xs font-mono">
      <div className="flex min-w-0 items-center gap-2"><GitBranch className="h-4 w-4 shrink-0 text-violet-700" aria-hidden="true" /><span>Owning repository: {repositoryRoute.startsWith("/") ? <a href={repositoryRoute} onClick={(event) => { event.preventDefault(); onNavigate(repositoryRoute); }} className="break-words font-bold text-ink hover:text-accent hover:underline">{repositoryLabel}</a> : <strong className="text-ink">{repositoryLabel}</strong>}</span></div>
      <div className="min-w-0 text-ink-muted">Manifest path: <code className="ml-1 break-all rounded-[3px] border border-[var(--color-border-soft)] bg-white px-2 py-1 font-semibold text-ink">{manifestPath}</code></div>
    </div>

    <dl className="grid grid-cols-2 gap-3 border-t border-[var(--color-border-soft)] pt-2 font-mono text-xs sm:grid-cols-4">
      {facts.map(([label, value], index) => <div key={label} className="rounded-[4px] border border-[var(--color-border-soft)] bg-canvas p-3"><dt className="text-[11px] text-ink-muted">{label}</dt><dd className={`mt-1 font-bold ${index === 3 ? "text-accent" : "text-ink"}`}>{value}</dd></div>)}
    </dl>
  </header>;
}
