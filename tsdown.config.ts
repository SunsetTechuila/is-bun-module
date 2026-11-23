import { defineConfig, type UserConfig } from "tsdown";

const config = {
  entry: ["src/index.ts"],
  target: "es2022",
  format: "esm",
  platform: "neutral",
  dts: true,
  deps: { resolveDepSubpath: true },
} as const satisfies UserConfig;

export default defineConfig(config);
