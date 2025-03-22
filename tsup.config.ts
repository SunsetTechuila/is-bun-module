import { defineConfig, type Options } from "tsup";

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
  target: "es2022",
  format: ["esm"],
  external: ["./shared"],
} satisfies Options;

export default defineConfig([sharedConfig, genericConfig, bunConfig]);
