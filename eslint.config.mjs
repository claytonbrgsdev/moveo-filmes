import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Experimental/reference code
    "extras/**",
    // Backup pages
    "app/backup-home/**",
    "app/backup-home-containers/**",
    // Backup slug directories
    "app/empresa/[slug].backup/**",
    "app/filme/[slug].backup/**",
    "app/pessoa/[slug].backup/**",
  ]),
]);

export default eslintConfig;
