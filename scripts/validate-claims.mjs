import fs from "node:fs";

const activeContentFiles = [
  "src/App.tsx",
  "src/components/SiteFooter.tsx",
  "src/data/entities.ts",
  "src/data/portfolio.ts",
  "src/data/services.ts",
  "src/data/solutions.ts",
  "src/data/vision.ts",
  "src/mdwrk/structured-data/index.tsx",
];

const text = activeContentFiles
  .map((file) => `\n/* ${file} */\n${fs.readFileSync(file, "utf8")}`)
  .join("\n");

const unsupportedClaimPatterns = [
  /10k documents daily/i,
  /4tb of (?:active|distributed) assets/i,
  /500k (?:legacy |financial )?statements/i,
  /50m daily/i,
  /1\.2m (?:transactions|validation gates)/i,
  /under 200 milliseconds/i,
  /enterprise clients/i,
  /production stable/i,
  /active pilot/i,
  /zero[- ]drift claims/i,
  /lightning[- ]fast/i,
];

const violations = unsupportedClaimPatterns.filter((pattern) => pattern.test(text));
if (violations.length) {
  throw new Error(`unsupported public claim pattern(s): ${violations.join(", ")}`);
}

const evidenceFile = fs.readFileSync("src/data/entities.ts", "utf8");
const checkedAtMatch = evidenceFile.match(/const checkedAt = "(\d{4}-\d{2}-\d{2})"/);
if (!checkedAtMatch) throw new Error("catalog evidence date is missing");

const checkedAt = new Date(`${checkedAtMatch[1]}T00:00:00Z`);
const now = new Date();
const ageDays = Math.floor((now.getTime() - checkedAt.getTime()) / 86_400_000);
if (ageDays < 0) throw new Error(`catalog evidence date is in the future: ${checkedAtMatch[1]}`);
if (ageDays > 45) {
  throw new Error(`catalog evidence is stale (${ageDays} days old); re-review claims and update checkedAt`);
}

console.log(`claims ok: ${activeContentFiles.length} active content files, evidence checked ${checkedAtMatch[1]}`);
