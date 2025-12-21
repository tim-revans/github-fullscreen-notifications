import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        extension: resolve(__dirname, "src/extension.ts"),
      },
      output: {
        // MV2 background scripts are classic scripts -> must not contain `import`
        format: "iife",

        // Must match manifest.json exactly
        entryFileNames: "extension.js",

        // Prevent extra chunks (classic scripts can’t import them)
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
  },
});
