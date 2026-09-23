import type { BaseRet } from '../../common/interface';
import {
  DEFAULT_BASE_URL,
  normalizeBaseURL,
  pickHttpConfig,
  type ResolvedWecomConfig,
  type WecomConfig,
} from '../../core/config';
import { WecomApiError, WecomConfigError } from '../../core/errors';
import type { TicketStore, WecomRequestOptions } from '../../core/types';
import { MemoryTicketStore } from '../../core/token';
import { createClient, type WecomClient } from '../../client';
import { Wecom } from '../../wecom';
import type {
  AdminListRet,
  AuthInfoRet,
  CorpTokenRet,
  PermanentCodeRet,
  PreAuthCodeRet,
  SetSessionInfoDto,
  SuiteConfig,
  SuiteCorpOptions,
  SuiteTokenRet,
  UserDetail3rdRet,
  UserInfo3rdRet,
} from './interface';

export type {
  AdminListRet,
  AuthInfoRet,
  CorpTokenRet,
  PermanentCodeRet,
  PreAuthCodeRet,
  SetSessionInfoDto,
  SuiteConfig,
  SuiteCorpOptions,
  SuiteTokenRet,
  UserDetail3rdRet,
  UserInfo3rdRet,
} from './interface';

/**
 * @description 第三方应用 / 代开发模板。用 suite_ticket 换 suite_access_token，再换授权企业 access_token。
 */
export class Suite {
  readonly suiteId: string;
  private readonly suiteSecret: string;
  private readonly tickets: TicketStore;
  private readonly ticketKey: string;
  private readonly client: Wecom;

  constructor(config: SuiteConfig) {
    const suiteId = config.suiteId?.trim() ?? '';
    const suiteSecret = config.suiteSecret?.trim() ?? '';
    if (!suiteId) {
      throw new WecomConfigError('suiteId should not be empty');
    }
    if (!suiteSecret) {
      throw new WecomConfigError('suiteSecret should not be empty');
    }

    this.suiteId = suiteId;
    this.suiteSecret = suiteSecret;
    this.tickets = config.ticketStore ?? new MemoryTicketStore();
    this.ticketKey = config.ticketKey ?? `suite-ticket:${suiteId}`;

    this.client = new Wecom({
      ...pickHttpConfig(config),
      tokenProvider: {
        cacheKey: `suite:${suiteId}:${suiteSecret}:${normalizeBaseURL(config.baseURL ?? DEFAULT_BASE_URL)}`,
        tokenParam: 'suite_access_token',
        fetch: () => this.fetchSuiteToken(),
      },
    });

    if (config.suiteTicket) {
      this.setTicket(config.suiteTicket);
    }
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

  setTicket(ticket: string): void | Promise<void> {
    if (!ticket) {
      throw new WecomConfigError('suite_ticket should not be empty');
    }
    return this.tickets.set(this.ticketKey, ticket);
  }

  async getTicket(): Promise<string> {
    const ticket = await this.tickets.get(this.ticketKey);
    if (!ticket) {
      throw new WecomConfigError(
        'suite_ticket should not be empty; call setTicket() after the suite_ticket callback'
      );
    }
    return ticket;
  }

  getPreAuthCode(): Promise<PreAuthCodeRet> {
    return this.request<PreAuthCodeRet>({
      url: '/service/get_pre_auth_code',
      method: 'GET',
    });
  }

  setSessionInfo(data: SetSessionInfoDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/service/set_session_info',
      method: 'POST',
      data,
    });
  }

  getPermanentCode(authCode: string): Promise<PermanentCodeRet> {
    return this.request<PermanentCodeRet>({
      url: '/service/v2/get_permanent_code',
      method: 'POST',
      data: { auth_code: authCode },
    });
  }

  getAuthInfo(options: SuiteCorpOptions): Promise<AuthInfoRet> {
    return this.request<AuthInfoRet>({
      url: '/service/v2/get_auth_info',
      method: 'POST',
      data: {
        auth_corpid: options.authCorpId,
        permanent_code: options.permanentCode,
      },
    });
  }

  getAdminList(authCorpId: string, agentId: number): Promise<AdminListRet> {
    return this.request<AdminListRet>({
      url: '/service/get_admin_list',
      method: 'POST',
      data: {
        auth_corpid: authCorpId,
        agentid: agentId,
      },
    });
  }

  getUserInfo3rd(code: string): Promise<UserInfo3rdRet> {
    return this.request<UserInfo3rdRet>({
      url: '/service/getuserinfo3rd',
      method: 'GET',
      params: { code },
    });
  }

  getUserDetail3rd(userTicket: string): Promise<UserDetail3rdRet> {
    return this.request<UserDetail3rdRet>({
      url: '/service/getuserdetail3rd',
      method: 'POST',
      data: { user_ticket: userTicket },
    });
  }

  /**
   * Return a WecomConfig for an authorized corp. Pass it to `new Message(config)`
   * or prefer `createCorpClient` / `corpWecom` for typed helpers.
   * There is no SuiteUser — reuse existing business modules.
   */
  corp(options: SuiteCorpOptions): WecomConfig {
    if (!options.authCorpId) {
      throw new WecomConfigError('authCorpId should not be empty');
    }
    if (!options.permanentCode) {
      throw new WecomConfigError('permanentCode should not be empty');
    }
    return {
      ...pickHttpConfig(this.config),
      baseURL: this.config.baseURL,
      tokenStore: this.config.tokenStore,
      tokenProvider: {
        cacheKey: `suite-corp:${this.suiteId}:${options.authCorpId}:${options.permanentCode}:${this.config.baseURL}`,
        tokenParam: 'access_token',
        fetch: () => this.fetchCorpToken(options),
      },
    };
  }

  /** Shared Wecom for an authorized corp (token via suite). */
  corpWecom(options: SuiteCorpOptions): Wecom {
    return new Wecom(this.corp(options));
  }

  /** createClient() bound to an authorized corp — no SuiteUser classes. */
  createCorpClient(
    options: SuiteCorpOptions & { agentId?: number }
  ): WecomClient {
    const { agentId, ...corpOptions } = options;
    return createClient({ ...this.corp(corpOptions), agentId });
  }

  private async fetchSuiteToken(): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const data = await this.request<SuiteTokenRet>({
      url: '/service/get_suite_token',
      method: 'POST',
      data: {
        suite_id: this.suiteId,
        suite_secret: this.suiteSecret,
        suite_ticket: await this.getTicket(),
      },
      skipAuth: true,
    });
    if (!data.suite_access_token) {
      throw new WecomApiError({
        errcode: data.errcode ?? 0,
        errmsg: data.errmsg || 'Failed to get suite_access_token',
        retryable: false,
        response: data,
      });
    }
    return {
      accessToken: data.suite_access_token,
      expiresIn: data.expires_in ?? 7200,
    };
  }

  private async fetchCorpToken(options: SuiteCorpOptions): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const data = await this.request<CorpTokenRet>({
      url: '/service/get_corp_token',
      method: 'POST',
      data: {
        auth_corpid: options.authCorpId,
        permanent_code: options.permanentCode,
      },
    });
    if (!data.access_token) {
      throw new WecomApiError({
        errcode: data.errcode ?? 0,
        errmsg: data.errmsg || 'Failed to get corp access_token',
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
