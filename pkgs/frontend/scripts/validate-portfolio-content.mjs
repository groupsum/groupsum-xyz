import fs from "node:fs";

const entities = fs.readFileSync("pkgs/frontend/src/data/entities.ts", "utf8");
const vision = fs.readFileSync("pkgs/frontend/src/data/vision.ts", "utf8");
const required = ["voltrack", "dcim-rack-planner", "dcim-fiber-planner", "deliverableops", "cc-deliverable-ops", "evidencevault", "npmctl"];
const missing = required.filter((slug) => !entities.includes(`slug: "${slug}"`));
if (missing.length) throw new Error(`missing researched entities: ${missing.join(", ")}`);
for (const marker of ["governability", "controlled-delivery", "evidence-and-trust", "infrastructure-planning", "operator-boundaries"]) {
  if (!vision.includes(`id: "${marker}"`)) throw new Error(`missing horizontal capability: ${marker}`);
}
if (/slug:\s*["']wyrmctl["']/i.test(entities)) throw new Error("Wyrmctl must remain unresolved until separately evidenced");
const portwyrm = entities.match(/slug:\s*["']portwyrm["'][\s\S]*?technologies:\s*\[([^\]]+)\]/i)?.[1] || "";
if (!portwyrm.includes('"Tigrbl"') || portwyrm.includes('"FastAPI"')) throw new Error("Portwyrm technology metadata must identify Tigrbl, not FastAPI");
console.log(`portfolio content ok: ${required.length} researched entities, 5 horizontal capabilities`);
