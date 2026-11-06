import { useLayoutEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { CatalogViewRecord } from "../../types/catalog-view";
import { RepositoryPackagesInspector } from "./RepositoryPackagesInspector";

export default function RepositoryPackagesPanel({ id, anchor, repository, ecosystem, onEcosystem, summary, onClose }: {
  id: string; anchor: RefObject<HTMLButtonElement | null>; repository: string; ecosystem: string;
  onEcosystem: (value: string) => void; summary?: CatalogViewRecord["package_summary"]; onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    panel.current?.showPopover();
    const position = () => {
      const element = panel.current;
      if (!element || !anchor.current) return;
      const rect = anchor.current.getBoundingClientRect();
      const width = Math.min(560, innerWidth - 16);
      const height = Math.min(element.offsetHeight, innerHeight - 16);
      element.style.width = `${width}px`;
      element.style.left = `${Math.max(8, Math.min(innerWidth - width - 8, rect.right - width))}px`;
      element.style.top = `${Math.max(8, Math.min(innerHeight - height - 8, rect.bottom + 6))}px`;
    };
    position();
    const observer = new ResizeObserver(position);
    if (panel.current) observer.observe(panel.current);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => { observer.disconnect(); window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true); };
  }, [anchor]);
  const dismiss = () => { panel.current?.hidePopover(); onClose(); };
  return createPortal(<div ref={panel} id={id} popover="auto" role="dialog" aria-label={`Packages in ${repository}`} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); dismiss(); } }} onToggle={(event) => {
    if ((event.nativeEvent as ToggleEvent).newState === "closed") onClose();
  }} className="package-inspector fixed m-0 max-h-[calc(100dvh-1rem)] overflow-y-auto border border-[var(--color-border-soft)] bg-surface-raised p-3 text-ink shadow-lg">
    <header className="mb-3 flex items-start justify-between gap-2 border-b border-[var(--color-border-soft)] pb-2"><div className="min-w-0"><h2 className="type-heading-sm">Repository packages</h2><p className="type-technical break-all text-ink-muted">{repository}</p></div><button type="button" onClick={dismiss} aria-label="Close package inspector" className="min-h-8 min-w-8 text-ink-muted"><X className="mx-auto h-4 w-4" /></button></header>
    <RepositoryPackagesInspector repository={repository} ecosystem={ecosystem} onEcosystem={onEcosystem} summary={summary} />
  </div>, document.body);
}
