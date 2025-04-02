import { defineConfig } from "vite";

export const viteConfig = {
  root: "src/",
  publicDir: "../static/",
  base: "./",
};

export default defineConfig({
  server: {
    port: 3000,
  },
});
