import type { BaseRet } from '../../common/interface';
import type { WecomLogger } from '../../core/types';

export interface WebhookConfig {
  url: string;
  timeout?: number;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
  logger?: WecomLogger;
  signal?: AbortSignal;
}

export interface WebhookText {
  msgtype: 'text';
  text: {
    content: string;
    mentioned_list?: string[];
    mentioned_mobile_list?: string[];
  };
}

export interface WebhookMarkdown {
  msgtype: 'markdown';
  markdown: { content: string };
}

export interface WebhookMarkdownV2 {
  msgtype: 'markdown_v2';
  markdown_v2: { content: string };
}

export interface WebhookImage {
  msgtype: 'image';
  image: { base64: string; md5: string };
}

export interface WebhookNews {
  msgtype: 'news';
  news: {
    articles: Array<{
      title: string;
      description?: string;
      url: string;
      picurl?: string;
    }>;
  };
}

export interface WebhookFile {
  msgtype: 'file';
  file: { media_id: string };
}

export interface WebhookTemplateCard {
  msgtype: 'template_card';
  template_card: Record<string, unknown>;
}

export type WebhookMessage =
  | WebhookText
  | WebhookMarkdown
  | WebhookMarkdownV2
  | WebhookImage
  | WebhookNews
  | WebhookFile
  | WebhookTemplateCard;

export type WebhookRet = BaseRet;
