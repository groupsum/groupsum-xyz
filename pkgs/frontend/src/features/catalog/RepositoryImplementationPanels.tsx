import React from "react";
import { ArrowRight, BadgeCheck, Box, Braces, Code2, Package } from "lucide-react";
import { CatalogPill } from "./CatalogVisuals";
import { humanLabel, valueRecords } from "./CatalogRecordShared";

const languageColors: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Rust: "#DEA584",
  C: "#555555",
  "C++": "#F34B7D",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Dockerfile: "#384D54",
  Jinja: "#A52A22",
  Meson: "#007800",
};

type Language = { name: string; bytes: number; percentage: number };

export function RepositoryLanguagePanel({ languagesValue, technologiesValue }: { languagesValue: unknown; technologiesValue: unknown }) {
  const languages: Language[] = valueRecords(languagesValue)
    .map((item) => ({ name: String(item.name || item.language || "Unknown"), bytes: Number(item.bytes || 0), percentage: Number(item.percentage || 0) }))
    .filter((item) => item.bytes > 0)
    .sort((left, right) => right.bytes - left.bytes);
  const technologies = Array.isArray(technologiesValue) ? technologiesValue.map(String).filter(Boolean) : [];
  if (!languages.length && !technologies.length) return null;
  const total = languages.reduce((sum, item) => sum + item.bytes, 0);
  const normalized = languages.map((item) => ({ ...item, percentage: total ? item.bytes * 100 / total : item.percentage }));
  return <section className="space-y-4 rounded-[4px] border border-[var(--color-border-soft)] bg-white p-4 sm:p-5" aria-labelledby="repository-languages-title">
    {languages.length > 0 && <div className="space-y-3"><div className="flex flex-wrap items-end justify-between gap-2"><h2 id="repository-languages-title" className="flex items-center gap-2 font-serif text-xl font-bold text-ink"><Code2 className="h-4.5 w-4.5 text-sky-600" />Programming languages</h2><span className="text-[9px] font-mono text-ink-muted">{(total / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} KB analyzed</span></div><div className="flex h-2 overflow-hidden rounded-[2px] bg-[var(--color-surface)]" aria-label="Programming language proportions">{normalized.map((item) => <span key={item.name} style={{ width: `${Math.max(item.percentage, 0.15)}%`, backgroundColor: languageColors[item.name] || "#6B7280" }} title={`${item.name}: ${item.percentage.toFixed(1)}%`} />)}</div><ul className="flex flex-wrap gap-x-4 gap-y-2">{normalized.map((item) => <li key={item.name} className="inline-flex items-center gap-1.5 text-[10px] font-mono text-ink-muted"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: languageColors[item.name] || "#6B7280" }} /><strong className="font-medium text-ink">{item.name}</strong>{item.percentage.toFixed(item.percentage >= 10 ? 1 : 2)}%</li>)}</ul></div>}
    {technologies.length > 0 && <div className={`${languages.length ? "border-t border-[var(--color-border-soft)] pt-4" : ""} space-y-2.5`}><h3 className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wide text-ink"><Braces className="h-3.5 w-3.5 text-orange-600" />Categorical technologies <span className="font-normal text-ink-muted">separate taxonomy</span></h3><ul className="flex flex-wrap gap-2">{technologies.map((technology) => <li key={technology}><CatalogPill Icon={Box}>{technology}</CatalogPill></li>)}</ul></div>}
  </section>;
}

export function ContainedPackageList({ packagesValue, onNavigate }: { packagesValue: unknown; onNavigate: (path: string) => void }) {
  const packages = valueRecords(packagesValue);
  if (!packages.length) return <p className="text-sm text-ink-muted">No package manifests were observed in this repository.</p>;
  return <ul className="grid gap-2.5">{packages.map((pkg) => {
    const published = pkg.published || pkg.publication_status === "published";
    const route = String(pkg.route || "");
    return <li key={String(pkg.id)} className="rounded-[4px] border border-[var(--color-border-soft)] bg-[var(--color-surface-raised)] px-3 py-3 sm:px-4">
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 flex-[1_1_24rem] items-start gap-2.5"><Package className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="break-all text-xs text-ink">{String(pkg.name)}</strong><span className="rounded-[3px] border border-[var(--color-border-soft)] bg-white px-1.5 py-0.5 text-[9px] font-mono text-ink-muted">{String(pkg.ecosystem || "package")}</span></div><p className="mt-1 break-all text-[10px] font-mono text-ink-muted">Manifest: <span className="text-ink">{String(pkg.manifest_path || "Not recorded")}</span></p></div></div><CatalogPill tone={published ? "accent" : "neutral"} Icon={published ? BadgeCheck : Box}>{published ? "Published" : humanLabel(String(pkg.publication_status || pkg.package_kind || "Candidate"))}</CatalogPill></div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-[var(--color-border-soft)] pt-2.5"><dl className="flex flex-wrap gap-x-6 gap-y-2 text-[9px] font-mono uppercase tracking-wide text-ink-muted"><div><dt>Version</dt><dd className="mt-0.5 text-[11px] font-semibold normal-case text-ink">{String(pkg.latest_version || "Not recorded")}</dd></div><div><dt>Dependencies</dt><dd className="mt-0.5 text-[11px] font-semibold normal-case text-ink">{Number(pkg.dependency_count || 0).toLocaleString()}</dd></div><div><dt>Releases</dt><dd className="mt-0.5 text-[11px] font-semibold normal-case text-ink">{Number(pkg.release_count || 0).toLocaleString()}</dd></div><div><dt>License</dt><dd className="mt-0.5 text-[11px] font-semibold normal-case text-ink">{pkg.license_url ? <a href={String(pkg.license_url)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{String(pkg.license_expression || "Observed license")}</a> : String(pkg.license_expression || "Not observed")}{Number(pkg.notice_count || 0) > 0 ? ` · ${Number(pkg.notice_count).toLocaleString()} notice${Number(pkg.notice_count) === 1 ? "" : "s"}` : ""}</dd></div></dl>{route && <a href={route} onClick={(event) => { event.preventDefault(); onNavigate(route); }} className="inline-flex min-h-9 items-center gap-1 text-[10px] font-mono font-semibold text-accent hover:underline">Inspect package <ArrowRight className="h-3.5 w-3.5" /></a>}</div>
    </li>;
  })}</ul>;
}
