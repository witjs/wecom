module.exports = {
  root: true,
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    '@tencent/eslint-config-tencent',
    '@tencent/eslint-config-tencent/ts',
    '@tencent/eslint-config-tencent/prettier',
  ],
  rules: {
    '@typescript-eslint/no-namespace': 'off',
  },
};
