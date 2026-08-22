import type { BaseRet } from '../../common/interface';
import type { TokenStore, WecomLogger } from '../../core/types';

export interface ProviderConfig {
  corpId: string;
  providerSecret: string;
  tokenStore?: TokenStore;
  baseURL?: string;
  retryTimes?: number;
  timeout?: number;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
  logger?: WecomLogger;
  signal?: AbortSignal;
}

export interface ProviderTokenRet extends BaseRet {
  provider_access_token?: string;
  expires_in?: number;
}

export interface ProviderLoginInfoRet extends BaseRet {
  usertype?: number;
  user_info?: {
    userid?: string;
    open_userid?: string;
    name?: string;
    avatar?: string;
  };
  corp_info?: {
    corpid?: string;
  };
  agent?: Array<{
    agentid: number;
    auth_type?: number;
  }>;
  auth_info?: {
    department?: Array<{ id: number; writable?: boolean }>;
  };
}
