import fs from "node:fs";
import path from "node:path";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "./router";

import App from "./App";

export function getPageModel(url: string): unknown | null {
  const pathname = url.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";
  const detailMatch = pathname.match(/^\/(products|portfolio)\/records\/([^/]+)$/);
  const collectionMatch = pathname.match(/^\/(products|portfolio)$/);
  const family = detailMatch?.[1] || collectionMatch?.[1];
  if (!family) return null;
  const recordType = family === "products" ? "product" : "portfolio";
  const target = path.join(
    process.cwd(),
    "backend",
    "generated",
    "page-models",
    recordType,
    detailMatch ? `${detailMatch[2]}.json` : "index.json",
  );
  return fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, "utf8")) : null;
}

export function render(url: string): string {
  globalThis.__GROUPSUM_PAGE_MODEL__ = getPageModel(url);
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
    globalThis.__GROUPSUM_PAGE_MODEL__ = null;
  }
}

declare global {
  var __GROUPSUM_PAGE_MODEL__: unknown | null;
}
