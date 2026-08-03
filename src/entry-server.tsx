import fs from "node:fs";
import path from "node:path";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "./router";

import App from "./App";

export function getPageModel(url: string): unknown | null {
  const match = url.match(/^\/products\/records\/([^/?#]+)/);
  if (!match) return null;
  const target = path.join(
    process.cwd(),
    "backend",
    "generated",
    "page-models",
    "product",
    `${match[1]}.json`,
  );
  return fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, "utf8")) : null;
}

export function render(url: string): string {
  globalThis.__GROUPSUM_PAGE_MODEL__ = getPageModel(url);
  try {
    return renderToString(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
    );
  } finally {
    globalThis.__GROUPSUM_PAGE_MODEL__ = null;
  }
}

declare global {
  var __GROUPSUM_PAGE_MODEL__: unknown | null;
}
