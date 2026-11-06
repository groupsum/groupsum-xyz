import { lazy, Suspense, useId, useRef, useState } from "react";
import { ChevronDown, Package } from "lucide-react";
import type { CatalogViewRecord } from "../../types/catalog-view";
const Panel = lazy(() => import("./RepositoryPackagesPanel"));

export function RepositoryPackagesCell({ record }: { record: CatalogViewRecord }) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const anchor = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [ecosystem, setEcosystem] = useState("");
  const repository = `${record.owner}/${record.name}`;
  const summary = record.package_summary;
  const observedCount = summary?.total ?? record.package_count;
  const count = typeof observedCount === "number" && Number.isFinite(observedCount) ? observedCount : undefined;
  const ecosystems = Object.entries(summary?.ecosystems || {}).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const dismiss = () => { setOpen(false); setEcosystem(""); (anchor.current || trigger.current)?.focus(); };
  return <div className="min-w-0" onClick={(event) => event.stopPropagation()}>
    <button ref={trigger} type="button" onClick={(event) => { anchor.current = event.currentTarget; setOpen(true); }} aria-expanded={open} aria-controls={open ? id : undefined} aria-haspopup="dialog" aria-label={`Inspect packages in ${repository}`} title={`${count === undefined ? "Package count not observed" : `${count.toLocaleString()} packages`}; inspect packages`} className="type-control inline-flex max-w-full items-center gap-1 text-accent hover:underline">
      <Package className="h-3 w-3 shrink-0" aria-hidden="true" /><span className="truncate tabular-nums">{count === undefined ? "—" : count.toLocaleString()}</span><ChevronDown className="h-3 w-3 shrink-0" aria-hidden="true" />
    </button>
    <div className="hidden flex-wrap gap-x-1 lg:flex">{ecosystems.slice(0, 2).map(([name, total]) => <button key={name} type="button" title={`${name}: ${total.toLocaleString()} packages`} onClick={(event) => { anchor.current = event.currentTarget; setEcosystem(name); setOpen(true); }} className="max-w-full truncate text-[10px] text-ink-muted hover:text-accent hover:underline" aria-label={`Inspect ${name} packages in ${repository}`}>{name} {total.toLocaleString()}</button>)}</div>
    {open && <Suspense fallback={<span role="status" className="sr-only">Loading package inspector…</span>}><Panel id={id} anchor={anchor} repository={repository} ecosystem={ecosystem} onEcosystem={setEcosystem} summary={summary} onClose={dismiss} /></Suspense>}
  </div>;
}
