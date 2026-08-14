export interface TokenRecord {
  accessToken: string;
  expiresAt: number;
}

export interface TokenStore {
  get(key: string): Promise<TokenRecord | undefined> | TokenRecord | undefined;
  set(key: string, record: TokenRecord): Promise<void> | void;
  delete(key: string): Promise<void> | void;
}

export interface WecomLogger {
  debug?(message: string, meta?: Record<string, unknown>): void;
  info?(message: string, meta?: Record<string, unknown>): void;
  warn?(message: string, meta?: Record<string, unknown>): void;
  error?(message: string, meta?: Record<string, unknown>): void;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface WecomRequestOptions {
  url: string;
  method?: HttpMethod;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  skipAuth?: boolean;
  timeout?: number;
  responseType?: 'json' | 'arrayBuffer';
}

export interface TransportResponse<T = unknown> {
  status: number;
  headers: Headers;
  data: T;
  url: string;
}
