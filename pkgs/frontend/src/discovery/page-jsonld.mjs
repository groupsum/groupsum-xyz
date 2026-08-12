import {
  blogPostingNode,
  computerLanguageNode,
  datasetNode,
  faqPageSchema,
  howToNode,
  productNode,
  softwareApplicationNode,
  softwareSourceCodeNode,
  stableId,
  techArticleNode,
  webApplicationNode,
} from "@mdwrk/structured-data";

export const SITE_ROOT = "https://groupsum.xyz";

const ref = (id) => ({ "@id": id });
const withoutContext = (node) => {
  const { "@context": _context, ...rest } = node;
  return rest;
};
const label = (value) => String(value || "").replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
const pageName = (record) => String(record.title || "GroupSum").replace(/ \|.*$/u, "");
const familyFor = (record) => record.schemaFamily || (record.type === "article" ? "article" : record.route === "/" ? "home" : record.route === "/catalog/" ? "catalog" : record.route.startsWith("/products/") ? (record.route.split("/").length > 3 ? "product-detail" : "products") : record.route.startsWith("/portfolio/projects/") ? "project" : record.route.startsWith("/portfolio/packages/") ? "package" : record.route.startsWith("/portfolio/specifications/") ? "specification" : record.route.startsWith("/portfolio/") ? (record.route.split("/").length > 3 ? "portfolio-detail" : "portfolio") : record.route.startsWith("/solutions/") ? (record.route.split("/").length > 3 ? "solution-detail" : "solutions") : record.route.startsWith("/services/") ? (record.route.split("/").length > 3 ? "service-detail" : "services") : record.route.startsWith("/insights") ? "insights" : record.route.startsWith("/about") ? "about" : record.route.startsWith("/contact") ? "contact" : "policy");

const organization = {
  "@type": "ProfessionalService",
  "@id": stableId(SITE_ROOT, "organization"),
  name: "Groupsum LLC",
  url: `${SITE_ROOT}/`,
  logo: `${SITE_ROOT}/social/groupsum-default.svg`,
  description: "Groupsum builds structured software, platforms, and services for teams that need clear decisions.",
};

function breadcrumbNode(record) {
  const parts = String(record.route || "/").split("/").filter(Boolean);
  let current = "";
  const items = [{ name: "Home", item: `${SITE_ROOT}/` }];
  for (const part of parts) {
    current += `/${part}`;
    items.push({ name: label(part), item: `${SITE_ROOT}${current}/` });
  }
  return {
    "@type": "BreadcrumbList",
    "@id": stableId(record.url, "breadcrumbs"),
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })),
  };
}

const languageNames = (record) => [...new Set([...Object.keys(record.language_bytes || {}), ...(record.technologies || [])])].filter(Boolean);

const contributorNodes = (record) => (record.contributors || []).map((person) => ({
  "@type": "Person",
  "@id": stableId(person.url || `${record.url}/contributors/${person.login}`, "person"),
  name: person.login,
  url: person.url,
}));

function collectionNodes(record) {
  const records = record.items || [];
  const entries = records.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.display_name || item.name || item.title, url: item.url || `${SITE_ROOT}${item.route}` }));
  const datasetId = stableId(record.url, "dataset");
  return [
    { "@type": "DataCatalog", "@id": stableId(record.url, "catalog"), name: record.title, description: record.description, url: record.url, publisher: ref(organization["@id"]), dataset: ref(datasetId) },
    { "@type": "Dataset", "@id": datasetId, name: record.title, description: record.description, url: record.url, creator: ref(organization["@id"]), ...(record.downloadUrl ? { distribution: { "@type": "DataDownload", contentUrl: record.downloadUrl, encodingFormat: "application/json" } } : {}) },
    { "@type": "ItemList", "@id": stableId(record.url, "items"), name: record.title, numberOfItems: record.itemCount ?? records.length, itemListElement: entries },
  ];
}

function repositoryNodes(record) {
  const people = contributorNodes(record);
  const languages = languageNames(record);
  const source = withoutContext(softwareSourceCodeNode({
    id: stableId(record.url, "source"), name: record.display_name || pageName(record), description: record.description, url: record.url,
    codeRepository: record.sourceUrl || record.url, programmingLanguage: languages, runtimePlatform: record.runtime_platform,
    version: record.latest_release?.tag, license: record.license, contributor: people.map((person) => ref(person["@id"])),
    dateCreated: record.created_at, dateModified: record.pushed_at || record.updated_at,
  }));
  source.publisher = ref(organization["@id"]);
  source.hasPart = (record.packages || []).map((item) => ({ "@type": "SoftwareApplication", "@id": stableId(`${SITE_ROOT}${item.route}`, "software"), name: item.name, softwareVersion: item.latest_version }));
  return [source, ...people, ...languages.map((name) => computerLanguageNode({ "@id": stableId(`${SITE_ROOT}/catalog/technologies/${encodeURIComponent(name.toLowerCase())}`, "language"), name }))];
}

function packageNodes(record) {
  const source = withoutContext(softwareSourceCodeNode({ id: stableId(record.url, "source"), name: record.display_name || pageName(record), description: record.description, url: record.url, codeRepository: record.source_url, programmingLanguage: record.technologies || [], version: record.latest_version || record.version_declared, license: record.license_expression }));
  const nodes = [source];
  if (record.published) {
    const application = withoutContext(softwareApplicationNode({ id: stableId(record.url, "software"), name: record.display_name || pageName(record), description: record.description, url: record.registry_url || record.url, applicationCategory: "DeveloperApplication", operatingSystem: "Cross-platform", softwareVersion: record.latest_version || record.version_declared }));
    application.downloadUrl = record.registry_url;
    application.license = record.license_expression;
    nodes.push(application);
  }
  return nodes;
}

function resourceNode(record) {
  const type = String(record.resource_type || "").toLowerCase();
  const common = { id: stableId(record.url, "resource"), name: record.display_name || pageName(record), description: record.description, url: record.sourceUrl || record.url };
  if (type.startsWith("governance.")) {
    const payload = record.payload && typeof record.payload === "object" ? record.payload : {};
    const article = withoutContext(techArticleNode({
      ...common,
      headline: common.name,
      dateModified: record.observed_at,
      mainEntityOfPage: ref(stableId(record.url, "page")),
    }));
    article.identifier = payload.id || record.source_key || record.id;
    article.additionalType = `https://groupsum.xyz/ns/ssot/${type.replace("governance.", "")}`;
    const relationships = record.relationships || record.entity_graph?.relationships || [];
    const owner = record.entity_graph?.owner;
    const repositories = record.repositories || [];
    const related = [...relationships, ...(owner ? [owner] : []), ...repositories]
      .filter((item) => item.route || item.url || item.canonical_url)
      .filter((item, index, values) => values.findIndex((candidate) => (candidate.route || candidate.url || candidate.canonical_url) === (item.route || item.url || item.canonical_url)) === index);
    article.about = related.map((item) => {
      const url = new URL(item.route || item.url || item.canonical_url, SITE_ROOT).href;
      return {
        "@type": "Thing",
        "@id": stableId(url, "resource"),
        name: item.name,
        url,
      };
    });
    return article;
  }
  if (type === "data.dataset") return withoutContext(datasetNode({ ...common, creator: ref(organization["@id"]), license: record.license_expression }));
  if (type.includes("faq") && Array.isArray(record.faq_items) && record.faq_items.length) return withoutContext(faqPageSchema({ id: common.id, url: common.url, items: record.faq_items }));
  if ((type.includes("how_to") || type.includes("tutorial")) && Array.isArray(record.steps) && record.steps.length) return withoutContext(howToNode({ ...common, steps: record.steps }));
  if (/(demo|application|playground|dashboard|interface)/u.test(type)) return withoutContext(webApplicationNode({ ...common, applicationCategory: "DeveloperApplication", operatingSystem: "Web" }));
  if (/(article|blog)/u.test(type)) return withoutContext(blogPostingNode({ ...common, headline: common.name, dateModified: record.observed_at }));
  return withoutContext(techArticleNode({ ...common, headline: common.name, dateModified: record.observed_at }));
}

function detailNodes(record, family) {
  if (family === "catalog-repository") return repositoryNodes(record);
  if (family === "catalog-package") return packageNodes(record);
  if (family === "catalog-resource") return [resourceNode(record)];
  if (family === "catalog-technology") return [computerLanguageNode({ "@id": stableId(record.url, "language"), name: record.name || pageName(record), description: record.description, url: record.url })];
  if (family === "contributor-profile") {
    const personId = stableId(record.url, "person");
    return [
      { "@type": "ProfilePage", "@id": stableId(record.url, "profile"), name: record.title, description: record.description, url: record.url, mainEntity: ref(personId) },
      { "@type": "Person", "@id": personId, name: record.name || record.login, alternateName: record.login ? `@${record.login}` : undefined, url: record.profileUrl || record.url, image: record.avatar_url, subjectOf: ref(stableId(record.url, "profile")) },
    ];
  }
  if (record.type === "article") return [withoutContext(techArticleNode({ id: stableId(record.url, "article"), name: record.title, headline: record.title, description: record.description, url: record.url, datePublished: record.published, dateModified: record.modified, articleSection: record.section, keywords: record.tags, author: { "@type": "Person", name: record.author || "Groupsum LLC" }, mainEntityOfPage: ref(stableId(record.url, "page")) }))];
  if (["product-detail", "portfolio-detail", "portfolio-evidence"].includes(family)) {
    const application = withoutContext(softwareApplicationNode({ id: stableId(record.url, "software"), name: pageName(record), description: record.description, url: record.url, applicationCategory: "DeveloperApplication", operatingSystem: "Cross-platform" }));
    const product = withoutContext(productNode({ id: stableId(record.url, "product"), name: pageName(record), description: record.description, url: record.url, brand: "Groupsum" }));
    return [application, product];
  }
  if (["project", "package"].includes(family)) return [withoutContext(softwareSourceCodeNode({ id: stableId(record.url, "source"), name: pageName(record), description: record.description, url: record.url, codeRepository: record.sourceUrl }))];
  if (family === "specification") return [withoutContext(techArticleNode({ id: stableId(record.url, "article"), name: pageName(record), headline: pageName(record), description: record.description, url: record.url }))];
  if (["solution-detail", "service-detail"].includes(family)) return [{ "@type": "Service", "@id": stableId(record.url, "service"), name: pageName(record), description: record.description, url: record.url, provider: ref(organization["@id"]) }];
  return [];
}

export function buildPageJsonLd(record) {
  const family = familyFor(record);
  const pageType = family === "about" ? "AboutPage" : family === "contact" ? "ContactPage" : family === "article" ? "ItemPage" : "WebPage";
  const page = { "@type": pageType, "@id": stableId(record.url, "page"), url: record.url, name: record.title, description: record.description, isPartOf: ref(stableId(SITE_ROOT, "website")), publisher: ref(organization["@id"]) };
  const nodes = [organization, { "@type": "WebSite", "@id": stableId(SITE_ROOT, "website"), url: `${SITE_ROOT}/`, name: "Groupsum", publisher: ref(organization["@id"]) }, page, breadcrumbNode(record)];
  if (["catalog", "catalog-collection", "products", "portfolio", "solutions", "services", "insights"].includes(family)) nodes.push(...collectionNodes(record));
  nodes.push(...detailNodes(record, family));
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}

export const pageJsonLdHtml = (record) => `<script type="application/ld+json" id="groupsum-page-jsonld">${JSON.stringify(buildPageJsonLd(record)).replace(/</g, "\\u003c")}</script>`;
