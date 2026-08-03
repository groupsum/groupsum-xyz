const baseUrl = (process.env.DEPLOY_VERIFY_URL || "https://groupsum.xyz").replace(/\/$/, "");
const expected = {
  repositories: 71,
  packages: 1124,
};

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchText(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, { headers: { "cache-control": "no-cache" } });
  if (!response.ok) throw new Error(`${pathname} returned ${response.status}`);
  return response.text();
}

async function verify() {
  const manifest = JSON.parse(await fetchText("/catalog/site/manifest.json"));
  for (const [name, minimum] of Object.entries(expected)) {
    if (Number(manifest.counts?.[name] || 0) < minimum) throw new Error(`${name} count is below expected minimum ${minimum}`);
  }
  const catalogHtml = await fetchText("/catalog/");
  if (!catalogHtml.includes("Public ecosystem catalog") || !catalogHtml.includes("DataCatalog")) throw new Error("catalog route metadata is stale");
  const homeHtml = await fetchText("/");
  const asset = homeHtml.match(/<script[^>]+src="([^"]+\.js)"/i)?.[1];
  if (!asset) throw new Error("deployed application JavaScript asset was not found");
  const bundle = await fetchText(asset);
  for (const marker of ["Current public ecosystem evidence", "Public ecosystem records", "/catalog/site/"]) {
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
