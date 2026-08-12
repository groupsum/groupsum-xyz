import { ArrowRight } from "lucide-react";
import type { ResourceTypeDescriptor } from "../../api/catalog";
import { humanLabel, resourceIcon } from "./CatalogRecordShared";

export function ResourceTypeDirectory({
  descriptors,
  selectedType,
  onSelect,
}: {
  descriptors: ResourceTypeDescriptor[];
  selectedType: string;
  onSelect: (resourceType: string) => void;
}) {
  const families = descriptors.reduce<Map<string, ResourceTypeDescriptor[]>>((groups, descriptor) => {
    groups.set(descriptor.family, [...(groups.get(descriptor.family) || []), descriptor]);
    return groups;
  }, new Map());

  return <section aria-labelledby="resource-type-directory-title" className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--color-border-soft)] pb-4">
      <div className="max-w-3xl">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Table-backed type registry</p>
        <h2 id="resource-type-directory-title" className="mt-1 font-serif text-2xl font-bold tracking-tight text-ink">Resource type directory</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">Every card represents one registered Tigrbl resource table. Counts describe records in the current finalized snapshot.</p>
      </div>
      <p className="font-mono text-xs text-ink-muted">{descriptors.length.toLocaleString()} registered types</p>
    </div>
    {[...families].map(([family, members]) => (
      <section key={family} aria-labelledby={`resource-family-${family}`} className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 id={`resource-family-${family}`} className="font-serif text-lg font-bold text-ink">{humanLabel(family)}</h3>
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">{members.length} {members.length === 1 ? "type" : "types"}</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {members.map((descriptor) => <ResourceTypeCard key={descriptor.resource_type} descriptor={descriptor} selected={selectedType === descriptor.resource_type} onSelect={onSelect} />)}
        </div>
      </section>
    ))}
  </section>;
}

function ResourceTypeCard({
  descriptor,
  selected,
  onSelect,
}: {
  descriptor: ResourceTypeDescriptor;
  selected: boolean;
  onSelect: (resourceType: string) => void;
}) {
  const Icon = resourceIcon(descriptor.resource_type);
  const content = <>
    <div className="flex items-start justify-between gap-3">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border ${selected ? "border-white/30 bg-white/15 text-white" : descriptor.populated ? "border-sky-200 bg-sky-50 text-sky-800" : "border-[var(--color-border-soft)] bg-surface text-ink-muted"}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
      <strong className={`rounded-full border px-2.5 py-1 font-mono text-sm tabular-nums ${selected ? "border-white/30 text-white" : "border-[var(--color-border-soft)] bg-surface text-ink"}`}>{descriptor.count.toLocaleString()}</strong>
    </div>
    <div className="min-w-0">
      <h4 className={`text-sm font-semibold leading-snug ${selected ? "text-white" : "text-ink"}`}>{descriptor.label}</h4>
      <p className={`mt-1 break-all font-mono text-[10px] leading-relaxed ${selected ? "text-white/75" : "text-ink-muted"}`}>{descriptor.resource_type}</p>
    </div>
    <span className={`mt-auto flex items-center justify-between border-t pt-2 font-mono text-[10px] font-semibold ${selected ? "border-white/20 text-white" : descriptor.populated ? "border-[var(--color-border-soft)] text-accent" : "border-[var(--color-border-soft)] text-ink-muted"}`}>
      {descriptor.populated ? "Browse records" : "No records in current snapshot"}
      {descriptor.populated && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
    </span>
  </>;
  const classes = `flex min-h-40 min-w-0 flex-col gap-3 rounded-xl border p-4 text-left transition-colors ${selected ? "border-accent bg-accent" : descriptor.populated ? "border-[var(--color-border-soft)] bg-white hover:border-accent hover:bg-canvas" : "border-[var(--color-border-soft)] bg-surface/60"}`;

  if (!descriptor.populated) return <article className={classes}>{content}</article>;
  const href = `/catalog/resources/?resource_type=${encodeURIComponent(descriptor.resource_type)}`;
  return <a href={href} aria-current={selected ? "true" : undefined} onClick={(event) => { event.preventDefault(); onSelect(descriptor.resource_type); }} className={`${classes} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`}>{content}</a>;
}
