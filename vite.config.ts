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
        content: resolve(__dirname, "src/content.ts"),
      },
      output: {
        // MV2 background scripts are classic scripts -> must not contain `import`
        format: "es",

        // Must match manifest.json exactly
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'extension') return 'extension.js';
          if (chunkInfo.name === 'content') return 'content.js';
          return '[name].js';
        },

        // Prevent extra chunks (classic scripts can’t import them)
        manualChunks: undefined,
        inlineDynamicImports: false,
      },
    },
  },
});
