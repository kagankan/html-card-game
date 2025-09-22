/** @type { import("eslint").Linter.Config } */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
