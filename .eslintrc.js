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
  },
  plugins: ["@typescript-eslint", "import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-namespace": "off",
  },
};
// module.exports = {
//   settings: {
//     "import/resolver": {
//       typescript: {},
//     },
//   },
//   parser: "@typescript-eslint/parser",
//   parserOptions: {
//     project: "./tsconfig.json",
//   },
//   plugins: ["@typescript-eslint", "import"],
//   extends: [
//     "plugin:@typescript-eslint/recommended",
//     "plugin:@typescript-eslint/recommended-requiring-type-checking",
//   ],
//   rules: {
//     "@typescript-eslint/no-namespace": "off",
//   },
// };
