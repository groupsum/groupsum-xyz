import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync(new URL("../site.manifest.json", import.meta.url), "utf8"));
const command = `docker compose -f docker-compose.yaml up -d --build --force-recreate --no-deps ${manifest.dockerService}`;
const proxyManager = manifest.proxyManager ?? {
  provider: "nginx-proxy-manager",
  apiEndpoint: "https://nginx.bz23.xyz/",
};

console.log(JSON.stringify({
  host: manifest.host,
  service: manifest.dockerService,
  command,
  proxyManager,
}, null, 2));
