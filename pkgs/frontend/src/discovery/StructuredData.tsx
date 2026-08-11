import { useEffect, useMemo } from "react";
import { buildPageJsonLd, SITE_ROOT } from "./page-jsonld.mjs";

interface StructuredDataProps {
  type: "organization" | "portfolio" | "blog" | "solutions" | "about" | "profile";
  data?: object;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const graph = useMemo(() => {
    const pageData = (data || {}) as Record<string, unknown>;
    const slug = String(pageData.slug || "");
    const route = type === "blog" ? `/insights/${slug}/` : type === "portfolio" ? `/portfolio/${slug}/` : type === "profile" ? `/${slug}/` : type === "solutions" ? "/solutions/" : type === "about" ? "/about/" : "/";
    const title = String(pageData.title || pageData.name || pageData.displayName || (type === "about" ? "About | GroupSum" : "GroupSum"));
    const description = String(pageData.description || pageData.summary || pageData.excerpt || "Groupsum builds structured software, platforms, and services for teams that need clear decisions.");
    return buildPageJsonLd({ ...pageData, route, url: `${SITE_ROOT}${route}`, title, description, type: type === "blog" ? "article" : "website", ...(type === "profile" ? { schemaFamily: "contributor-profile", profileUrl: pageData.url } : {}) });
  }, [data, type]);

  useEffect(() => {
    let script = document.querySelector<HTMLScriptElement>("#groupsum-page-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "groupsum-page-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(graph).replace(/</g, "\\u003c");
  }, [graph]);

  return null;
}
