import type { BaseRet } from './common/interface';
import {
  getGlobalConfig,
  resolveConfig,
  setGlobalConfig,
  type ResolvedWecomConfig,
  type WecomConfig,
} from './core/config';
import { WecomApiError } from './core/errors';
import { RequestKernel } from './core/kernel';
import { getTokenManager, type TokenManager } from './core/token';
import { FetchTransport } from './core/transport';
import type { WecomRequestOptions } from './core/types';

export type { WecomConfig, WecomRequestOptions, ResolvedWecomConfig };

interface TokenResponse extends BaseRet {
  access_token?: string;
  expires_in?: number;
}

/**
 * @description 企业微信 Node API — 请求内核 + Token。业务模块通过组合复用它。
 */
export class Wecom {
  public readonly config: ResolvedWecomConfig;
  private readonly transport: FetchTransport;
  private readonly tokenManager: TokenManager;
  private readonly kernel: RequestKernel;

  /**
   * @deprecated Prefer `createClient` / `createScope` or passing config explicitly.
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
    this.kernel = new RequestKernel({
      transport: this.transport,
      retryTimes: this.config.retryTimes,
      logger: this.config.logger,
      signal: this.config.signal,
      auth: {
        tokenParam: this.config.tokenParam,
        getToken: () => this.getToken(),
        invalidateToken: () => this.tokenManager.invalidate(),
      },
    });
  }

  async getToken(): Promise<string> {
    return this.tokenManager.getToken(() => this.fetchAccessToken());
  }

  async request<T = BaseRet>(options: WecomRequestOptions): Promise<T> {
    return this.kernel.request<T>(options);
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
