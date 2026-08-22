import { afterEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_BASE_URL,
  DEFAULT_RETRY_TIMES,
  DEFAULT_TIMEOUT,
  getGlobalConfig,
  normalizeBaseURL,
  resetGlobalConfig,
  resolveConfig,
  setGlobalConfig,
  corpTokenCacheKey,
  pickHttpConfig,
} from '../../src/core/config';
import { WecomConfigError } from '../../src';

const credentials = {
  corpId: 'ww-corp',
  corpSecret: 'secret',
};

afterEach(() => {
  resetGlobalConfig();
});

describe('resolveConfig', () => {
  it('applies official defaults', () => {
    const config = resolveConfig(credentials);
    expect(config.baseURL).toBe(DEFAULT_BASE_URL);
    expect(config.retryTimes).toBe(DEFAULT_RETRY_TIMES);
    expect(config.timeout).toBe(DEFAULT_TIMEOUT);
    expect(config.headers).toEqual({});
    expect(typeof config.fetch).toBe('function');
  });

  it('throws when corpId is missing', () => {
    expect(() => resolveConfig({ corpSecret: 'secret' })).toThrow(
      WecomConfigError
    );
  });

  it('throws when corpSecret is missing', () => {
    expect(() => resolveConfig({ corpId: 'ww-corp' })).toThrow(
      WecomConfigError
    );
  });

  it('allows tokenProvider without corp credentials', () => {
    const config = resolveConfig({
      tokenProvider: {
        cacheKey: 'suite:ww:secret:https://qyapi.weixin.qq.com/cgi-bin/',
        tokenParam: 'suite_access_token',
        fetch: async () => ({ accessToken: 'suite', expiresIn: 7200 }),
      },
    });
    expect(config.corpId).toBe('');
    expect(config.tokenParam).toBe('suite_access_token');
    expect(config.tokenCacheKey).toBe(
      'suite:ww:secret:https://qyapi.weixin.qq.com/cgi-bin/'
    );
  });

  it('prefixes corp token cache keys', () => {
    const config = resolveConfig(credentials);
    expect(config.tokenCacheKey).toBe(
      corpTokenCacheKey('ww-corp', 'secret', DEFAULT_BASE_URL)
    );
    expect(config.tokenParam).toBe('access_token');
  });

  it('throws when baseURL is empty', () => {
    expect(() => resolveConfig({ ...credentials, baseURL: '' })).toThrow(
      /baseURL/
    );
  });

  it('throws when retryTimes is negative or not finite', () => {
    expect(() => resolveConfig({ ...credentials, retryTimes: -1 })).toThrow(
      /retryTimes/
    );
    expect(() =>
      resolveConfig({ ...credentials, retryTimes: Number.NaN })
    ).toThrow(/retryTimes/);
  });

  it('allows retryTimes 0', () => {
    expect(resolveConfig({ ...credentials, retryTimes: 0 }).retryTimes).toBe(0);
  });

  it('throws when timeout is not a positive number', () => {
    expect(() => resolveConfig({ ...credentials, timeout: 0 })).toThrow(
      /timeout/
    );
    expect(() => resolveConfig({ ...credentials, timeout: -10 })).toThrow(
      /timeout/
    );
  });

  it('merges global config under instance config', () => {
    setGlobalConfig({
      corpId: 'global-corp',
      corpSecret: 'global-secret',
      headers: { 'X-Global': '1', 'X-Shared': 'global' },
      timeout: 5_000,
    });
    const config = resolveConfig({
      corpSecret: 'local-secret',
      headers: { 'X-Shared': 'local', 'X-Local': '2' },
    });
    expect(config.corpId).toBe('global-corp');
    expect(config.corpSecret).toBe('local-secret');
    expect(config.timeout).toBe(5_000);
    expect(config.headers).toEqual({
      'X-Global': '1',
      'X-Shared': 'local',
      'X-Local': '2',
    });
  });

  it('normalizes baseURL without a trailing slash', () => {
    const config = resolveConfig({
      ...credentials,
      baseURL: 'https://example.test/cgi-bin',
    });
    expect(config.baseURL).toBe('https://example.test/cgi-bin/');
  });
});

describe('global config helpers', () => {
  it('returns a shallow copy from getGlobalConfig', () => {
    setGlobalConfig({ corpId: 'ww-corp' });
    const snapshot = getGlobalConfig();
    snapshot.corpId = 'mutated';
    expect(getGlobalConfig().corpId).toBe('ww-corp');
  });

  it('clears all keys on reset', () => {
    setGlobalConfig({ corpId: 'ww-corp', corpSecret: 'secret' });
    resetGlobalConfig();
    expect(getGlobalConfig()).toEqual({});
  });
});

describe('pickHttpConfig', () => {
  it('omits undefined fields so defaults survive', () => {
    expect(pickHttpConfig({ fetch: globalThis.fetch })).toEqual({
      fetch: globalThis.fetch,
    });
    expect(
      resolveConfig({
        tokenProvider: {
          cacheKey: 'suite:id:secret:https://qyapi.weixin.qq.com/cgi-bin/',
          fetch: async () => ({ accessToken: 't', expiresIn: 1 }),
        },
        ...pickHttpConfig({ fetch: globalThis.fetch }),
      }).baseURL
    ).toBe(DEFAULT_BASE_URL);
  });
});

describe('url helpers', () => {
  it('keeps an already-normalized baseURL', () => {
    expect(normalizeBaseURL('https://qyapi.weixin.qq.com/cgi-bin/')).toBe(
      'https://qyapi.weixin.qq.com/cgi-bin/'
    );
  });

  it('uses the normalized baseURL in the token cache key', () => {
    expect(
      corpTokenCacheKey('id', 'secret', 'https://qyapi.weixin.qq.com/cgi-bin')
    ).toBe(
      corpTokenCacheKey('id', 'secret', 'https://qyapi.weixin.qq.com/cgi-bin/')
    );
    expect(
      corpTokenCacheKey('id', 'secret', 'https://qyapi.weixin.qq.com/cgi-bin/')
    ).toBe('corp:id:secret:https://qyapi.weixin.qq.com/cgi-bin/');
  });
});
