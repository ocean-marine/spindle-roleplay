import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const path = fileURLToPath(import.meta.url);
const __dirname = dirname(path);

export default defineConfig({
  root: join(__dirname, "client"),
  plugins: [react()],
  build: {
    outDir: join(__dirname, "dist"),
    emptyOutDir: true,
  },
  publicDir: join(__dirname, "client/assets"),
  base: "/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "client"),
    },
  },
});