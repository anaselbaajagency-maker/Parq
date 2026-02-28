import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated mobile builds (Capacitor/Android) should not be linted.
    "android/**",
    // Old backup folder (keep for reference, do not lint).
    "src/app/**/_tableau-de-bord_backup/**",
  ]),
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    rules: {
      // Node scripts in this repo still use CommonJS.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Keep CI green while we incrementally replace `any` with real types.
      "@typescript-eslint/no-explicit-any": "warn",
      // Some screens use `@ts-ignore` for route typing; keep as warning for now.
      "@typescript-eslint/ban-ts-comment": "warn",
      // This rule is too strict for current patterns (mounted flags, UI effects).
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
