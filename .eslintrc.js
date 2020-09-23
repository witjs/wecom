module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
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
//     tsconfigRootDir: "./",
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
