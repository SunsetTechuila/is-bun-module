import { defineConfig } from "oxfmt";

export default defineConfig({
  quoteProps: "consistent",
  sortPackageJson: false,
  ignorePatterns: ["node_modules/", "dist/", "bun.lock", "bun-blogs/"],
});
