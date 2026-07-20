import React from "react";
import { ArrowRight } from "lucide-react";
import { PortfolioEntity } from "../types";

export const CatalogRow: React.FC<{ entity: PortfolioEntity; onNavigate: (path: string) => void }> = ({ entity, onNavigate }) => {
  const evidence = entity.evidence[0]?.kind || "source";
  return <button type="button" onClick={() => onNavigate(`/products/${entity.slug}`)} className="w-full text-left grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1.4fr)_7rem_9rem_8rem_auto] gap-2 lg:gap-4 items-center px-3 py-3 bg-surface border-b border-[var(--color-border-soft)] hover:bg-canvas transition-colors focus-visible:outline-2 focus-visible:outline-accent">
    <span className="min-w-0"><span className="block font-serif font-semibold text-sm text-ink truncate">{entity.displayName}</span><span className="block text-[11px] text-ink-muted truncate">{entity.role || entity.summary}</span></span>
    <span className="text-[10px] font-mono uppercase text-accent">{entity.kind}</span>
    <span className="hidden lg:block text-[10px] font-mono text-ink-muted truncate">{entity.capabilityIds[0] || "catalog"}</span>
    <span className="hidden lg:block text-[10px] font-mono text-ink-muted">{entity.maturity}</span>
    <span className="flex items-center gap-2 text-[10px] font-mono text-ink-muted"><span className="hidden sm:inline">{evidence}</span><ArrowRight className="w-3.5 h-3.5 text-accent" /></span>
  </button>;
};
