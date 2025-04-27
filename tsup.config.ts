import { defineConfig, type Options } from "tsup";

const sharedConfig = {
  entry: ["src/shared.ts"],
  target: "es2019",
  format: ["cjs"],
  experimentalDts: true,
  clean: true,
} satisfies Options;

const genericConfig = {
  entry: ["src/generic.ts"],
  target: "es2019",
  format: ["cjs"],
  external: ["./shared"],
  experimentalDts: true,
} satisfies Options;

const bunConfig = {
  entry: ["src/bun.ts"],
  target: "es2023",
  format: ["esm"],
  external: ["./shared"],
} satisfies Options;

const config:
  | Options
  | Options[]
  | ((overrideOptions: Options) => Options | Options[] | Promise<Options | Options[]>) =
  defineConfig([sharedConfig, genericConfig, bunConfig]);
export default config;
