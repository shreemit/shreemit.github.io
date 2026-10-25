import { defineConfig } from "vite";
import { blogPlugin } from "./scripts/blog.mjs";

export default defineConfig({
  base: "/",
  plugins: [blogPlugin()],
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
  },
});
