import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function InspectorPopover({ id, anchor, title, onClose, children }: {
  id: string; anchor: RefObject<HTMLElement | null>; title: string; onClose: () => void; children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    panel.current?.showPopover();
    const position = () => {
      const element = panel.current;
      if (!element || !anchor.current) return;
      const rect = anchor.current.getBoundingClientRect();
      const width = Math.min(640, innerWidth - 16);
      element.style.width = `${width}px`;
      element.style.left = `${Math.max(8, Math.min(innerWidth - width - 8, rect.right - width))}px`;
      element.style.top = `${Math.max(8, Math.min(innerHeight - Math.min(element.offsetHeight, innerHeight - 16) - 8, rect.bottom + 6))}px`;
    };
    position();
    const observer = new ResizeObserver(position);
    if (panel.current) observer.observe(panel.current);
    window.addEventListener("resize", position); window.addEventListener("scroll", position, true);
    return () => { observer.disconnect(); window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true); anchor.current?.focus({ preventScroll: true }); };
  }, [anchor]);
  const dismiss = () => { panel.current?.hidePopover(); onClose(); };
  return createPortal(<div id={id} ref={panel} popover="auto" role="dialog" aria-label={title}
    onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); dismiss(); } }}
    onToggle={(event) => { if ((event.nativeEvent as ToggleEvent).newState === "closed") onClose(); }}
    className="fixed m-0 max-h-[calc(100dvh-1rem)] overflow-y-auto overflow-x-hidden border border-[var(--color-border-soft)] bg-surface-raised p-3 text-ink shadow-lg">
    <header className="mb-3 flex items-start justify-between gap-2 border-b border-[var(--color-border-soft)] pb-2"><h2 className="type-heading-sm min-w-0 break-words">{title}</h2><button autoFocus type="button" aria-label={`Close ${title}`} onClick={dismiss} className="min-h-8 min-w-8 shrink-0"><X className="mx-auto h-4 w-4" /></button></header>
    {children}
  </div>, document.body);
}
