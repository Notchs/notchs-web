import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

// A module is consumed only through its index.ts; its internals stay private.
const moduleInternals = {
  group: ["@/modules/*/**"],
  message: "Import from the module's public API (@/modules/<name>) instead.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-imports": ["error", { patterns: [moduleInternals] }],
    },
  },
  {
    // Shared and config code must stay independent of feature modules.
    files: ["src/shared/**", "src/config/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules", "@/modules/**"],
              message: "Shared and config code cannot depend on a module.",
            },
          ],
        },
      ],
    },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
