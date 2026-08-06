import React from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { EntityGraph, EntityRelationship } from "../../api/catalog.generated";

type Navigate = (path: string) => void;

export function humanEntityLabel(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function RelationLink({ relationship, onNavigate }: { relationship: EntityRelationship; onNavigate: Navigate }) {
  const route = relationship.route || relationship.canonical_url;
  return <li className="py-3 sm:grid sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:gap-5 sm:items-baseline">
    <span className="text-[10px] font-mono uppercase tracking-wide text-ink-muted">{humanEntityLabel(relationship.relationship_type)}</span>
    <div className="min-w-0 mt-1 sm:mt-0"><span className="text-[10px] font-mono uppercase text-accent">{relationship.type_label}</span><p className="font-medium text-sm text-ink break-words">{relationship.name}</p>{relationship.role && <p className="text-xs text-ink-muted mt-0.5">Role: {humanEntityLabel(relationship.role)}</p>}</div>
    {route && (route.startsWith("/") ? <a href={route} onClick={(event) => { event.preventDefault(); onNavigate(route); }} className="mt-2 sm:mt-0 text-xs font-mono text-accent hover:underline inline-flex items-center gap-1">Open record <ArrowRight className="w-3.5 h-3.5" /></a> : <a href={route} target="_blank" rel="noreferrer" className="mt-2 sm:mt-0 text-xs font-mono text-accent hover:underline inline-flex items-center gap-1">Open source <ExternalLink className="w-3.5 h-3.5" /></a>)}
  </li>;
}

export function EntityOwnership({ graph, onNavigate }: { graph?: EntityGraph | null; onNavigate: Navigate }) {
  const owner = graph?.owner;
  if (!owner) return null;
  const route = owner.route || owner.canonical_url;
  return <section aria-label="Organization ownership" className="border-y border-[var(--color-border-soft)] py-4"><p className="text-[10px] font-mono uppercase tracking-wide text-ink-muted">Organization owner</p><div className="flex items-baseline justify-between gap-4 mt-1"><div><p className="font-serif text-lg font-bold text-ink">{owner.name}</p><p className="text-xs text-ink-muted">Organization metadata is separate from this {graph?.entity.type_label.toLowerCase()} record.</p></div>{route && <a href={route} onClick={(event) => { if (route.startsWith("/")) { event.preventDefault(); onNavigate(route); } }} className="text-xs font-mono text-accent hover:underline shrink-0">Organization record</a>}</div></section>;
}

export function EntityRelationshipRows({ graph, onNavigate, exclude = [] }: { graph?: EntityGraph | null; onNavigate: Navigate; exclude?: string[] }) {
  const excluded = new Set(["owned_by", ...exclude]);
  const relationships = (graph?.relationships || []).filter((item) => !excluded.has(item.relationship_type));
  if (!relationships.length) return <p className="text-sm text-ink-muted">No typed catalog relationships are attached to this record.</p>;
  return <ul className="border-y border-[var(--color-border-soft)] divide-y divide-[var(--color-border-soft)]">{relationships.map((relationship) => <RelationLink key={relationship.id} relationship={relationship} onNavigate={onNavigate} />)}</ul>;
}
