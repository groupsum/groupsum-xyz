import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const sourceExtensions = new Set([".cjs", ".css", ".html", ".js", ".mjs", ".py", ".scss", ".ts", ".tsx"]);
const exemptPatterns = [
  /(^|\/)generated(\/|\.)/,
  /\.generated\.[^.]+$/,
  /(^|\/)catalog\/generated\//,
  /(^|\/)dist(-server)?\//,
  /(^|\/)node_modules\//,
  /(^|\/)\.venv\//,
  /(^|\/)articles\.generated\.ts$/,
  /(^|\/)schema\.generated\.ts$/,
  /(^|\/)contract\.generated\.ts$/,
];

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean);
const oversized = files.filter((file) => {
  if (!fs.existsSync(file) || !sourceExtensions.has(path.extname(file)) || exemptPatterns.some((pattern) => pattern.test(file))) return false;
  return fs.readFileSync(file, "utf8").split(/\r?\n/).length > 400;
});
const misplaced = files.filter((file) =>
  fs.existsSync(file)
  && sourceExtensions.has(path.extname(file))
  && !exemptPatterns.some((pattern) => pattern.test(file))
  && /^(backend|frontend|packages|src|public|catalog-explorer-app)\//.test(file)
);

if (oversized.length || misplaced.length) {
  if (oversized.length) console.error(`Authored source exceeds 400 lines:\n${oversized.join("\n")}`);
  if (misplaced.length) console.error(`Application/package source exists outside pkgs/:\n${misplaced.join("\n")}`);
  process.exit(1);
}
console.log("source layout ok: applications under pkgs/ and authored modules <= 400 lines");
