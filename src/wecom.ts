import type { BaseRet } from './common/interface';
import {
  getGlobalConfig,
  resolveConfig,
  setGlobalConfig,
  type ResolvedWecomConfig,
  type WecomConfig,
} from './core/config';
import {
  WecomApiError,
  WecomError,
  WecomHttpError,
  isTokenInvalidErrcode,
} from './core/errors';
import { getTokenManager, type TokenManager } from './core/token';
import { FetchTransport } from './core/transport';
import type { WecomRequestOptions } from './core/types';

export type { WecomConfig, WecomRequestOptions, ResolvedWecomConfig };

interface TokenResponse extends BaseRet {
  access_token?: string;
  expires_in?: number;
}

/**
 * @description 企业微信 Node API
 */
export class Wecom {
  public readonly config: ResolvedWecomConfig;
  private readonly transport: FetchTransport;
  private readonly tokenManager: TokenManager;

  /**
   * @deprecated Prefer passing config to each client constructor.
   */
  public static setGlobal(config: Partial<WecomConfig>): void {
    setGlobalConfig(config);
  }

  constructor(config: Partial<WecomConfig> = {}) {
    this.config = resolveConfig(config);
    this.transport = new FetchTransport({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
      fetch: this.config.fetch,
      logger: this.config.logger,
      signal: this.config.signal,
    });
    this.tokenManager = getTokenManager({
      cacheKey: this.config.tokenCacheKey,
      store: this.config.tokenStore,
    });
  }

  async getToken(): Promise<string> {
    return this.tokenManager.getToken(() => this.fetchAccessToken());
  }

  async request<T = BaseRet>(options: WecomRequestOptions): Promise<T> {
    return this.sendWithRetry<T>(options, this.config.retryTimes);
  }

  private async sendWithRetry<T>(
    options: WecomRequestOptions,
    retriesLeft: number
  ): Promise<T> {
    try {
      return await this.sendOnce<T>(options);
    } catch (error) {
      if (
        error instanceof WecomError &&
        error.retryable &&
        retriesLeft > 0 &&
        !isUserAborted(options.signal, this.config.signal)
      ) {
        if (
          error instanceof WecomApiError &&
          isTokenInvalidErrcode(error.errcode)
        ) {
          await this.tokenManager.invalidate();
        }
        this.config.logger?.warn?.('wecom.retry', {
          url: options.url,
          retriesLeft,
          message: error.message,
        });
        await delay(backoffMs(this.config.retryTimes - retriesLeft));
        return this.sendWithRetry(options, retriesLeft - 1);
      }
      throw error;
    }
  }

  private async sendOnce<T>(options: WecomRequestOptions): Promise<T> {
    const params = { ...options.params };
    if (!options.skipAuth) {
      params[this.config.tokenParam] = await this.getToken();
    }

    const response = await this.transport.request<T & Partial<BaseRet>>({
      ...options,
      params,
    });
    const requestId =
      response.headers.get('x-request-id') ??
      response.headers.get('request-id') ??
      undefined;
    const data = response.data;

    if (isBaseRet(data) && data.errcode !== 0) {
      throw new WecomApiError({
        errcode: data.errcode,
        errmsg: data.errmsg,
        requestId,
        response: data,
      });
    }

    if (response.status === 401) {
      await this.tokenManager.invalidate();
      throw new WecomHttpError({
        status: 401,
        requestId,
        retryable: true,
        response: data,
      });
    }

    if (!isHttpSuccess(response.status)) {
      throw new WecomHttpError({
        status: response.status,
        requestId,
        response: data,
      });
    }

    return data as T;
  }

  protected async fetchAccessToken(): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    if (this.config.tokenProvider) {
      return this.config.tokenProvider.fetch();
    }
    const data = await this.request<TokenResponse>({
      url: '/gettoken',
      method: 'GET',
      params: {
        corpid: this.config.corpId,
        corpsecret: this.config.corpSecret,
      },
      skipAuth: true,
    });
    if (!data.access_token) {
      throw new WecomApiError({
        errcode: data.errcode ?? 0,
        errmsg: data.errmsg || 'Failed to get access_token',
        retryable: false,
        response: data,
      });
    }
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in ?? 7200,
    };
  }
}

export { getGlobalConfig };

function isBaseRet(value: unknown): value is BaseRet {
  return (
    typeof value === 'object' &&
    value !== null &&
    'errcode' in value &&
    typeof (value as BaseRet).errcode === 'number'
  );
}

function isHttpSuccess(status: number): boolean {
  return (status >= 200 && status < 300) || status === 206;
}

function isUserAborted(
  requestSignal?: AbortSignal,
  configSignal?: AbortSignal
): boolean {
  return Boolean(requestSignal?.aborted || configSignal?.aborted);
}

function backoffMs(attempt: number): number {
  return Math.min(200 * 2 ** attempt, 2000);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
