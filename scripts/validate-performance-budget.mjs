import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const assets = fs.readdirSync("dist/assets").filter((name) => name.endsWith(".js"));
const oversized = assets
  .map((name) => ({ name, bytes: fs.statSync(path.join("dist/assets", name)).size }))
  .filter((asset) => asset.bytes > 262_144);
if (oversized.length) {
  throw new Error(`JavaScript chunk budget exceeded: ${JSON.stringify(oversized)}`);
}

const html = fs.readFileSync("dist/index.html", "utf8");
const initialAssets = [...html.matchAll(/(?:src|href)="\/assets\/([^"]+\.js)"/g)].map(
  (match) => match[1],
);
const initialGzipBytes = [...new Set(initialAssets)].reduce(
  (total, name) => total + zlib.gzipSync(fs.readFileSync(path.join("dist/assets", name))).length,
  0,
);
if (initialGzipBytes > 153_600) {
  throw new Error(`Initial JavaScript gzip budget exceeded: ${initialGzipBytes} bytes`);
}

const peagen = fs.readFileSync("dist/products/records/peagen/index.html", "utf8");
for (const marker of ["Peagen", "peagen-com", "Related resources", "groupsum-page-model"]) {
  if (!peagen.includes(marker)) throw new Error(`Server-rendered Peagen page missing ${marker}`);
}
console.log(
  `performance budget ok: ${assets.length} chunks, largest=${Math.max(...assets.map((name) => fs.statSync(path.join("dist/assets", name)).size))} bytes, initial-gzip=${initialGzipBytes} bytes`,
);
