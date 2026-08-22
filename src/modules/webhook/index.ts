import { WecomApiError, WecomConfigError } from '../../core/errors';
import { FetchTransport } from '../../core/transport';
import type { WebhookConfig, WebhookMessage, WebhookRet } from './interface';

export type {
  WebhookConfig,
  WebhookFile,
  WebhookImage,
  WebhookMarkdown,
  WebhookMarkdownV2,
  WebhookMessage,
  WebhookNews,
  WebhookRet,
  WebhookTemplateCard,
  WebhookText,
} from './interface';

/**
 * @description 群机器人消息推送（webhook）。不走 access_token。
 */
export class Webhook {
  readonly url: string;
  private readonly transport: FetchTransport;

  constructor(config: WebhookConfig) {
    if (!config.url) {
      throw new WecomConfigError('url should not be empty');
    }
    this.url = config.url;
    const parsed = new URL(config.url);
    this.transport = new FetchTransport({
      baseURL: parsed.href,
      timeout: config.timeout ?? 30_000,
      headers: config.headers ?? {},
      fetch: config.fetch ?? globalThis.fetch.bind(globalThis),
      logger: config.logger,
      signal: config.signal,
    });
  }

  async send(message: WebhookMessage): Promise<WebhookRet> {
    const response = await this.transport.request<WebhookRet>({
      url: '',
      method: 'POST',
      data: message,
    });
    const data = response.data;
    if (typeof data.errcode === 'number' && data.errcode !== 0) {
      throw new WecomApiError({
        errcode: data.errcode,
        errmsg: data.errmsg,
        response: data,
      });
    }
    return data;
  }
}
