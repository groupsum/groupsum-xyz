import fs from "node:fs";

const entities = fs.readFileSync("src/data/entities.ts", "utf8");
const app = fs.readFileSync("src/App.tsx", "utf8");
const required = ["CatalogToolbar", "CatalogGroup", "CatalogRow", "useCatalogFilters", "Projects & applications", "Packages & modules"];
for (const marker of required) if (!entities.includes(marker) && !app.includes(marker) && !fs.existsSync(`src/components/${marker}.tsx`) && !fs.existsSync(`src/hooks/${marker}.ts`)) throw new Error(`catalog implementation marker missing: ${marker}`);
if (!app.includes("portfolioEntities.filter((entity) => entity.approved)")) throw new Error("portfolio page is not using the complete approved entity catalog");
console.log("catalog content ok: grouped products, projects, packages, and specifications");
