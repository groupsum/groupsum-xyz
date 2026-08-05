import crypto from "node:crypto";
import fs from "node:fs";
import openapiTS, { astToString } from "openapi-typescript";

const openapiPath = "backend/openapi.json";
const schemaTarget = "src/api/schema.generated.ts";
const openapi = fs.readFileSync(openapiPath, "utf8");
const canonical = JSON.stringify(JSON.parse(openapi));
const digest = crypto.createHash("sha256").update(canonical).digest("hex");

fs.mkdirSync("src/api", { recursive: true });
const ast = await openapiTS(new URL(`../${openapiPath}`, import.meta.url));
fs.writeFileSync(schemaTarget, astToString(ast));
fs.writeFileSync(
  "src/api/contract.generated.ts",
  `// Generated from backend/openapi.json. Do not edit manually.\nexport const OPENAPI_SHA256 = "${digest}" as const;\n`,
);
console.log(`generated typed OpenAPI contract ${digest.slice(0, 12)}`);
