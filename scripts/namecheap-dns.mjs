import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync(new URL("../site.manifest.json", import.meta.url), "utf8"));
const mode = process.argv.includes("--apply") ? "apply" : "plan";
const required = ["NAMECHEAP_API_USER", "NAMECHEAP_API_KEY", "NAMECHEAP_USERNAME", "NAMECHEAP_CLIENT_IP"];

if (mode === "apply") {
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) {
    console.error(`Missing Namecheap secrets: ${missing.join(", ")}`);
    process.exit(1);
  }
  console.log(`Namecheap apply requested for ${manifest.host}. Wire this step to npmctl-namecheap in the deployment environment.`);
} else {
  console.log(JSON.stringify({ provider: manifest.dnsProvider, zone: manifest.zone, host: manifest.host, records: manifest.records }, null, 2));
}
