import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      }
    }
  }
});