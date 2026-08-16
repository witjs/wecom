import { afterEach, describe, expect, it } from 'vitest';
import { MemoryTokenStore } from '../../src';
import { tokenCacheKey } from '../../src/core/config';
import { getTokenManager, resetTokenManagers } from '../../src/core/token';

const credentials = {
  corpId: 'ww-corp',
  corpSecret: 'secret',
  baseURL: 'https://qyapi.weixin.qq.com/cgi-bin/',
};

afterEach(() => {
  resetTokenManagers();
});

describe('MemoryTokenStore', () => {
  it('stores, reads, deletes and clears records', () => {
    const store = new MemoryTokenStore();
    const record = { accessToken: 't', expiresAt: Date.now() + 1_000 };
    store.set('k', record);
    expect(store.get('k')).toEqual(record);
    store.delete('k');
    expect(store.get('k')).toBeUndefined();
    store.set('a', record);
    store.set('b', record);
    store.clear();
    expect(store.get('a')).toBeUndefined();
    expect(store.get('b')).toBeUndefined();
  });
});

describe('TokenManager', () => {
  it('returns a cached token that is still fresh', async () => {
    const store = new MemoryTokenStore();
    const manager = getTokenManager({ ...credentials, store });
    const key = tokenCacheKey(
      credentials.corpId,
      credentials.corpSecret,
      credentials.baseURL
    );
    store.set(key, {
      accessToken: 'cached',
      expiresAt: Date.now() + 120_000,
    });

    let fetches = 0;
    const token = await manager.getToken(async () => {
      fetches += 1;
      return { accessToken: 'fresh', expiresIn: 7200 };
    });
    expect(token).toBe('cached');
    expect(fetches).toBe(0);
  });

  it('refreshes when the token is inside the expire buffer', async () => {
    const store = new MemoryTokenStore();
    const manager = getTokenManager({ ...credentials, store });
    const key = tokenCacheKey(
      credentials.corpId,
      credentials.corpSecret,
      credentials.baseURL
    );
    store.set(key, {
      accessToken: 'stale',
      expiresAt: Date.now() + 30_000,
    });

    const token = await manager.getToken(async () => ({
      accessToken: 'fresh',
      expiresIn: 7200,
    }));
    expect(token).toBe('fresh');
    expect(store.get(key)?.accessToken).toBe('fresh');
  });

  it('coalesces concurrent refreshes', async () => {
    const manager = getTokenManager({
      ...credentials,
      store: new MemoryTokenStore(),
    });
    let fetches = 0;
    const fetcher = async () => {
      fetches += 1;
      await new Promise((resolve) => setTimeout(resolve, 20));
      return { accessToken: 'shared', expiresIn: 7200 };
    };

    const [first, second] = await Promise.all([
      manager.getToken(fetcher),
      manager.getToken(fetcher),
    ]);
    expect(first).toBe('shared');
    expect(second).toBe('shared');
    expect(fetches).toBe(1);
  });

  it('clears cache and inflight work on invalidate', async () => {
    const store = new MemoryTokenStore();
    const manager = getTokenManager({ ...credentials, store });
    await manager.getToken(async () => ({
      accessToken: 'old',
      expiresIn: 7200,
    }));
    await manager.invalidate();
    expect(
      store.get(
        tokenCacheKey(
          credentials.corpId,
          credentials.corpSecret,
          credentials.baseURL
        )
      )
    ).toBeUndefined();

    const token = await manager.getToken(async () => ({
      accessToken: 'new',
      expiresIn: 7200,
    }));
    expect(token).toBe('new');
  });

  it('does not cache an inflight refresh after invalidate', async () => {
    const store = new MemoryTokenStore();
    const manager = getTokenManager({ ...credentials, store });
    const key = tokenCacheKey(
      credentials.corpId,
      credentials.corpSecret,
      credentials.baseURL
    );
    let resolveRefresh!: (token: {
      accessToken: string;
      expiresIn: number;
    }) => void;
    let markStarted!: () => void;
    const started = new Promise<void>((resolve) => {
      markStarted = resolve;
    });

    const first = manager.getToken(
      () =>
        new Promise((resolve) => {
          markStarted();
          resolveRefresh = resolve;
        })
    );
    await started;
    await manager.invalidate();
    resolveRefresh({ accessToken: 'stale', expiresIn: 7200 });

    await expect(first).resolves.toBe('stale');
    expect(store.get(key)).toBeUndefined();
  });

  it('reuses managers for the same credentials and store', () => {
    const store = new MemoryTokenStore();
    const first = getTokenManager({ ...credentials, store });
    const second = getTokenManager({ ...credentials, store });
    expect(second).toBe(first);
  });

  it('isolates managers for different stores or credentials', () => {
    const defaultManager = getTokenManager(credentials);
    const customManager = getTokenManager({
      ...credentials,
      store: new MemoryTokenStore(),
    });
    const otherCorp = getTokenManager({
      ...credentials,
      corpId: 'other-corp',
    });
    expect(customManager).not.toBe(defaultManager);
    expect(otherCorp).not.toBe(defaultManager);
  });
});
