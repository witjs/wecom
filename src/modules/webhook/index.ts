import { DEFAULT_RETRY_TIMES, DEFAULT_TIMEOUT } from '../../core/config';
import { WecomConfigError } from '../../core/errors';
import { RequestKernel } from '../../core/kernel';
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
 * @description 群机器人消息推送（webhook）。不走 access_token，但复用核心请求/错误/重试策略。
 */
export class Webhook {
  readonly url: string;
  private readonly kernel: RequestKernel;

  constructor(config: WebhookConfig) {
    if (!config.url) {
      throw new WecomConfigError('url should not be empty');
    }
    this.url = config.url;
    const parsed = new URL(config.url);
    const transport = new FetchTransport({
      baseURL: parsed.href,
      timeout: config.timeout ?? DEFAULT_TIMEOUT,
      headers: config.headers ?? {},
      fetch: config.fetch ?? globalThis.fetch.bind(globalThis),
      logger: config.logger,
      signal: config.signal,
    });
    this.kernel = new RequestKernel({
      transport,
      retryTimes: config.retryTimes ?? DEFAULT_RETRY_TIMES,
      logger: config.logger,
      signal: config.signal,
      // no auth — webhook keys live in the URL
    });
  }

  async send(message: WebhookMessage): Promise<WebhookRet> {
    return this.kernel.request<WebhookRet>({
      url: '',
      method: 'POST',
      data: message,
      skipAuth: true,
    });
  }
}
