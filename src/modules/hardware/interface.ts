import type { BaseRet } from '../../common/interface';
import type { TicketStore, TokenStore, WecomLogger } from '../../core/types';

export interface HardwareConfig {
  modelId: string;
  modelSecret: string;
  modelTicket?: string;
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

export interface HardwareDeviceOptions {
  deviceSn: string;
  deviceSecret: string;
}

export interface ModelTokenRet extends BaseRet {
  model_access_token?: string;
  expires_in?: number;
}

export interface DeviceSecretRet extends BaseRet {
  device_secret?: string;
}

export interface DeviceTokenRet extends BaseRet {
  device_access_token?: string;
  expires_in?: number;
}

export interface HardwareDeviceRet extends BaseRet {
  device_sn?: string;
  model_id?: string;
  auth_corpid?: string;
}
