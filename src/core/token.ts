import { tokenCacheKey } from './config';
import type { TokenRecord, TokenStore } from './types';

const DEFAULT_EXPIRE_BUFFER_MS = 60_000;

export class MemoryTokenStore implements TokenStore {
  private readonly records = new Map<string, TokenRecord>();

  get(key: string): TokenRecord | undefined {
    return this.records.get(key);
  }

  set(key: string, record: TokenRecord): void {
    this.records.set(key, record);
  }

  delete(key: string): void {
    this.records.delete(key);
  }

  clear(): void {
    this.records.clear();
  }
}

const defaultStore = new MemoryTokenStore();
const managers = new Map<string, TokenManager>();

export class TokenManager {
  private inflight: Promise<string> | null = null;

  constructor(
    private readonly key: string,
    private readonly store: TokenStore
  ) {}

  async getToken(
    fetcher: () => Promise<{ accessToken: string; expiresIn: number }>
  ): Promise<string> {
    const cached = await this.store.get(this.key);
    if (cached && cached.expiresAt > Date.now() + DEFAULT_EXPIRE_BUFFER_MS) {
      return cached.accessToken;
    }
    if (this.inflight) {
      return this.inflight;
    }
    this.inflight = this.refresh(fetcher).finally(() => {
      this.inflight = null;
    });
    return this.inflight;
  }

  async invalidate(): Promise<void> {
    this.inflight = null;
    await this.store.delete(this.key);
  }

  private async refresh(
    fetcher: () => Promise<{ accessToken: string; expiresIn: number }>
  ): Promise<string> {
    const token = await fetcher();
    const record: TokenRecord = {
      accessToken: token.accessToken,
      expiresAt: Date.now() + token.expiresIn * 1000,
    };
    await this.store.set(this.key, record);
    return record.accessToken;
  }
}

export function getTokenManager(options: {
  corpId: string;
  corpSecret: string;
  baseURL: string;
  store?: TokenStore;
}): TokenManager {
  const store = options.store ?? defaultStore;
  const key = tokenCacheKey(
    options.corpId,
    options.corpSecret,
    options.baseURL
  );
  const cacheKey = `${key}:${store === defaultStore ? 'default' : objectId(store)}`;
  const existing = managers.get(cacheKey);
  if (existing) {
    return existing;
  }
  const manager = new TokenManager(key, store);
  managers.set(cacheKey, manager);
  return manager;
}

export function resetTokenManagers(): void {
  managers.clear();
  defaultStore.clear();
}

const objectIds = new WeakMap<object, string>();
let nextObjectId = 1;

function objectId(value: object): string {
  const existing = objectIds.get(value);
  if (existing) {
    return existing;
  }
  const id = `store-${nextObjectId++}`;
  objectIds.set(value, id);
  return id;
}
