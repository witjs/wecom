import {
  DEFAULT_BASE_URL,
  normalizeBaseURL,
  pickHttpConfig,
} from '../../core/config';
import { WecomApiError, WecomConfigError } from '../../core/errors';
import { MemoryTicketStore } from '../../core/token';
import type { TicketStore } from '../../core/types';
import type { WecomConfig } from '../../wecom';
import { Wecom } from '../../wecom';
import type {
  DeviceSecretRet,
  DeviceTokenRet,
  HardwareConfig,
  HardwareDeviceOptions,
  HardwareDeviceRet,
  ModelTokenRet,
} from './interface';

export type {
  DeviceSecretRet,
  DeviceTokenRet,
  HardwareConfig,
  HardwareDeviceOptions,
  HardwareDeviceRet,
  ModelTokenRet,
} from './interface';

/**
 * @description 智能硬件云对云。用 model_ticket 换 model_access_token，再换设备 token。
 */
export class Hardware extends Wecom {
  readonly modelId: string;
  private readonly modelSecret: string;
  private readonly tickets: TicketStore;
  private readonly ticketKey: string;

  constructor(config: HardwareConfig) {
    const modelId = config.modelId?.trim() ?? '';
    const modelSecret = config.modelSecret?.trim() ?? '';
    if (!modelId) {
      throw new WecomConfigError('modelId should not be empty');
    }
    if (!modelSecret) {
      throw new WecomConfigError('modelSecret should not be empty');
    }

    const holder: { instance?: Hardware } = {};
    super({
      ...pickHttpConfig(config),
      tokenProvider: {
        cacheKey: `model:${modelId}:${modelSecret}:${normalizeBaseURL(config.baseURL ?? DEFAULT_BASE_URL)}`,
        tokenParam: 'model_access_token',
        fetch: () => holder.instance!.fetchModelToken(),
      },
    });
    holder.instance = this;
    this.modelId = modelId;
    this.modelSecret = modelSecret;
    this.tickets = config.ticketStore ?? new MemoryTicketStore();
    this.ticketKey = config.ticketKey ?? `model-ticket:${modelId}`;
    if (config.modelTicket) {
      this.setTicket(config.modelTicket);
    }
  }

  setTicket(ticket: string): void | Promise<void> {
    if (!ticket) {
      throw new WecomConfigError('model_ticket should not be empty');
    }
    return this.tickets.set(this.ticketKey, ticket);
  }

  async getTicket(): Promise<string> {
    const ticket = await this.tickets.get(this.ticketKey);
    if (!ticket) {
      throw new WecomConfigError(
        'model_ticket should not be empty; call setTicket() after the model_ticket callback'
      );
    }
    return ticket;
  }

  getDeviceSecret(authCode: string): Promise<DeviceSecretRet> {
    return this.request<DeviceSecretRet>({
      url: '/openhw/get_device_secret',
      method: 'POST',
      data: { auth_code: authCode },
    });
  }

  addDevice(deviceSn: string): Promise<HardwareDeviceRet> {
    return this.request<HardwareDeviceRet>({
      url: '/openhw/add_device',
      method: 'POST',
      data: { device_sn: deviceSn },
    });
  }

  deleteDevice(deviceSn: string): Promise<HardwareDeviceRet> {
    return this.request<HardwareDeviceRet>({
      url: '/openhw/del_device',
      method: 'POST',
      data: { device_sn: deviceSn },
    });
  }

  getDevice(deviceSn: string): Promise<HardwareDeviceRet> {
    return this.request<HardwareDeviceRet>({
      url: '/openhw/get_device_detail',
      method: 'POST',
      data: { device_sn: deviceSn },
    });
  }

  device(options: HardwareDeviceOptions): WecomConfig {
    if (!options.deviceSn) {
      throw new WecomConfigError('deviceSn should not be empty');
    }
    if (!options.deviceSecret) {
      throw new WecomConfigError('deviceSecret should not be empty');
    }
    return {
      ...pickHttpConfig(this.config),
      baseURL: this.config.baseURL,
      tokenStore: this.config.tokenStore,
      tokenProvider: {
        cacheKey: `device:${this.modelId}:${options.deviceSn}:${options.deviceSecret}:${this.config.baseURL}`,
        tokenParam: 'device_access_token',
        fetch: () => this.fetchDeviceToken(options),
      },
    };
  }

  private async fetchModelToken(): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const data = await this.request<ModelTokenRet>({
      url: '/openhw/get_model_token',
      method: 'POST',
      data: {
        model_id: this.modelId,
        model_secret: this.modelSecret,
        model_ticket: await this.getTicket(),
      },
      skipAuth: true,
    });
    if (!data.model_access_token) {
      throw new WecomApiError({
        errcode: data.errcode ?? 0,
        errmsg: data.errmsg || 'Failed to get model_access_token',
        retryable: false,
        response: data,
      });
    }
    return {
      accessToken: data.model_access_token,
      expiresIn: data.expires_in ?? 7200,
    };
  }

  private async fetchDeviceToken(options: HardwareDeviceOptions): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const data = await this.request<DeviceTokenRet>({
      url: '/openhw/get_device_token',
      method: 'POST',
      data: {
        device_sn: options.deviceSn,
        device_secret: options.deviceSecret,
      },
    });
    if (!data.device_access_token) {
      throw new WecomApiError({
        errcode: data.errcode ?? 0,
        errmsg: data.errmsg || 'Failed to get device_access_token',
        retryable: false,
        response: data,
      });
    }
    return {
      accessToken: data.device_access_token,
      expiresIn: data.expires_in ?? 7200,
    };
  }
}
