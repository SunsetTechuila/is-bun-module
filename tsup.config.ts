import { defineConfig, type Options } from "tsup";

const baseConfig = {
  entry: ["src/index.ts"],
  target: "es2019",
  dts: true,
  clean: true,
} satisfies Options;

const cjsConfig = {
  ...baseConfig,
  format: "cjs",
  outDir: "dist/cjs",
} satisfies Options;

const esmConfig = {
  ...baseConfig,
  format: "esm",
  outDir: "dist/esm",
} satisfies Options;

export default defineConfig([cjsConfig, esmConfig]);
