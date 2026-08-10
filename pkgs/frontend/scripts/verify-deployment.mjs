const baseUrl = (process.env.DEPLOY_VERIFY_URL || "https://groupsum.xyz").replace(/\/$/, "");
const expected = {
  repositories: 68,
  packages: 1125,
};

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchText(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, { headers: { "cache-control": "no-cache" } });
  if (!response.ok) throw new Error(`${pathname} returned ${response.status}`);
  return response.text();
}

async function requirePageAssetMarker(html, marker, label) {
  const assets = [...html.matchAll(/(?:src|href)="([^"]+\.js)"/g)].map((match) => match[1]);
  for (const asset of new Set(assets)) {
    if ((await fetchText(asset)).includes(marker)) return;
  }
  throw new Error(`${label} component is missing from emitted page assets`);
}

async function verify() {
  const manifest = JSON.parse(await fetchText("/catalog/site/manifest.json"));
  for (const [name, minimum] of Object.entries(expected)) {
    if (Number(manifest.counts?.[name] || 0) < minimum) throw new Error(`${name} count is below expected minimum ${minimum}`);
  }
  for (const name of ["releases", "deployments", "relationships"]) {
    if (manifest.source_counts?.[name] === undefined) throw new Error(`missing aggregated ${name} source count`);
  }
  for (const name of ["releases", "deployments", "surfaces", "relationships"]) {
    if (manifest.files?.some((item) => item.dataset === name)) throw new Error(`standalone ${name} dataset is still published`);
  }
  const repositories = JSON.parse(await fetchText("/catalog/site/repositories.json"));
  if (repositories.some((record) => String(record.name).toLowerCase() === ".github")) throw new Error("excluded .github repository is still published");
  const repositoryCollectionHtml = await fetchText("/catalog/repositories/");
  await requirePageAssetMarker(repositoryCollectionHtml, "Repository catalog records", "repository collection table");
  const packageCollectionHtml = await fetchText("/catalog/packages/");
  await requirePageAssetMarker(packageCollectionHtml, "Package catalog records", "package collection table");
  const portwyrmEvidence = JSON.parse(await fetchText("/catalog/product-evidence/groupsum/portwyrm.json"));
  if (portwyrmEvidence.repository?.full_name !== "groupsum/portwyrm") throw new Error("Portwyrm product evidence has the wrong repository");
  if (!portwyrmEvidence.packages?.length) throw new Error("Portwyrm product evidence is missing packages");
  if (!portwyrmEvidence.repository?.related_resources?.length) throw new Error("Portwyrm product evidence is missing related resources");
  const catalogHtml = await fetchText("/catalog/");
  if (!catalogHtml.includes("Public ecosystem catalog") || !catalogHtml.includes("DataCatalog")) throw new Error("catalog route metadata is stale");
  const portwyrmHtml = await fetchText("/products/records/portwyrm/");
  for (const marker of ["Portwyrm | GroupSum products", "SoftwareApplication", "https://groupsum.xyz/products/records/portwyrm/"]) {
    if (!portwyrmHtml.includes(marker)) throw new Error(`Portwyrm product metadata is missing ${marker}`);
  }
  const peagenHtml = await fetchText("/products/records/peagen/");
  for (const marker of ["Peagen", "peagen-com"]) {
    if (!peagenHtml.includes(marker)) throw new Error(`Peagen rendered page is missing ${marker}`);
  }
  const tigrblHtml = await fetchText("/products/records/tigrbl/");
  for (const marker of ["Tigrbl", "Dependencies"]) {
    if (!tigrblHtml.includes(marker)) throw new Error(`Tigrbl rendered page is missing ${marker}`);
  }
  const fasttokenizerHtml = await fetchText("/catalog/packages/crates/fasttokenizer-3b1c6d25/");
  if (!fasttokenizerHtml.includes("fasttokenizer")) throw new Error("fasttokenizer package page is missing its record identity");
  if (fasttokenizerHtml.includes("{'version': '0.29.0'")) {
    throw new Error("fasttokenizer package page exposes a serialized dependency requirement");
  }
  const openapi = JSON.parse(await fetchText("/openapi.json"));
  if (!openapi.paths?.["/api/v1/products/{slug}"]) throw new Error("deployed OpenAPI lacks product record resource representation");
  if (!openapi.paths?.["/api/v1/repository-metrics"]) throw new Error("deployed OpenAPI lacks repository metric histories");
  if (!openapi.paths?.["/internal/v1/catalog/entities/{entity_type}"]?.post) throw new Error("deployed OpenAPI lacks internal entity publication");
  if (!openapi.paths?.["/internal/v1/catalog/snapshots"]?.post) throw new Error("deployed OpenAPI lacks snapshot finalization");
  const homeHtml = await fetchText("/");
  for (const marker of ["GroupSum Products", "GroupSum Portfolios", "Typed resources", "/api/v1/catalog/"]) {
    await requirePageAssetMarker(homeHtml, marker, `deployed bundle marker ${marker}`);
  }
  console.log(`deployment verified: ${baseUrl}, repositories=${manifest.counts.repositories}, packages=${manifest.counts.packages}`);
}

let lastError;
for (let attempt = 1; attempt <= 6; attempt += 1) {
  try {
    await verify();
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (attempt < 6) await delay(attempt * 2000);
  }
}
throw lastError;
