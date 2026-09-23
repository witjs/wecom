import type { BaseRet } from './common/interface';
import type { ResolvedWecomConfig, WecomConfig } from './core/config';
import type { WecomRequestOptions } from './core/types';
import { Wecom } from './wecom';

/** Config object or an existing Wecom instance to share transport/token. */
export type ClientSource = Partial<WecomConfig> | Wecom;

export function isWecom(value: unknown): value is Wecom {
  return value instanceof Wecom;
}

export function asWecom(source: ClientSource = {}): Wecom {
  return isWecom(source) ? source : new Wecom(source);
}

/**
 * Compatibility base for business modules: compose a shared Wecom instead of
 * extending it. Still exposes `config` / `getToken` / `request` for callers that
 * relied on the old inheritance surface.
 */
export abstract class WecomModule {
  protected readonly client: Wecom;

  constructor(source: ClientSource = {}) {
    this.client = asWecom(source);
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
}
