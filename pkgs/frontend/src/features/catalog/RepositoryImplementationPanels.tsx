import { Box, Braces, Code2 } from "lucide-react";
import { CatalogLink } from "./CatalogLink";
import { CatalogPill } from "./CatalogVisuals";
import { humanLabel, valueRecords } from "./CatalogRecordShared";
import { publicationLabel } from "./package-publication";

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
  return <section className="space-y-4 " aria-labelledby="repository-languages-title">
    {languages.length > 0 && <div className="space-y-3"><div className="flex flex-wrap items-end justify-between gap-2"><h2 id="repository-languages-title" className="flex min-w-0 items-start gap-2 font-serif text-xl font-bold text-ink [overflow-wrap:anywhere]"><Code2 className="h-4.5 w-4.5 shrink-0 text-accent" />Programming languages</h2><span className="text-[9px] font-mono text-ink-muted">{(total / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} KB analyzed</span></div><div className="flex h-2 overflow-hidden rounded-[2px] bg-[var(--color-surface)]" aria-label="Programming language proportions">{normalized.map((item) => <span key={item.name} style={{ width: `${Math.max(item.percentage, 0.15)}%`, backgroundColor: languageColors[item.name] || "#6B7280" }} title={`${item.name}: ${item.percentage.toFixed(1)}%`} />)}</div><ul className="flex flex-wrap gap-x-4 gap-y-2">{normalized.map((item) => <li key={item.name} className="inline-flex items-center gap-1.5 type-caption text-ink-muted"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: languageColors[item.name] || "#6B7280" }} /><strong className="font-medium text-ink">{item.name}</strong>{item.percentage.toFixed(item.percentage >= 10 ? 1 : 2)}%</li>)}</ul></div>}
    {technologies.length > 0 && <div className={`${languages.length ? "border-t border-[var(--color-border-soft)] pt-4" : ""} space-y-2.5`}><h3 className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wide text-ink"><Braces className="h-3.5 w-3.5 text-signal" />Categorical technologies <span className="font-normal text-ink-muted">separate taxonomy</span></h3><ul className="flex flex-wrap gap-2">{technologies.map((technology) => <li key={technology}><CatalogPill Icon={Box}>{technology}</CatalogPill></li>)}</ul></div>}
  </section>;
}

export function ContainedPackageList({ packagesValue }: { packagesValue: unknown }) {
  const packages = valueRecords(packagesValue);
  if (!packages.length) return <p className="type-body-sm text-ink-muted">No package manifests were observed in this repository.</p>;
  return <table className="w-full table-fixed text-left type-record-table">
    <thead><tr className="text-ink-muted"><th scope="col" className="w-[39%] py-2">Package</th><th scope="col" className="w-[17%] py-2">Registry</th><th scope="col" className="w-[20%] py-2">Version</th><th scope="col" className="py-2">Publication</th></tr></thead>
    <tbody className="divide-y divide-[var(--color-border-soft)]">{packages.map((pkg) => {
      const published = pkg.published || pkg.publication_status === "published";
      const route = String(pkg.route || "");
      return <tr key={String(pkg.id)}>
        <th scope="row" className="py-2 pr-2 font-semibold [overflow-wrap:anywhere]">{route ? <CatalogLink href={route} className="text-accent hover:underline">{String(pkg.name)}</CatalogLink> : String(pkg.name)}</th>
        <td className="py-2 pr-2 [overflow-wrap:anywhere]">{String(pkg.ecosystem || "—")}</td>
        <td className="py-2 pr-2 tabular-nums [overflow-wrap:anywhere]">{String(pkg.latest_version || "—")}</td>
        <td className="py-2">{published ? <CatalogPill tone="signal" compact>Published</CatalogPill> : publicationLabel(pkg.publication_status || pkg.package_kind || "Candidate")}</td>
      </tr>;
    })}</tbody>
  </table>;
}
