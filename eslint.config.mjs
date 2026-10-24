import js from "@eslint/js";
import labsetEslint from "@labset-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["node_modules", "dist", "coverage"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    plugins: {
      "@labset-eslint": labsetEslint,
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
);
