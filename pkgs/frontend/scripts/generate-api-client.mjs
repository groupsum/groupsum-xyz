import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const openapiPath = "pkgs/backend/openapi.json";
const schemaTarget = "pkgs/frontend/src/api/schema.generated.ts";
const openapi = fs.readFileSync(openapiPath, "utf8");
const canonical = JSON.stringify(JSON.parse(openapi));
const digest = crypto.createHash("sha256").update(canonical).digest("hex");

fs.mkdirSync("pkgs/frontend/src/api", { recursive: true });
const ast = await openapiTS(pathToFileURL(path.resolve(openapiPath)));
fs.writeFileSync(schemaTarget, astToString(ast));
fs.writeFileSync(
  "pkgs/frontend/src/api/contract.generated.ts",
  `// Generated from pkgs/backend/openapi.json. Do not edit manually.\nexport const OPENAPI_SHA256 = "${digest}" as const;\n`,
);
console.log(`generated typed OpenAPI contract ${digest.slice(0, 12)}`);
