import { WecomConfigError } from './errors';
import type { TokenStore, WecomLogger } from './types';

export const DEFAULT_BASE_URL = 'https://qyapi.weixin.qq.com/cgi-bin/';
export const DEFAULT_RETRY_TIMES = 3;
export const DEFAULT_TIMEOUT = 30_000;

export interface WecomConfig {
  corpId: string;
  corpSecret: string;
  baseURL?: string;
  retryTimes?: number;
  timeout?: number;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
  tokenStore?: TokenStore;
  logger?: WecomLogger;
  signal?: AbortSignal;
}

export interface ResolvedWecomConfig {
  corpId: string;
  corpSecret: string;
  baseURL: string;
  retryTimes: number;
  timeout: number;
  headers: Record<string, string>;
  fetch: typeof fetch;
  tokenStore?: TokenStore;
  logger?: WecomLogger;
  signal?: AbortSignal;
}

const globalConfig: Partial<WecomConfig> = {};

/**
 * @deprecated Prefer passing config to each client constructor.
 */
export function setGlobalConfig(config: Partial<WecomConfig>): void {
  Object.assign(globalConfig, config);
}

export function getGlobalConfig(): Partial<WecomConfig> {
  return { ...globalConfig };
}

export function resetGlobalConfig(): void {
  for (const key of Object.keys(globalConfig) as (keyof WecomConfig)[]) {
    delete globalConfig[key];
  }
}

export function resolveConfig(
  config: Partial<WecomConfig> = {}
): ResolvedWecomConfig {
  const merged: Partial<WecomConfig> = {
    baseURL: DEFAULT_BASE_URL,
    retryTimes: DEFAULT_RETRY_TIMES,
    timeout: DEFAULT_TIMEOUT,
    ...globalConfig,
    ...config,
  };
  merged.headers = {
    ...globalConfig.headers,
    ...config.headers,
  };

  if (!merged.corpId) {
    throw new WecomConfigError('corpId should not be empty');
  }
  if (!merged.corpSecret) {
    throw new WecomConfigError('corpSecret should not be empty');
  }
  if (!merged.baseURL) {
    throw new WecomConfigError('baseURL should not be empty');
  }
  if (
    merged.retryTimes === undefined ||
    !Number.isFinite(merged.retryTimes) ||
    merged.retryTimes < 0
  ) {
    throw new WecomConfigError('retryTimes must be a non-negative number');
  }
  if (
    merged.timeout === undefined ||
    !Number.isFinite(merged.timeout) ||
    merged.timeout <= 0
  ) {
    throw new WecomConfigError('timeout must be a positive number');
  }

  return {
    corpId: merged.corpId,
    corpSecret: merged.corpSecret,
    baseURL: normalizeBaseURL(merged.baseURL),
    retryTimes: merged.retryTimes,
    timeout: merged.timeout,
    headers: merged.headers ?? {},
    fetch: merged.fetch ?? globalThis.fetch.bind(globalThis),
    tokenStore: merged.tokenStore,
    logger: merged.logger,
    signal: merged.signal,
  };
}

export function normalizeBaseURL(baseURL: string): string {
  return baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
}

export function tokenCacheKey(
  corpId: string,
  corpSecret: string,
  baseURL: string
): string {
  return `${corpId}:${corpSecret}:${normalizeBaseURL(baseURL)}`;
}
