import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": { target: process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:8000", changeOrigin: true },
      "/openapi.json": { target: process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:8000", changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(frontendDir, "."),
      "mdwrk/renderer-core": path.resolve(frontendDir, "./src/mdwrk/renderer-core/index.tsx"),
    },
  },
  build: {
    chunkSizeWarningLimit: 256,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) return "react-runtime";
          if (id.includes("node_modules/@tanstack/react-query") || id.includes("node_modules/@tanstack/query-core")) return "query-runtime";
          if (id.includes("node_modules/lucide-react")) return "icons";
          if (id.includes("/src/mdwrk/")) return "mdwrk-runtime";
          if (id.includes("/src/features/catalog/SsotEntityDetail")) return "ssot-detail";
          if (/\/src\/features\/catalog\/RepositoryPackages(Inspector|Panel)/.test(id)) return "package-inspector";
          if (/\/src\/features\/catalog\/(PackageRelationships|PackageReleaseHistory|ActivityInspector|InspectorPopover)/.test(id)) return "catalog-inspectors";
          if (/\/src\/features\/catalog\/Contributor(Profile|Directory|TypeBadge|Activity)/.test(id)) return "contributor-pages";
          if (id.includes("/src/features/catalog/CatalogFreshness")) return "catalog-freshness";
          if (/\/src\/features\/catalog\/(CatalogCollectionTables|RepositoryPackagesCell|PackageDependenciesCell)/.test(id)) return "catalog-tables";
          if (id.endsWith("/src/features/catalog/TrendDelta.tsx")) return "catalog-trend-delta";
          if (id.includes("/src/features/catalog/")) return "catalog-ui";
          return undefined;
        },
      },
    },
  },
});
