import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  MemoryTokenStore,
  Wecom,
  WecomApiError,
  WecomConfigError,
  WecomHttpError,
  WecomNetworkError,
  WecomTimeoutError,
} from '../../src';
import { getGlobalConfig } from '../../src/core/config';
import {
  createMockFetch,
  createWecomFetch,
  jsonResponse,
  resetSdkState,
} from '../helpers/mock-fetch';

const baseConfig = {
  corpId: 'ww-corp',
  corpSecret: 'secret',
};

afterEach(() => {
  resetSdkState();
});

describe('Wecom config', () => {
  it('throws when corpId is missing', () => {
    expect(() => new Wecom({ corpSecret: 'secret' })).toThrow(WecomConfigError);
  });

  it('throws when corpSecret is missing', () => {
    expect(() => new Wecom({ corpId: 'ww-corp' })).toThrow(WecomConfigError);
  });

  it('allows retryTimes 0', () => {
    const { fetch } = createWecomFetch();
    expect(
      () => new Wecom({ ...baseConfig, retryTimes: 0, fetch })
    ).not.toThrow();
  });

  it('uses official defaults', () => {
    const { fetch } = createWecomFetch();
    const wecom = new Wecom({ ...baseConfig, fetch });
    expect(wecom.config.baseURL).toBe('https://qyapi.weixin.qq.com/cgi-bin/');
    expect(wecom.config.retryTimes).toBe(3);
    expect(wecom.config.timeout).toBe(30_000);
  });

  it('merges setGlobal into instance config', () => {
    Wecom.setGlobal({ corpId: 'global-corp', corpSecret: 'global-secret' });
    const { fetch } = createWecomFetch();
    const wecom = new Wecom({ fetch });
    expect(wecom.config.corpId).toBe('global-corp');
    expect(wecom.config.corpSecret).toBe('global-secret');
    expect(getGlobalConfig().corpId).toBe('global-corp');
  });
});

describe('Wecom request', () => {
  it('injects access_token on non-gettoken requests', async () => {
    const { fetch, calls } = createWecomFetch({
      get: () => ({ errcode: 0, errmsg: 'ok', userid: 'alice' }),
    });
    const wecom = new Wecom({ ...baseConfig, fetch });
    await wecom.request({ url: '/user/get', params: { userid: 'alice' } });
    expect(calls[0].url.pathname).toContain('gettoken');
    expect(calls[0].url.searchParams.get('corpid')).toBe('ww-corp');
    expect(calls[0].url.searchParams.get('corpsecret')).toBe('secret');
    expect(calls[1].url.searchParams.get('access_token')).toBe('token-1');
    expect(calls[1].url.searchParams.has('corpid')).toBe(false);
  });

  it('does not inject token on gettoken', async () => {
    const { fetch, calls } = createWecomFetch();
    const wecom = new Wecom({ ...baseConfig, fetch });
    await wecom.getToken();
    expect(calls).toHaveLength(1);
    expect(calls[0].url.searchParams.has('access_token')).toBe(false);
  });

  it('skips auth when skipAuth is set', async () => {
    const { fetch, calls } = createWecomFetch();
    const wecom = new Wecom({ ...baseConfig, fetch });
    await wecom.request({ url: '/debug/echo', skipAuth: true });
    expect(calls).toHaveLength(1);
    expect(calls[0].url.pathname).toContain('/debug/echo');
    expect(calls[0].url.searchParams.has('access_token')).toBe(false);
  });

  it('does not mutate caller params when injecting the token', async () => {
    const { fetch } = createWecomFetch({
      get: () => ({ errcode: 0, errmsg: 'ok' }),
    });
    const wecom = new Wecom({ ...baseConfig, fetch });
    const params = { userid: 'alice' };
    await wecom.request({ url: '/user/get', params });
    expect(params).toEqual({ userid: 'alice' });
  });

  it('attaches requestId from response headers to API errors', async () => {
    const { fetch } = createWecomFetch({
      get: () =>
        jsonResponse(
          { errcode: 60003, errmsg: 'invalid user' },
          { headers: { 'x-request-id': 'req-42' } }
        ),
    });
    const wecom = new Wecom({ ...baseConfig, fetch });
    await expect(
      wecom.request({ url: '/user/get', params: { userid: 'missing' } })
    ).rejects.toMatchObject({
      name: 'WecomApiError',
      requestId: 'req-42',
    });
  });

  it('throws without retry when gettoken response omits access_token', async () => {
    const { fetch, calls } = createMockFetch(() => ({
      errmsg: '',
    }));
    const wecom = new Wecom({ ...baseConfig, fetch });
    await expect(wecom.getToken()).rejects.toMatchObject({
      name: 'WecomApiError',
      errmsg: 'Failed to get access_token',
      retryable: false,
    });
    expect(calls).toHaveLength(1);
  });

  it('returns unwrapped business data', async () => {
    const { fetch } = createWecomFetch({
      get: () => ({ errcode: 0, errmsg: 'ok', userid: 'alice' }),
    });
    const wecom = new Wecom({ ...baseConfig, fetch });
    await expect(
      wecom.request({ url: '/user/get', params: { userid: 'alice' } })
    ).resolves.toMatchObject({ userid: 'alice', errcode: 0 });
  });

  it('throws WecomApiError on business errcode', async () => {
    const { fetch, calls } = createWecomFetch({
      get: () => ({ errcode: 60003, errmsg: 'invalid user' }),
    });
    const wecom = new Wecom({ ...baseConfig, fetch });
    await expect(
      wecom.request({ url: '/user/get', params: { userid: 'missing' } })
    ).rejects.toMatchObject({
      name: 'WecomApiError',
      errcode: 60003,
    });
    expect(
      calls.filter((call) => call.url.pathname.includes('user/get'))
    ).toHaveLength(1);
  });

  it('refreshes token and retries on errcode 42001', async () => {
    let tokenCalls = 0;
    let userCalls = 0;
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        tokenCalls += 1;
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: `token-${tokenCalls}`,
          expires_in: 7200,
        };
      }
      userCalls += 1;
      if (userCalls === 1) {
        return { errcode: 42001, errmsg: 'access_token expired' };
      }
      return { errcode: 0, errmsg: 'ok', userid: 'alice' };
    });
    const wecom = new Wecom({ ...baseConfig, fetch });
    await expect(
      wecom.request({ url: '/user/get', params: { userid: 'alice' } })
    ).resolves.toMatchObject({ userid: 'alice' });
    expect(tokenCalls).toBe(2);
    expect(userCalls).toBe(2);
  });

  it('refreshes token and retries on errcode 40014', async () => {
    let tokenCalls = 0;
    let userCalls = 0;
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        tokenCalls += 1;
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: `token-${tokenCalls}`,
          expires_in: 7200,
        };
      }
      userCalls += 1;
      if (userCalls === 1) {
        return { errcode: 40014, errmsg: 'invalid token' };
      }
      return { errcode: 0, errmsg: 'ok', userid: 'alice' };
    });
    const wecom = new Wecom({ ...baseConfig, fetch });
    await expect(
      wecom.request({ url: '/user/get', params: { userid: 'alice' } })
    ).resolves.toMatchObject({ userid: 'alice' });
    expect(tokenCalls).toBe(2);
    expect(userCalls).toBe(2);
  });

  it('retries on HTTP 401 after clearing token', async () => {
    let tokenCalls = 0;
    let userCalls = 0;
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        tokenCalls += 1;
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: `token-${tokenCalls}`,
          expires_in: 7200,
        };
      }
      userCalls += 1;
      if (userCalls === 1) {
        return jsonResponse({ errcode: 0, errmsg: 'ok' }, { status: 401 });
      }
      return { errcode: 0, errmsg: 'ok', userid: 'alice' };
    });
    const wecom = new Wecom({ ...baseConfig, fetch });
    await expect(
      wecom.request({ url: '/user/get', params: { userid: 'alice' } })
    ).resolves.toMatchObject({ userid: 'alice' });
    expect(tokenCalls).toBe(2);
  });

  it('retries retryable HTTP 429 then succeeds', async () => {
    let userCalls = 0;
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      userCalls += 1;
      if (userCalls === 1) {
        return jsonResponse({ message: 'slow down' }, { status: 429 });
      }
      return { errcode: 0, errmsg: 'ok', userid: 'alice' };
    });
    const wecom = new Wecom({ ...baseConfig, retryTimes: 1, fetch });
    await expect(
      wecom.request({ url: '/user/get', params: { userid: 'alice' } })
    ).resolves.toMatchObject({ userid: 'alice' });
    expect(userCalls).toBe(2);
  });

  it('retries a network error then succeeds', async () => {
    let userCalls = 0;
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      userCalls += 1;
      if (userCalls === 1) {
        throw new Error('ECONNRESET');
      }
      return { errcode: 0, errmsg: 'ok', userid: 'alice' };
    });
    const wecom = new Wecom({ ...baseConfig, retryTimes: 1, fetch });
    await expect(
      wecom.request({ url: '/user/get', params: { userid: 'alice' } })
    ).resolves.toMatchObject({ userid: 'alice' });
    expect(userCalls).toBe(2);
  });

  it('does not retry a non-retryable API error', async () => {
    const { fetch, calls } = createWecomFetch({
      get: () => ({ errcode: 60003, errmsg: 'invalid user' }),
    });
    const wecom = new Wecom({ ...baseConfig, retryTimes: 2, fetch });
    await expect(
      wecom.request({ url: '/user/get', params: { userid: 'missing' } })
    ).rejects.toBeInstanceOf(WecomApiError);
    expect(
      calls.filter((call) => call.url.pathname.includes('user/get'))
    ).toHaveLength(1);
  });

  it('stops retrying after retryTimes', async () => {
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      return { errcode: 45009, errmsg: 'api freq out of limit' };
    });
    const wecom = new Wecom({ ...baseConfig, retryTimes: 1, fetch });
    await expect(wecom.request({ url: '/user/get' })).rejects.toBeInstanceOf(
      WecomApiError
    );
  });

  it('throws WecomHttpError on HTTP 500 without errcode', async () => {
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      return jsonResponse({ message: 'oops' }, { status: 500 });
    });
    const wecom = new Wecom({ ...baseConfig, retryTimes: 0, fetch });
    await expect(wecom.request({ url: '/user/get' })).rejects.toBeInstanceOf(
      WecomHttpError
    );
  });

  it('throws WecomTimeoutError when request times out', async () => {
    const { fetch } = createMockFetch(async (request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { errcode: 0, errmsg: 'ok' };
    });
    const wecom = new Wecom({
      ...baseConfig,
      fetch,
      timeout: 10,
      retryTimes: 0,
    });
    await expect(wecom.request({ url: '/user/get' })).rejects.toBeInstanceOf(
      WecomTimeoutError
    );
  });

  it('throws WecomNetworkError when fetch fails and retries are exhausted', async () => {
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      throw new Error('dns failed');
    });
    const wecom = new Wecom({ ...baseConfig, fetch, retryTimes: 0 });
    await expect(wecom.request({ url: '/user/get' })).rejects.toBeInstanceOf(
      WecomNetworkError
    );
  });

  it('does not retry after user abort', async () => {
    const controller = new AbortController();
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      controller.abort();
      throw new DOMException('Aborted', 'AbortError');
    });
    const wecom = new Wecom({ ...baseConfig, fetch, retryTimes: 2 });
    await expect(
      wecom.request({ url: '/user/get', signal: controller.signal })
    ).rejects.toMatchObject({ name: 'WecomAbortError', retryable: false });
  });
});

describe('Wecom token cache', () => {
  it('does not share tokens across different credentials', async () => {
    const { fetch, calls } = createWecomFetch();
    const first = new Wecom({ ...baseConfig, fetch });
    const second = new Wecom({
      corpId: 'other-corp',
      corpSecret: 'secret',
      fetch,
    });
    await first.getToken();
    await second.getToken();
    expect(
      calls.filter((call) => call.url.pathname.includes('gettoken'))
    ).toHaveLength(2);
  });

  it('shares tokens when only the baseURL trailing slash differs', async () => {
    const { fetch, calls } = createWecomFetch();
    const first = new Wecom({
      ...baseConfig,
      baseURL: 'https://qyapi.weixin.qq.com/cgi-bin',
      fetch,
    });
    const second = new Wecom({
      ...baseConfig,
      baseURL: 'https://qyapi.weixin.qq.com/cgi-bin/',
      fetch,
    });
    await first.getToken();
    await second.getToken();
    expect(
      calls.filter((call) => call.url.pathname.includes('gettoken'))
    ).toHaveLength(1);
  });

  it('isolates tokens when a custom store is provided', async () => {
    const { fetch, calls } = createWecomFetch();
    const store = new MemoryTokenStore();
    const custom = new Wecom({ ...baseConfig, fetch, tokenStore: store });
    const shared = new Wecom({ ...baseConfig, fetch });
    await custom.getToken();
    await shared.getToken();
    expect(
      calls.filter((call) => call.url.pathname.includes('gettoken'))
    ).toHaveLength(2);
  });

  it('reuses a custom store across instances', async () => {
    const { fetch, calls } = createWecomFetch();
    const store = new MemoryTokenStore();
    const first = new Wecom({ ...baseConfig, fetch, tokenStore: store });
    const second = new Wecom({ ...baseConfig, fetch, tokenStore: store });
    await first.getToken();
    await second.getToken();
    expect(
      calls.filter((call) => call.url.pathname.includes('gettoken'))
    ).toHaveLength(1);
  });

  it('shares tokens across instances with the same credentials', async () => {
    const { fetch, calls } = createWecomFetch();
    const first = new Wecom({ ...baseConfig, fetch });
    const second = new Wecom({ ...baseConfig, fetch });
    await first.getToken();
    await second.getToken();
    expect(
      calls.filter((call) => call.url.pathname.includes('gettoken'))
    ).toHaveLength(1);
  });

  it('coalesces concurrent token refreshes', async () => {
    let tokenCalls = 0;
    const { fetch } = createMockFetch(async (request) => {
      if (request.url.pathname.includes('gettoken')) {
        tokenCalls += 1;
        await new Promise((resolve) => setTimeout(resolve, 20));
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'shared-token',
          expires_in: 7200,
        };
      }
      return { errcode: 0, errmsg: 'ok' };
    });
    const wecom = new Wecom({ ...baseConfig, fetch });
    await Promise.all([
      wecom.request({ url: '/user/get', params: { userid: 'a' } }),
      wecom.request({ url: '/user/get', params: { userid: 'b' } }),
    ]);
    expect(tokenCalls).toBe(1);
  });
});

describe('Wecom logger', () => {
  it('invokes logger hooks', async () => {
    const logger = {
      debug: vi.fn(),
      warn: vi.fn(),
    };
    const { fetch } = createWecomFetch();
    const wecom = new Wecom({ ...baseConfig, fetch, logger });
    await wecom.getToken();
    expect(logger.debug).toHaveBeenCalled();
  });

  it('warns when retrying a recoverable error', async () => {
    const logger = {
      debug: vi.fn(),
      warn: vi.fn(),
    };
    let userCalls = 0;
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      userCalls += 1;
      if (userCalls === 1) {
        return { errcode: 45009, errmsg: 'api freq out of limit' };
      }
      return { errcode: 0, errmsg: 'ok' };
    });
    const wecom = new Wecom({ ...baseConfig, fetch, logger, retryTimes: 1 });
    await wecom.request({ url: '/user/get' });
    expect(logger.warn).toHaveBeenCalledWith(
      'wecom.retry',
      expect.objectContaining({ url: '/user/get', retriesLeft: 1 })
    );
  });
});
