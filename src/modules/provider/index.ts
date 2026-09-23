import {
  DEFAULT_BASE_URL,
  normalizeBaseURL,
  pickHttpConfig,
  type ResolvedWecomConfig,
} from '../../core/config';
import { WecomApiError, WecomConfigError } from '../../core/errors';
import type { WecomRequestOptions } from '../../core/types';
import type { BaseRet } from '../../common/interface';
import { Wecom } from '../../wecom';
import type {
  ProviderConfig,
  ProviderLoginInfoRet,
  ProviderTokenRet,
} from './interface';

export type {
  ProviderConfig,
  ProviderLoginInfoRet,
  ProviderTokenRet,
} from './interface';

/**
 * @description 服务商后台身份。用 provider_secret 换 provider_access_token。
 */
export class Provider {
  readonly corpId: string;
  private readonly providerSecret: string;
  private readonly client: Wecom;

  constructor(config: ProviderConfig) {
    const corpId = config.corpId?.trim() ?? '';
    const providerSecret = config.providerSecret?.trim() ?? '';
    if (!corpId) {
      throw new WecomConfigError('corpId should not be empty');
    }
    if (!providerSecret) {
      throw new WecomConfigError('providerSecret should not be empty');
    }

    this.corpId = corpId;
    this.providerSecret = providerSecret;
    this.client = new Wecom({
      ...pickHttpConfig(config),
      tokenProvider: {
        cacheKey: `provider:${corpId}:${providerSecret}:${normalizeBaseURL(config.baseURL ?? DEFAULT_BASE_URL)}`,
        tokenParam: 'provider_access_token',
        fetch: () => this.fetchProviderToken(),
      },
    });
  }

  get config(): ResolvedWecomConfig {
    return this.client.config;
  }

  getToken(): Promise<string> {
    return this.client.getToken();
  }

  request<T = BaseRet>(options: WecomRequestOptions): Promise<T> {
    return this.client.request<T>(options);
  }

  getLoginInfo(authCode: string): Promise<ProviderLoginInfoRet> {
    return this.request<ProviderLoginInfoRet>({
      url: '/service/get_login_info',
      method: 'POST',
      data: { auth_code: authCode },
    });
  }

  private async fetchProviderToken(): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const data = await this.request<ProviderTokenRet>({
      url: '/service/get_provider_token',
      method: 'POST',
      data: {
        corpid: this.corpId,
        provider_secret: this.providerSecret,
      },
      skipAuth: true,
    });
    if (!data.provider_access_token) {
      throw new WecomApiError({
        errcode: data.errcode ?? 0,
        errmsg: data.errmsg || 'Failed to get provider_access_token',
        retryable: false,
        response: data,
      });
    }
    return {
      accessToken: data.provider_access_token,
      expiresIn: data.expires_in ?? 7200,
    };
  }
}
