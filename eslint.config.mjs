import { fileURLToPath } from "node:url";
import path from "path";

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import labsetEslint from "@labset-eslint/eslint-plugin";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["node_modules", "dist", "coverage"],
  },
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
    ),
  ),
  {
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
      "@labset-eslint": labsetEslint,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          modules: true,
        },
      },
    },

    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },

    rules: {
      "@labset-eslint/license-notice": [
        "error",
        {
          license: "Apache-2.0",
          copyRightYear: "2025",
          copyRightName: "Hasnae Rehioui",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "_",
        },
      ],
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroupsExcludedImportTypes: ["builtin"],
          pathGroups: [
            {
              pattern: "{react,react-*}",
              group: "external",
              position: "before",
            },
          ],
        },
      ],
    },
  },
];
