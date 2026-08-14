module.exports = {
  root: true,
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: "./",
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/quotes": ["error", "single", { avoidEscape: true }],
    "@typescript-eslint/dot-notation": "error",
  },
};
