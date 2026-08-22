export type TokenParam =
  | 'access_token'
  | 'suite_access_token'
  | 'provider_access_token'
  | 'model_access_token'
  | 'device_access_token';

export interface TokenRecord {
  accessToken: string;
  expiresAt: number;
}

export interface TokenStore {
  get(key: string): Promise<TokenRecord | undefined> | TokenRecord | undefined;
  set(key: string, record: TokenRecord): Promise<void> | void;
  delete(key: string): Promise<void> | void;
}

export interface TokenProvider {
  cacheKey: string;
  tokenParam?: TokenParam;
  fetch(): Promise<{ accessToken: string; expiresIn: number }>;
}

export interface TicketStore {
  get(key: string): Promise<string | undefined> | string | undefined;
  set(key: string, ticket: string): Promise<void> | void;
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
