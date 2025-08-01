// @ts-check

import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import configPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  configPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mjs"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  globalIgnores(["node_modules/", "dist/"]),
);
