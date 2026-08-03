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

async function fetchResponse(pathname, headers = {}) {
  return fetch(`${baseUrl}${pathname}`, { headers: { "cache-control": "no-cache", ...headers } });
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
  for (const marker of ["Peagen", ">5</dd>", "peagen-com", "docs-peagen-com", "No public core implementation repository", "https://peagen.com"]) {
    if (!peagenHtml.includes(marker)) throw new Error(`Peagen rendered page is missing ${marker}`);
  }
  const peagenApi = await fetchResponse("/api/v1/products/peagen");
  if (!peagenApi.ok) throw new Error(`Peagen API returned ${peagenApi.status}`);
  const peagenModel = await peagenApi.json();
  if (peagenModel.implementation?.repositories?.length !== 3) throw new Error("Peagen API repository attachments are incomplete");
  if (peagenModel.implementation?.packages?.length !== 5) throw new Error("Peagen API package attachments are incomplete");
  if (peagenModel.implementation?.resources?.length !== 7) throw new Error("Peagen API related resources are incomplete");
  if (peagenModel.implementation.repositories[0]?.name !== "peagen-com") throw new Error("Peagen API exposes the wrong primary public repository");
  if (peagenModel.implementation.packages.some((item) => !["website-support", "documentation-support"].includes(item.role))) throw new Error("Peagen API package roles are inaccurate");
  const etag = peagenApi.headers.get("etag");
  if (!etag) throw new Error("Peagen API is missing an ETag");
  const unchanged = await fetchResponse("/api/v1/products/peagen", { "if-none-match": etag });
  if (unchanged.status !== 304) throw new Error(`Peagen conditional request returned ${unchanged.status}`);
  const tigrblHtml = await fetchText("/products/records/tigrbl/");
  for (const marker of ["PyPI", "npm", "crates.io", "Dependencies", "Observed dependents", "Stars", "Forks", "Contributors", "Commits"]) {
    if (!tigrblHtml.includes(marker)) throw new Error(`Tigrbl rendered page is missing ${marker}`);
  }
  const tigrblApi = await fetchResponse("/api/v1/products/tigrbl");
  if (!tigrblApi.ok) throw new Error(`Tigrbl API returned ${tigrblApi.status}`);
  const tigrblModel = await tigrblApi.json();
  const releaseKinds = new Set(
    (tigrblModel.implementation?.release_summary || []).map((item) => item.release_kind),
  );
  for (const releaseKind of ["pypi", "npm", "crates", "github"]) {
    if (!releaseKinds.has(releaseKind)) throw new Error(`Tigrbl API is missing ${releaseKind} releases`);
  }
  if (tigrblModel.implementation?.dependency_summary?.dependencies < 500) {
    throw new Error("Tigrbl API dependency projection is incomplete");
  }
  if (tigrblModel.implementation?.dependency_summary?.dependents < 100) {
    throw new Error("Tigrbl API dependent projection is incomplete");
  }
  const signals = tigrblModel.implementation?.signals;
  if (signals?.repository_count !== 4) throw new Error("Tigrbl aggregate repository signals are incomplete");
  if (signals?.metrics?.contributors !== 2) throw new Error("Tigrbl contributor aggregation is inaccurate");
  if (signals?.commit_activity?.length !== 30) throw new Error("Tigrbl commit activity window is incomplete");
  const metricResponse = await fetchResponse("/api/v1/repository-metrics?owner=tigrbl");
  if (!metricResponse.ok) throw new Error(`repository metric API returned ${metricResponse.status}`);
  const metricSnapshot = await metricResponse.json();
  if (metricSnapshot.owner !== "tigrbl" || metricSnapshot.count < 10) {
    throw new Error("repository metric API owner projection is incomplete");
  }
  if (metricSnapshot.repositories.some((item) => item.commit_activity?.length !== 30)) {
    throw new Error("repository metric API has an incomplete commit activity window");
  }
  if (!metricResponse.headers.get("etag")) throw new Error("repository metric API is missing an ETag");
  const generatedPortfolioHtml = await fetchText(
    "/portfolio/records/catalog-groupsum-groupsum-xyz/",
  );
  for (const marker of ["groupsum/groupsum-xyz", "Claim boundary", "Dependencies"]) {
    if (!generatedPortfolioHtml.includes(marker)) {
      throw new Error(`generated portfolio record is missing ${marker}`);
    }
  }
  const openapi = JSON.parse(await fetchText("/openapi.json"));
  if (!openapi.paths?.["/api/v1/products/{slug}"]) throw new Error("deployed OpenAPI lacks product record page model");
  if (!openapi.paths?.["/api/v1/repository-metrics"]) throw new Error("deployed OpenAPI lacks repository metric histories");
  const homeHtml = await fetchText("/");
  const asset = homeHtml.match(/<script[^>]+src="([^"]+\.js)"/i)?.[1];
  if (!asset) throw new Error("deployed application JavaScript asset was not found");
  const bundle = await fetchText(asset);
  for (const marker of ["Products built as connected systems", "Demos, APIs, examples, and related resources", "/catalog/site/"]) {
    if (!bundle.includes(marker)) throw new Error(`deployed bundle missing marker: ${marker}`);
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
