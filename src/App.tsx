import { LanderPage } from "@mdwrk/lander-react";
import siteContent from "../packages/site-content-pack/src/index";

const root = siteContent.product.canonicalUrl.replace(/\/+$/, "");
const normalizePath = (value: string) => {
  const path = value === "" ? "/" : value.split(/[?#]/)[0] ?? "/";
  if (path === "/" || path === "") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
};
function wordCount(value: string) { return value.trim().split(/\s+/).filter(Boolean).length; }
function titleCase(value: string) { return value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()); }
function breadcrumbs(slug: string, h1: string) {
  const segments = normalizePath(slug).split("/").filter(Boolean);
  const items = [{ label: siteContent.product.name, href: "/" }];
  let href = "";
  for (const segment of segments) {
    href = `${href}/${segment}`;
    items.push({ label: titleCase(segment), href: `${href}/` });
  }
  if (items.length > 1) items[items.length - 1] = { label: h1, href: normalizePath(slug) };
  return items;
}
function compilePage(page: (typeof siteContent.pages)[number]) {
  const path = normalizePath(page.slug);
  return { ...page, path, canonicalUrl: `${root}${path}`, breadcrumbs: breadcrumbs(page.slug, page.h1), internalLinks: [], wordCount: wordCount([page.title, page.description, page.intro, JSON.stringify(page.sections)].join(" ")), componentIntents: [], schemaIntents: [] };
}
function currentPage() {
  const browserPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const path = normalizePath(browserPath);
  return compilePage(siteContent.pages.find((candidate) => normalizePath(candidate.slug) === path) ?? siteContent.pages[0]);
}
export function App() {
  const page = currentPage();
  const compiledSite = { ...siteContent, pages: [page], pageByPath: new Map([[page.path, page]]), diagnostics: [] };
  return (
    <div className="site-shell" style={{ ["--accent" as string]: "#246BFE" }}>
      <header className="site-header">
        <a className="site-brand" href="/" aria-label={`${siteContent.product.name} home`}>
          <span className="site-brand-mark" aria-hidden="true">GS</span>
          <span><strong>{siteContent.product.name}</strong><small>{siteContent.product.tagline}</small></span>
        </a>
        <nav aria-label="Primary navigation">{siteContent.nav?.primary.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
      </header>
      <main><LanderPage site={compiledSite as any} page={page as any} /></main>
      <footer><p>{siteContent.footer?.note}</p></footer>
    </div>
  );
}
