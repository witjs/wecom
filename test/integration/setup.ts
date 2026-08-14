import { existsSync } from 'node:fs';
import { expect } from 'vitest';
import { WecomApiError } from '../../src';
import type { BaseRet, WecomConfig } from '../../src';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const UNAVAILABLE_ERRCODES = new Set([
  46003, 48002, 60011, 60020, 81011, 81013, 301002, 301012, 301055,
]);

export function env(name: string): string | undefined {
  const value = process.env[name];
  return value ? value : undefined;
}

export function integrationEnabled(): boolean {
  return (
    process.env.WECOM_INTEGRATION === '1' &&
    Boolean(env('CORPID') && (env('TEST_SECRET') || env('DIRECTORY_SECRET')))
  );
}

export function requireEnv(name: string): string {
  const value = env(name);
  if (!value) {
    throw new Error(`Missing required env ${name}`);
  }
  return value;
}

export function hasDirectorySecret(): boolean {
  return Boolean(env('DIRECTORY_SECRET'));
}

export function hasAppSecret(): boolean {
  return Boolean(env('TEST_SECRET') && env('TEST_AGENT_ID'));
}

export function hasCheckinSecret(): boolean {
  return Boolean(env('CHECKIN_SECRET'));
}

export function directoryConfig(): WecomConfig {
  return {
    corpId: requireEnv('CORPID'),
    corpSecret: requireEnv('DIRECTORY_SECRET'),
  };
}

export function appConfig(): WecomConfig {
  return {
    corpId: requireEnv('CORPID'),
    corpSecret: requireEnv('TEST_SECRET'),
  };
}

export function appAgentConfig(): WecomConfig & { agentId: number } {
  return {
    ...appConfig(),
    agentId: Number(requireEnv('TEST_AGENT_ID')),
  };
}

export function checkinConfig(): WecomConfig {
  return {
    corpId: requireEnv('CORPID'),
    corpSecret: requireEnv('CHECKIN_SECRET'),
  };
}

export function expectOk<T extends BaseRet>(ret: T): T {
  expect(ret.errcode).toBe(0);
  return ret;
}

export function isCapabilityUnavailable(error: unknown): boolean {
  return (
    error instanceof WecomApiError && UNAVAILABLE_ERRCODES.has(error.errcode)
  );
}

export async function expectOkOrUnavailable<T extends BaseRet>(
  run: () => Promise<T>
): Promise<T | undefined> {
  try {
    return expectOk(await run());
  } catch (error) {
    if (isCapabilityUnavailable(error)) {
      return undefined;
    }
    throw error;
  }
}

export function unixDaysAgo(days: number): {
  starttime: number;
  endtime: number;
} {
  const endtime = Math.floor(Date.now() / 1000);
  return {
    starttime: endtime - days * 24 * 60 * 60,
    endtime,
  };
}
