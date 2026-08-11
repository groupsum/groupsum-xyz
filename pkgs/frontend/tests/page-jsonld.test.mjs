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
