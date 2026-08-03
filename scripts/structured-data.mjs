import {
  softwareApplicationNode,
  softwareSourceCodeNode,
  stableId,
} from "@mdwrk/structured-data";

const ROOT = "https://groupsum.xyz";
const id = (url, fragment) => `${url}#${fragment}`;
const organization = { "@type": "ProfessionalService", "@id": id(ROOT, "organization"), name: "Groupsum LLC", url: `${ROOT}/`, logo: `${ROOT}/social/groupsum-default.svg`, description: "Groupsum builds structured software, platforms, and services for teams that need clear decisions." };
const family = (record) => record.schemaFamily || (record.type === "article" ? "article" : record.route === "/" ? "home" : record.route === "/catalog/" ? "catalog" : record.route.startsWith("/products/") ? (record.route.split("/").length > 3 ? "product-detail" : "products") : record.route.startsWith("/portfolio/projects/") ? "project" : record.route.startsWith("/portfolio/packages/") ? "package" : record.route.startsWith("/portfolio/specifications/") ? "specification" : record.route.startsWith("/portfolio/") ? (record.route.split("/").length > 3 ? "portfolio-detail" : "portfolio") : record.route.startsWith("/solutions/") ? (record.route.split("/").length > 3 ? "solution-detail" : "solutions") : record.route.startsWith("/services/") ? (record.route.split("/").length > 3 ? "service-detail" : "services") : record.route.startsWith("/insights") ? "insights" : record.route.startsWith("/about") ? "about" : record.route.startsWith("/contact") ? "contact" : "policy");
const breadcrumb = (record) => {
  const parts = record.route.split("/").filter(Boolean); const items = [{ name: "Home", item: `${ROOT}/` }]; let current = "";
  for (const part of parts) { current += `/${part}`; items.push({ name: part.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), item: `${ROOT}${current}/` }); }
  return { "@type": "BreadcrumbList", "@id": id(record.url, "breadcrumbs"), itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.item })) };
};
const graph = (record) => {
  const schemaFamily = family(record);
  const pageType = schemaFamily === "about" ? "AboutPage" : schemaFamily === "contact" ? "ContactPage" : "WebPage";
  const page = { "@type": pageType, "@id": id(record.url, "page"), url: record.url, name: record.title, description: record.description, isPartOf: { "@id": id(ROOT, "website") }, publisher: { "@id": id(ROOT, "organization") } };
  const nodes = [organization, { "@type": "WebSite", "@id": id(ROOT, "website"), url: `${ROOT}/`, name: "Groupsum", publisher: { "@id": id(ROOT, "organization") } }, page, breadcrumb(record)];
  if (["products", "portfolio", "solutions", "services", "insights"].includes(schemaFamily)) nodes.push({ "@type": "ItemList", "@id": id(record.url, "items"), name: record.title, ...(record.itemCount ? { numberOfItems: record.itemCount } : {}), itemListElement: [] });
  if (schemaFamily === "catalog") nodes.push({ "@type": "DataCatalog", "@id": id(record.url, "catalog"), name: record.title, description: record.description, url: record.url, publisher: { "@id": id(ROOT, "organization") } });
  if (["catalog-repository", "catalog-package"].includes(schemaFamily)) nodes.push({ "@type": "SoftwareSourceCode", "@id": id(record.url, "artifact"), name: record.title.replace(/ \|.*$/, ""), description: record.description, url: record.url, ...(record.sourceUrl ? { codeRepository: record.sourceUrl } : {}), publisher: { "@id": id(ROOT, "organization") } });
  if (record.type === "article") nodes.push({ "@type": "TechArticle", "@id": id(record.url, "article"), url: record.url, headline: record.title, description: record.description, ...(record.published ? { datePublished: record.published } : {}), ...(record.modified ? { dateModified: record.modified } : {}), articleSection: record.section || "Technical Research", keywords: record.tags || [], author: { "@type": "Person", name: record.author || "Groupsum LLC" }, publisher: { "@id": id(ROOT, "organization") }, mainEntityOfPage: { "@id": id(record.url, "page") }, ...(record.image?.url ? { image: record.image.url } : {}) });
  if (["product-detail", "portfolio-detail"].includes(schemaFamily)) nodes.push(softwareApplicationNode({ id: stableId(record.url, "software"), url: record.url, name: record.title.replace(/ \|.*$/, ""), description: record.description, applicationCategory: "DeveloperApplication", operatingSystem: "Cross-platform" }));
  if (schemaFamily === "portfolio-evidence") {
    const artifact = softwareSourceCodeNode({ id: stableId(record.url, "source"), url: record.url, name: record.title.replace(/ \|.*$/, ""), description: record.description, codeRepository: record.sourceUrl });
    artifact.additionalProperty = [["Repositories", record.repositoryCount], ["Packages", record.packageCount], ["Releases", record.releaseCount], ["Related resources", record.resourceCount], ["Dependencies", record.dependencyCount], ["Observed dependents", record.dependentCount]].filter(([, value]) => Number(value) > 0).map(([name, value]) => ({ "@type": "PropertyValue", name, value }));
    nodes.push(artifact);
  }
  if (["project", "package", "specification"].includes(schemaFamily)) nodes.push({ "@type": schemaFamily === "specification" ? "TechArticle" : "SoftwareSourceCode", "@id": id(record.url, "artifact"), url: record.url, name: record.title.replace(/ \|.*$/, ""), description: record.description, author: { "@id": id(ROOT, "organization") }, publisher: { "@id": id(ROOT, "organization") } });
  if (["solution-detail", "service-detail"].includes(schemaFamily)) nodes.push({ "@type": "Service", "@id": id(record.url, "service"), url: record.url, name: record.title.replace(/ \\|.*$/, ""), description: record.description, provider: { "@id": id(ROOT, "organization") } });
  if (["portfolio-detail", "project", "package", "specification", "solution-detail", "service-detail"].includes(schemaFamily)) nodes.push({ "@type": "Claim", "@id": id(record.url, "claim"), claimReviewed: record.title, text: record.description, author: { "@id": id(ROOT, "organization") }, appearance: { "@id": id(record.url, "page") } });
  return { "@context": "https://schema.org", "@graph": nodes };
};
export const jsonLdHtml = (record) => `<script type="application/ld+json">${JSON.stringify(graph(record)).replace(/</g, "\\u003c")}</script>`;
