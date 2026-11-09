import fs from "node:fs";
import path from "node:path";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToPipeableStream } from "react-dom/server";
import { Writable } from "node:stream";
import { StaticRouter } from "./router";

import App from "./App";

let catalogResourceSnapshots: Map<string, unknown> | null = null;
let readModels: { details: Record<string, unknown>; collections: Record<string, unknown> } | undefined;
let catalogVersion: typeof globalThis.__GROUPSUM_CATALOG_VERSION__;

function catalogResourceSnapshot(pathname: string): unknown | null {
  if (pathname === "/catalog/resources") {
    const siteRoot = path.join(process.cwd(), "catalog", "generated", "site");
    const resourceTypes = JSON.parse(fs.readFileSync(path.join(siteRoot, "resource-types.json"), "utf8")) as Array<{ count: number; family: string; populated: boolean }>;
    const manifest = JSON.parse(fs.readFileSync(path.join(siteRoot, "manifest.json"), "utf8")) as { counts?: { resources?: number }; snapshot?: { collected_at?: string } };
    return {
      kind: "catalog_collection",
      resource_kind: "resource",
      count: Number(manifest.counts?.resources || 0),
      page: 1,
      page_size: 50,
      page_count: 1,
      records: [],
      facets: {},
      aggregates: {
        registered_types: resourceTypes.length,
        populated_types: resourceTypes.filter((item) => item.populated).length,
        families: new Set(resourceTypes.map((item) => item.family)).size,
      },
      generated_at: manifest.snapshot?.collected_at || null,
      resource_types: resourceTypes,
    };
  }
  if (!pathname.startsWith("/catalog/resources/")) return null;
  if (catalogResourceSnapshots === null) {
    const source = path.join(process.cwd(), "catalog", "generated", "site", "resources.json");
    const records = JSON.parse(fs.readFileSync(source, "utf8")) as Array<Record<string, unknown>>;
    catalogResourceSnapshots = new Map(records.map((item) => {
      const route = String(item.route || "").replace(/\/$/, "");
      return [route, {
        static_path: route,
        kind: "catalog_resource_record",
        resource_type: item.resource_type,
        item,
        graph: null,
        linked_sections: [],
        implementation: {},
        legal: {},
      }];
    }));
  }
  return catalogResourceSnapshots.get(pathname) || null;
}

function apiSnapshot(url: string): unknown | null {
  const pathname = url.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";
  const siteRoot = path.join(process.cwd(), "catalog/generated/site");
  if (!catalogVersion) catalogVersion = JSON.parse(fs.readFileSync(path.join(siteRoot, "manifest.json"), "utf8")).snapshot;
  globalThis.__GROUPSUM_CATALOG_VERSION__ = catalogVersion;
  const source = path.join(siteRoot, "read-models.json");
  if (!readModels && fs.existsSync(source)) readModels = JSON.parse(fs.readFileSync(source, "utf8"));
  const member = readModels?.details[pathname];
  if (member) return { ...(member as object), static_path: pathname };
  const collection = readModels?.collections[pathname.replace("/catalog/", "")];
  if (collection) return { ...(collection as object), static_path: pathname };
  if (pathname === "/contributors" || pathname.startsWith("/contributors/")) {
    const people = JSON.parse(fs.readFileSync(path.join(process.cwd(), "catalog/generated/site/contributors.json"), "utf8")) as Array<Record<string, unknown> & { route: string; repositories: unknown[]; account_type: string }>;
    if (pathname === "/contributors") {
      const key = (person: typeof people[number]) => String(person.name || "").toLowerCase();
      const ordered = people.filter((person) => person.account_type === "User").sort((a, b) => Number(b.contributions ?? 0) - Number(a.contributions ?? 0)
        || (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : String(a.id).localeCompare(String(b.id), "en-US")));
      let rank = 0;
      return { static_path: pathname, kind: "contributor_collection", count: ordered.length, page: 1, page_count: Math.max(1, Math.ceil(ordered.length / 50)), account_types: [...new Set(people.map((person) => person.account_type))].sort(), records: ordered.slice(0, 50).map(({ repositories: _repos, ...person }, index) => {
        if (index === 0 || person.contributions !== ordered[index - 1].contributions) rank = index + 1;
        return { ...person, rank };
      }) };
    }
    const person = people.find((item) => item.route === pathname);
    if (!person) return null;
    const { repositories, ...item } = person;
    return { static_path: pathname, kind: "contributor_record", item, repositories };
  }
  const resource = catalogResourceSnapshot(pathname);
  if (resource) return resource;
  const detailMatch = pathname.match(/^\/(products|portfolio)\/records\/([^/]+)$/);
  const collectionMatch = pathname.match(/^\/(products|portfolio)$/);
  const family = detailMatch?.[1] || collectionMatch?.[1];
  if (!family) return null;
  const recordType = family === "products" ? "product" : "portfolio";
  const target = path.join(
    process.cwd(),
    "pkgs",
    "backend",
    "generated",
    "api-snapshots",
    recordType,
    detailMatch ? `${detailMatch[2]}.json` : "index.json",
  );
  return fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, "utf8")) : null;
}

export function getApiSnapshot(url: string): unknown | null {
  const model = apiSnapshot(url);
  return model ? { ...(model as object), static_snapshot_id: catalogVersion?.snapshot_id } : null;
}

export async function render(url: string): Promise<string> {
  globalThis.__GROUPSUM_API_SNAPSHOT__ = getApiSnapshot(url);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
  });
  try {
    const application = (
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    );
    return await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const output = new Writable({ write(chunk, _encoding, next) { chunks.push(Buffer.from(chunk)); next(); } });
      output.on("finish", () => resolve(Buffer.concat(chunks).toString("utf8")));
      output.on("error", reject);
      const stream = renderToPipeableStream(application, {
        onAllReady() { stream.pipe(output); },
        onShellError: reject,
        onError: reject,
      });
    });
  } finally {
    queryClient.clear();
    globalThis.__GROUPSUM_API_SNAPSHOT__ = null;
  }
}

declare global {
  var __GROUPSUM_API_SNAPSHOT__: unknown | null;
}
