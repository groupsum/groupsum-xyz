import { useEffect } from "react";
import { buildPageJsonLd, SITE_ROOT } from "../../discovery/page-jsonld.mjs";

/** Client navigation mirrors the static page metadata; SSG remains crawler authority. */
export function CatalogPageMetadata({ record }: { record: Record<string, unknown> & { route: string; title: string; description: string } }) {
  useEffect(() => {
    const url = `${SITE_ROOT}${record.route.replace(/\/$/, "")}/`;
    document.title = record.title;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') || document.head.appendChild(Object.assign(document.createElement("link"), { rel: "canonical" }));
    canonical.href = url;
    for (const [name, content] of Object.entries({ description: record.description, "og:title": record.title, "og:description": record.description, "og:url": url, "og:type": record.schemaFamily === "contributor-profile" ? "profile" : "website", "twitter:title": record.title, "twitter:description": record.description })) {
      const attribute = name.startsWith("og:") ? "property" : "name";
      const meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`) || document.head.appendChild(document.createElement("meta"));
      meta.setAttribute(attribute, name); meta.content = content;
    }
    const script = document.getElementById("groupsum-page-jsonld") || document.head.appendChild(Object.assign(document.createElement("script"), { id: "groupsum-page-jsonld", type: "application/ld+json" }));
    script.textContent = JSON.stringify(buildPageJsonLd({ ...record, url })).replace(/</g, "\\u003c");
  }, [record]);
  return null;
}
