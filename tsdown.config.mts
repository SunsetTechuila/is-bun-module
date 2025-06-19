import { defineConfig, type UserConfig, type UserConfigFn } from "tsdown";

const sharedConfig = {
  entry: ["src/shared.ts"],
  target: "es2019",
  format: "cjs",
  dts: true,
} satisfies UserConfig;

const genericConfig = {
  entry: ["src/generic.ts"],
  target: "es2019",
  format: "cjs",
  external: ["./shared"],
  dts: true,
} satisfies UserConfig;

const bunConfig = {
  entry: ["src/bun.ts"],
  target: "es2023",
  format: "esm",
  external: ["./shared"],
} satisfies UserConfig;

const config: UserConfig | UserConfigFn = defineConfig([sharedConfig, genericConfig, bunConfig]);
export default config;
