import React from "react";
import { Layers } from "lucide-react";
import { PortfolioEntity } from "../types";
import { CatalogRow } from "./CatalogRow";

export const CatalogGroup: React.FC<{ title: string; entities: PortfolioEntity[]; onNavigate: (path: string) => void }> = ({ title, entities, onNavigate }) => entities.length ? <section className="space-y-2"><div className="flex items-center justify-between"><h2 className="inline-flex items-center gap-2 font-serif text-xl font-bold text-ink"><Layers className="w-4 h-4 text-accent" /> {title}</h2><span className="text-[10px] font-mono text-ink-muted">{entities.length}</span></div><div className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-soft)]"><div className="hidden lg:grid grid-cols-[minmax(0,1.4fr)_7rem_9rem_8rem_auto] gap-4 px-3 py-2 bg-canvas text-[9px] font-mono uppercase tracking-wider text-ink-muted"><span>Name</span><span>Type</span><span>Capability</span><span>Maturity</span><span /></div>{entities.map((entity) => <CatalogRow key={entity.id} entity={entity} onNavigate={onNavigate} />)}</div></section> : null;
