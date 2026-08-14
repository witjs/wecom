import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.spec.ts'],
    exclude:
      process.env.WECOM_INTEGRATION === '1' ? [] : ['test/integration/**'],
    restoreMocks: true,
  },
});
