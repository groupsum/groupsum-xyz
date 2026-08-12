import fs from "node:fs";
import path from "node:path";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "./router";

import App from "./App";

let catalogResourceSnapshots: Map<string, unknown> | null = null;

function catalogResourceSnapshot(pathname: string): unknown | null {
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

export function getApiSnapshot(url: string): unknown | null {
  const pathname = url.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";
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

export function render(url: string): string {
  globalThis.__GROUPSUM_API_SNAPSHOT__ = getApiSnapshot(url);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
  });
  try {
    return renderToString(
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>,
    );
  } finally {
    globalThis.__GROUPSUM_API_SNAPSHOT__ = null;
  }
}

declare global {
  var __GROUPSUM_API_SNAPSHOT__: unknown | null;
}
