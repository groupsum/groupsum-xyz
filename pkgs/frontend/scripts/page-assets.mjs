// Follow Vite's static imports, dynamic imports and preload dependency arrays.
export async function hasPageAssetMarker(html, marker, baseUrl, fetchAsset) {
  const origin = new URL(baseUrl).origin;
  const pending = [...html.matchAll(/(?:src|href)="([^"]+\.js)"/g)]
    .map((match) => new URL(match[1], baseUrl));
  const visited = new Set();
  while (pending.length) {
    const asset = pending.shift();
    if (asset.origin !== origin || visited.has(asset.href)) continue;
    if (visited.size >= 256) throw new Error("Page asset dependency graph exceeds verification limit");
    visited.add(asset.href);
    const source = await fetchAsset(asset.pathname);
    if (source.includes(marker)) return true;
    for (const match of source.matchAll(/["']((?:\.\.?\/|\/|assets\/)[^"'\s]+\.js)["']/g)) {
      pending.push(new URL(match[1], match[1].startsWith("assets/") ? `${origin}/` : asset));
    }
  }
  return false;
}
