import type { AnchorHTMLAttributes } from "react";
import { useNavigate } from "../../router";

/** Preserve native links (new tabs/copy/keyboard), enhance ordinary same-origin clicks. */
export function CatalogLink({ href = "", children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const navigate = useNavigate();
  return <a {...props} href={href} onClick={(event) => {
    props.onClick?.(event);
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && href.startsWith("/") && props.target !== "_blank") {
      event.preventDefault(); navigate(href);
    }
  }}>{children}</a>;
}
