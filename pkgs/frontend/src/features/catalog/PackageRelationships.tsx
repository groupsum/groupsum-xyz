import { useEffect, useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Braces, CircleDot, Package, Users, Boxes } from "lucide-react";
import { getPackageRelationships, type PackageRelationship } from "../../api/catalog";
import { CatalogLink } from "./CatalogLink";
import { useCatalogVersion } from "../../api/catalog-version";

function requirementDetails(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value !== "string" || !value.trim()) return {};
  try { const parsed = JSON.parse(value); if (parsed && typeof parsed === "object") return parsed; } catch { /* Legacy Cargo maps may be Python repr. */ }
  const version = value.match(/["']version["']\s*:\s*["']([^"']+)["']/)?.[1];
  return version ? { version, source: value } : { constraint: value };
}

function RelationshipRow({ item, ecosystem }: { item: PackageRelationship; ecosystem: string }) {
  const details = requirementDetails(item.requirement);
  const primary = details.version ?? details.constraint ?? details.git ?? details.path ?? "—";
  const scope = item.scope.toLowerCase();
  const Icon = scope.includes("dev") || scope.includes("test") ? Braces : scope.includes("peer") ? Users : scope.includes("build") ? Boxes : Package;
  const scopeLabel = scope.includes("dev") || scope.includes("test") ? "Development dependency" : scope.includes("peer") ? "Peer dependency" : scope.includes("build") ? "Build dependency" : "Runtime dependency";
  const StateIcon = item.optional ? CircleDot : BadgeCheck;
  return <tr className="align-top hover:bg-canvas"><th scope="row" className="min-w-0 py-2 pr-2 text-left font-semibold">
    {item.package ? <CatalogLink href={item.package.route} className="block truncate text-accent" title={item.name}>{item.name}</CatalogLink> : <span className="block truncate" title={item.name}>{item.name}</span>}
    {item.ecosystem !== ecosystem && <span className="type-body-sm text-ink-muted">{item.ecosystem}</span>}
    {item.resolution === "ambiguous" ? <details><summary className="type-body-sm cursor-pointer text-accent">Choose catalog package ({item.candidates.length})</summary><ul className="space-y-1 py-1">{item.candidates.map((candidate) => <li key={candidate.id}><CatalogLink href={candidate.route} className="type-body-sm block break-words text-accent">{candidate.repository || candidate.name} · {candidate.id}</CatalogLink></li>)}</ul></details> : item.resolution !== "resolved" && <span className="type-body-sm text-ink-muted">{item.resolution === "external" ? "External requirement" : "Catalog target not resolved"}</span>}
  </th><td className="py-2"><div className="flex justify-center gap-1"><span title={`${scopeLabel} (${item.scope})`} aria-label={`${scopeLabel} (${item.scope})`}><Icon className="h-3.5 w-3.5 text-accent" /></span><span title={item.optional ? "Optional requirement" : "Required dependency"} aria-label={item.optional ? "Optional requirement" : "Required dependency"}><StateIcon className="h-3.5 w-3.5 text-ink-muted" /></span></div></td>
    <td className="py-2 pl-2"><details><summary className="cursor-pointer break-words font-semibold" title="Inspect declared requirement and evidence">{String(primary)}</summary><dl className="type-body-sm space-y-1 py-1">{Object.entries({ scope: item.scope, optional: item.optional, ...details, evidence: item.evidence || "Source declaration", completeness: item.completeness || "catalog-observed" }).map(([key, value]) => <div key={key} className="break-words"><dt className="text-ink-muted">{key}</dt><dd>{typeof value === "object" ? JSON.stringify(value) : String(value)}</dd></div>)}</dl></details></td>
  </tr>;
}

export default function PackageRelationships({ routeKey, ecosystem, initialDirection = "dependency", compact = false }: {
  routeKey: string; ecosystem: string; initialDirection?: "dependency" | "dependent"; compact?: boolean;
}) {
  const id = useId();
  const version = useCatalogVersion();
  const [direction, setDirection] = useState(initialDirection);
  const [search, setSearch] = useState(""); const [query, setQuery] = useState("");
  const [scope, setScope] = useState(""); const [optional, setOptional] = useState(""); const [resolution, setResolution] = useState(""); const [page, setPage] = useState(1);
  useEffect(() => { if (search.trim() === query) return; const timer = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 250); return () => clearTimeout(timer); }, [search, query]);
  useEffect(() => { if (compact) return; const sync = () => { if (["#dependencies", "#dependents"].includes(location.hash)) { setDirection(location.hash === "#dependents" ? "dependent" : "dependency"); setPage(1); document.getElementById(location.hash === "#dependents" ? "dependents" : "dependencies")?.focus({ preventScroll: true }); } }; sync(); window.addEventListener("hashchange", sync); return () => window.removeEventListener("hashchange", sync); }, [compact, routeKey]);
  const params = { direction, q: query, scope, optional, resolution, page, page_size: compact ? 10 : 25 };
  const collection = useQuery({ queryKey: ["package-relationships", routeKey, params, version.snapshot_id], queryFn: ({ signal }) => getPackageRelationships(routeKey, params, signal), placeholderData: (previous) => previous, staleTime: version.public_projection_available ? Infinity : 60_000, retry: false });
  const tab = (value: typeof direction) => { setDirection(value); setPage(1); setScope(""); setOptional(""); setResolution(""); if (!compact) history.replaceState({}, "", `${location.pathname}${location.search}#${value === "dependency" ? "dependencies" : "dependents"}`); };
  const pagination = (placement: string) => { const data = collection.data; return data ? <nav aria-label={`Relationship pagination ${placement}`} className="flex justify-end gap-3"><button className="type-control min-h-8 disabled:opacity-40" disabled={data.page <= 1 || collection.isFetching} onClick={() => setPage(data.page - 1)}>Previous</button><button className="type-control min-h-8 disabled:opacity-40" disabled={data.page >= data.page_count || collection.isFetching} onClick={() => setPage(data.page + 1)}>Next</button></nav> : null; };
  const control = "min-h-8 min-w-0 w-full border border-[var(--color-border-soft)] bg-surface px-1 text-ink";
  return <div className="min-w-0 space-y-3" aria-busy={collection.isFetching}>
    <div role="tablist" aria-label="Package relationships" className="flex flex-wrap gap-3 border-b border-[var(--color-border-soft)]">{(["dependency", "dependent"] as const).map((value) => <button key={value} id={compact ? `${id}-${value}` : value === "dependency" ? "dependencies" : "dependents"} role="tab" aria-selected={direction === value} aria-controls={`${id}-panel`} tabIndex={direction === value ? 0 : -1} onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); const next = event.key === "Home" ? "dependency" : event.key === "End" ? "dependent" : direction === "dependency" ? "dependent" : "dependency"; tab(next); document.getElementById(compact ? `${id}-${next}` : next === "dependency" ? "dependencies" : "dependents")?.focus(); } }} onClick={() => tab(value)} className={`type-control min-h-9 border-b-2 ${direction === value ? "border-accent text-accent" : "border-transparent text-ink-muted"}`}>{value === "dependency" ? "Dependencies" : "Dependents"} {collection.data ? `(${value === "dependency" ? collection.data.dependency_count : collection.data.dependent_count})` : ""}</button>)}</div>
    <div className="grid min-w-0 grid-cols-2 gap-2 [overflow-wrap:anywhere] sm:grid-cols-4"><label className="type-body-sm col-span-2 sm:col-span-4">Search relationships<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} className={control} /></label>
      <label className="type-body-sm">Scope<select value={scope} onChange={(event) => { setScope(event.target.value); setPage(1); }} className={control}><option value="">All scopes</option>{Object.keys(collection.data?.facets.scope || {}).map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="type-body-sm">Requirement<select value={optional} onChange={(event) => { setOptional(event.target.value); setPage(1); }} className={control}><option value="">All requirements</option><option value="false">Required</option><option value="true">Optional</option></select></label>
      <label className="type-body-sm col-span-2">Catalog target<select value={resolution} onChange={(event) => { setResolution(event.target.value); setPage(1); }} className={control}><option value="">All targets</option><option value="resolved">Catalog packages</option><option value="ambiguous">Multiple matches</option><option value="external">External</option><option value="unresolved">Unresolved</option></select></label>
    </div>
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={compact ? `${id}-${direction}` : direction === "dependency" ? "dependencies" : "dependents"}>
      {collection.isPending && <p role="status" className="type-body-sm py-3">Loading relationships…</p>}
      {collection.isError && <p role="alert" className="type-body-sm py-3">Relationships could not be loaded. <button onClick={() => collection.refetch()} className="text-accent underline">Retry</button></p>}
      {collection.data && <><div className="flex flex-wrap items-center justify-between gap-2"><p role="status" className="type-body-sm text-ink-muted">{collection.data.count} matching relationships · Page {collection.data.page} of {collection.data.page_count}</p>{pagination("top")}</div><table className="type-technical w-full table-fixed text-left [overflow-wrap:anywhere]" aria-label={`${direction === "dependency" ? "Dependencies" : "Dependents"} for package`}><colgroup><col /><col className="w-12" /><col className="w-[35%]" /></colgroup><thead className="type-ui-label border-b border-[var(--color-border-soft)]"><tr><th className="py-2">Package</th><th><span className="sr-only">Relationship semantics</span></th><th className="pl-2">Requirement</th></tr></thead><tbody className="divide-y divide-[var(--color-border-soft)]">{collection.data.records.map((item) => <RelationshipRow key={item.id} item={item} ecosystem={ecosystem} />)}</tbody></table>{!collection.data.records.length && <p className="type-body-sm py-3">No relationships match this view.</p>}{pagination("bottom")}<p className="type-body-sm text-ink-muted">{collection.data.coverage}</p></>}
    </div>
  </div>;
}
