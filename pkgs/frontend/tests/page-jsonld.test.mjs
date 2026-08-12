import assert from "node:assert/strict";
import test from "node:test";
import { buildPageJsonLd } from "../src/discovery/page-jsonld.mjs";

const base = { route: "/catalog/example/", url: "https://groupsum.xyz/catalog/example/", title: "Example | GroupSum", description: "Visible example description.", type: "website" };
const types = (graph) => graph["@graph"].map((node) => node["@type"]);

test("repository graphs link source code, contributors, languages, and packages", () => {
  const graph = buildPageJsonLd({ ...base, schemaFamily: "catalog-repository", sourceUrl: "https://github.com/groupsum/example", language_bytes: { TypeScript: 100 }, contributors: [{ login: "dev", url: "https://github.com/dev" }], packages: [{ name: "example", route: "/catalog/packages/npm/example", latest_version: "1.0.0" }] });
  assert.ok(types(graph).includes("SoftwareSourceCode"));
  assert.ok(types(graph).includes("Person"));
  assert.ok(types(graph).includes("ComputerLanguage"));
  assert.equal(graph["@graph"].find((node) => node["@type"] === "SoftwareSourceCode").hasPart.length, 1);
});

test("collection graphs publish a populated ItemList and downloadable Dataset", () => {
  const graph = buildPageJsonLd({ ...base, schemaFamily: "catalog-collection", itemCount: 2, downloadUrl: "https://groupsum.xyz/catalog/site/packages.json", items: [{ name: "One", route: "/one" }, { name: "Two", route: "/two" }] });
  const list = graph["@graph"].find((node) => node["@type"] === "ItemList");
  const dataset = graph["@graph"].find((node) => node["@type"] === "Dataset");
  assert.equal(list.numberOfItems, 2);
  assert.equal(list.itemListElement.length, 2);
  assert.equal(dataset.distribution.contentUrl, "https://groupsum.xyz/catalog/site/packages.json");
});

test("resource and contributor pages select evidence-backed page-family types", () => {
  const demo = buildPageJsonLd({ ...base, schemaFamily: "catalog-resource", resource_type: "implementation.demo", sourceUrl: "https://example.test/demo" });
  assert.ok(types(demo).includes("WebApplication"));
  const contributor = buildPageJsonLd({ ...base, schemaFamily: "contributor-profile", name: "Dev", login: "dev", profileUrl: "https://github.com/dev" });
  assert.ok(types(contributor).includes("ProfilePage"));
  assert.ok(types(contributor).includes("Person"));
  assert.equal(JSON.stringify(contributor).includes("[object Object]"), false);
  const dataset = buildPageJsonLd({ ...base, schemaFamily: "catalog-resource", resource_type: "data.dataset", sourceUrl: "https://example.test/data.json" });
  assert.ok(types(dataset).includes("Dataset"));
  const product = buildPageJsonLd({ ...base, schemaFamily: "product-detail" });
  assert.ok(types(product).includes("SoftwareApplication"));
  assert.ok(types(product).includes("Product"));
});

test("SSOT resource graphs preserve the visible entity identity and links", () => {
  const graph = buildPageJsonLd({
    ...base,
    schemaFamily: "catalog-resource",
    resource_type: "governance.claim",
    source_key: "clm:public-proof",
    observed_at: "2026-08-11T00:00:00Z",
    relationships: [{ name: "Passing test", route: "/catalog/resources/governance.test/ssot-item:test" }],
    entity_graph: {
      relationships: [],
      owner: { name: "groupsum", route: "/catalog" },
    },
    repositories: [{ name: "groupsum/example", route: "/catalog/repositories/groupsum/example" }],
  });
  const article = graph["@graph"].find((node) => node["@type"] === "TechArticle");
  assert.equal(article.identifier, "clm:public-proof");
  assert.equal(article.additionalType, "https://groupsum.xyz/ns/ssot/claim");
  assert.equal(article.about[0].name, "Passing test");
  assert.equal(article.about[1].name, "groupsum");
  assert.equal(article.about[2].name, "groupsum/example");
  assert.equal(article.about[2].url, "https://groupsum.xyz/catalog/repositories/groupsum/example");
  assert.equal(article.mainEntityOfPage["@id"], "https://groupsum.xyz/catalog/example#page");
});
