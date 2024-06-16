// @ts-check

import eslint from "@eslint/js";
import typescript from "typescript-eslint";
import configPrettier from "eslint-config-prettier";

export default typescript.config({
  extends: [
    eslint.configs.recommended,
    ...typescript.configs.recommendedTypeChecked,
    ...typescript.configs.stylisticTypeChecked,
    configPrettier,
  ],
  plugins: {
    "@typescript-eslint": typescript.plugin,
  },
  languageOptions: {
    parser: typescript.parser,
    parserOptions: {
      tsconfigRootDir: import.meta.dir,
      project: "./tsconfig.json",
    },
  },
  ignores: ["node_modules/**", "dist/**", "eslint.config.mjs"],
});
