import { existsSync } from 'node:fs';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

export function integrationEnabled(): boolean {
  return (
    process.env.WECOM_INTEGRATION === '1' &&
    Boolean(process.env.CORPID && process.env.TEST_SECRET)
  );
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env ${name}`);
  }
  return value;
}
