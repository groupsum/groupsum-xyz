import fs from "node:fs";

const compose = fs.readFileSync("docker-compose.yaml", "utf8");
const proxy = fs.readFileSync("desired-state/proxy.yaml", "utf8");

const containerMatch = compose.match(/^[ \t]*container_name:[ \t]*([^\r\n#]+)/m);
if (!containerMatch) {
  throw new Error("docker-compose.yaml must define an explicit container_name for the site service");
}

const containerName = containerMatch[1].trim();
const forwardMatches = [...proxy.matchAll(/^[ \t]*forward_host:[ \t]*([^\r\n#]+)/gm)].map((match) => match[1].trim());
if (forwardMatches.length === 0) {
  throw new Error("desired-state/proxy.yaml must define at least one forward_host");
}

const ipLiteral = /^(?:\d{1,3}\.){3}\d{1,3}$/;
for (const forwardHost of forwardMatches) {
  if (ipLiteral.test(forwardHost)) {
    throw new Error(`forward_host must be the Docker container name, not an IP literal: ${forwardHost}`);
  }
  if (forwardHost !== containerName) {
    throw new Error(`forward_host "${forwardHost}" must match docker-compose container_name "${containerName}"`);
  }
}

console.log(`proxy target ok: ${containerName}`);
