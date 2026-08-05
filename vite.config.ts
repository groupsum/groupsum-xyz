import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:8000",
      "/openapi.json": process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:8000",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "mdwrk/renderer-core": path.resolve(__dirname, "./src/mdwrk/renderer-core/index.tsx"),
      "mdwrk/structured-data": path.resolve(__dirname, "./src/mdwrk/structured-data/index.tsx"),
    },
  },
  build: {
    chunkSizeWarningLimit: 256,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) return "react-runtime";
          if (id.includes("node_modules/lucide-react")) return "icons";
          if (id.includes("/src/mdwrk/")) return "mdwrk-runtime";
          return undefined;
        },
      },
    },
  },
});
