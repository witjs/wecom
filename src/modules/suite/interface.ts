import type { BaseRet } from '../../common/interface';
import type { TicketStore, TokenStore, WecomLogger } from '../../core/types';
import type { WecomConfig } from '../../wecom';

export interface SuiteConfig {
  suiteId: string;
  suiteSecret: string;
  suiteTicket?: string;
  ticketStore?: TicketStore;
  ticketKey?: string;
  tokenStore?: TokenStore;
  baseURL?: string;
  retryTimes?: number;
  timeout?: number;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
  logger?: WecomLogger;
  signal?: AbortSignal;
}

export interface SuiteCorpOptions {
  authCorpId: string;
  permanentCode: string;
}

export interface SuiteTokenRet extends BaseRet {
  suite_access_token?: string;
  expires_in?: number;
}

export interface PreAuthCodeRet extends BaseRet {
  pre_auth_code: string;
  expires_in: number;
}

export interface SetSessionInfoDto {
  pre_auth_code: string;
  session_info?: {
    appid?: number[];
    auth_type?: 0 | 1;
  };
}

export interface PermanentCodeRet extends BaseRet {
  permanent_code: string;
  auth_corpid?: string;
  auth_corp_info?: {
    corpid: string;
    corp_name?: string;
  };
  auth_user_info?: {
    userid?: string;
    open_userid?: string;
    name?: string;
    avatar?: string;
  };
  state?: string;
}

export interface CorpTokenRet extends BaseRet {
  access_token?: string;
  expires_in?: number;
}

export interface AuthInfoRet extends BaseRet {
  auth_corp_info?: PermanentCodeRet['auth_corp_info'] & {
    corp_type?: string;
    corp_square_logo_url?: string;
    corp_user_max?: number;
    corp_full_name?: string;
    subject_type?: number;
    verified_end_time?: number;
    corp_scale?: string;
    corp_industry?: string;
    corp_sub_industry?: string;
  };
  auth_info?: {
    agent?: Array<{
      agentid: number;
      name?: string;
      square_logo_url?: string;
      privilege?: {
        allow_party?: number[];
        allow_user?: string[];
        allow_tag?: number[];
        extra_party?: number[];
        extra_user?: string[];
        extra_tag?: number[];
        level?: number;
      };
    }>;
  };
}

export interface AdminListRet extends BaseRet {
  admin?: Array<{
    userid: string;
    open_userid?: string;
    auth_type?: number;
  }>;
}

export interface UserInfo3rdRet extends BaseRet {
  CorpId?: string;
  UserId?: string;
  DeviceId?: string;
  user_ticket?: string;
  expires_in?: number;
  open_userid?: string;
}

export interface UserDetail3rdRet extends BaseRet {
  corpid?: string;
  userid?: string;
  name?: string;
  gender?: string;
  avatar?: string;
  qr_code?: string;
}

export type { WecomConfig };
