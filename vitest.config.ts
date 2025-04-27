import { defineConfig } from "vitest/config";
import type { UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: UserConfig = defineConfig({
  plugins: [tsconfigPaths()],
});
export default config;
