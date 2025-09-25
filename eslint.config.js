import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Ignore common files and directories
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
      "**/.svelte-kit/**",
      "**/package/**",
      "next-env.d.ts",
      "**/.DS_Store",
      ".env",
      ".env.*",
      "!.env.example",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
    ],
  },
  // Apply to all JS/TS/JSX/TSX files
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2017,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      // ESLint recommended rules
      ...js.configs.recommended.rules,
      // TypeScript ESLint recommended rules
      ...tseslint.configs.recommended.rules,
      // Next.js core web vitals rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // React hooks rules
      ...reactHooks.configs.recommended.rules,
    },
  },
  // Prettier config should be last to override other formatting rules
  prettierConfig,
];
