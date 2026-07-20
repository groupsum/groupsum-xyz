import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "mdwrk/renderer-core": path.resolve(__dirname, "./src/mdwrk/renderer-core/index.tsx"),
      "mdwrk/structured-data": path.resolve(__dirname, "./src/mdwrk/structured-data/index.tsx"),
    },
  },
});
