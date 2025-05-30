import { defineConfig, type Options, type UserConfig, type UserConfigFn } from "tsdown";

const sharedConfig = {
  entry: ["src/shared.ts"],
  target: "es2019",
  format: ["cjs"],
  dts: true,
  clean: true,
} satisfies Options;

const genericConfig = {
  entry: ["src/generic.ts"],
  target: "es2019",
  format: ["cjs"],
  external: ["./shared"],
  dts: true,
} satisfies Options;

const bunConfig = {
  entry: ["src/bun.ts"],
  target: "es2023",
  format: ["esm"],
  external: ["./shared"],
} satisfies Options;

const config: UserConfig | UserConfigFn = defineConfig([sharedConfig, genericConfig, bunConfig]);
export default config;
