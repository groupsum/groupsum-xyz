import { useRef, type AnchorHTMLAttributes } from "react";
import { useNavigate } from "../../router";

/** Preserve native links (new tabs/copy/keyboard), enhance ordinary same-origin clicks. */
export function CatalogLink({ href = "", children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const navigate = useNavigate();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const warm = () => {
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    clearTimeout(timer.current); timer.current = setTimeout(() => { void import("../../api/prefetch").then(({ prefetchCatalogPath }) => prefetchCatalogPath(href)); }, 120);
  };
  return <a {...props} href={href} onPointerEnter={(event) => { props.onPointerEnter?.(event); warm(); }} onPointerLeave={(event) => { props.onPointerLeave?.(event); clearTimeout(timer.current); }} onFocus={(event) => { props.onFocus?.(event); warm(); }} onBlur={(event) => { props.onBlur?.(event); clearTimeout(timer.current); }} onClick={(event) => {
    props.onClick?.(event);
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && href.startsWith("/") && props.target !== "_blank") {
      event.preventDefault(); navigate(href);
    }
  }}>{children}</a>;
}
