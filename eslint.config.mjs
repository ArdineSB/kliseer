import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['presentation/tooling/**/*.cjs'],
    // These explicit CommonJS entrypoints use require() as their module system.
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "landing/dist/**",
    "landing/.astro/**",
    "landing/public/motion/**",
    ".agents/**",
    ".claude/**",
  ]),
]);

export default eslintConfig;
