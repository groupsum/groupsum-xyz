import { lazy, Suspense, useId, useRef, useState } from "react";
import { Braces, GitBranch, Package } from "lucide-react";
import type { CatalogViewRecord } from "../../types/catalog-view";
const Popover = lazy(() => import("./InspectorPopover"));
const Relationships = lazy(() => import("./PackageRelationships"));

export function PackageDependenciesCell({ record }: { record: CatalogViewRecord }) {
  const id = useId(); const anchor = useRef<HTMLButtonElement>(null); const [open, setOpen] = useState(false);
  const raw = record as Record<string, unknown>; const summary = raw.dependency_summary as { by_scope?: Record<string, number> } | undefined;
  const routeKey = String(raw.route_key || String(record.route || "").split("/").at(-1) || "");
  return <div className="min-w-0"><button ref={anchor} aria-label={`Inspect dependencies of ${record.name}`} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)} className="type-control inline-flex min-h-8 items-center gap-1 text-accent"><GitBranch className="h-3 w-3" />{Number(record.dependency_count || 0).toLocaleString()}</button>{summary?.by_scope && <span className="type-body-sm block truncate text-ink-muted" title={Object.entries(summary.by_scope).map(([scope, count]) => `${scope}: ${count}`).join(" · ")}>{Object.entries(summary.by_scope).slice(0, 2).map(([scope, count]) => { const Icon = scope.toLowerCase().includes("dev") ? Braces : Package; return <span key={scope} className="mr-1 inline-flex items-center gap-0.5" aria-label={`${scope}: ${count}`}><Icon className="h-2.5 w-2.5" />{count}</span>; })}</span>}
    {open && <Suspense fallback={<span role="status">Loading inspector…</span>}><Popover id={id} anchor={anchor} title={`Dependencies of ${record.name}`} onClose={() => setOpen(false)}><Relationships routeKey={routeKey} ecosystem={String(record.ecosystem)} compact /></Popover></Suspense>}
  </div>;
}
