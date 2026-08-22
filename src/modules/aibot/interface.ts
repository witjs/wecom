import type { WecomLogger } from '../../core/types';

export const DEFAULT_AIBOT_WS_URL = 'wss://openws.work.weixin.qq.com';

export interface AiBotConfig {
  botId: string;
  secret: string;
  wsURL?: string;
  heartbeatMs?: number;
  reconnect?: boolean;
  reconnectMaxMs?: number;
  logger?: WecomLogger;
  webSocket?: typeof WebSocket;
}

export interface AiBotFrameHeaders {
  req_id: string;
}

export interface AiBotFrame<T = unknown> {
  cmd: string;
  headers: AiBotFrameHeaders;
  body?: T;
  errcode?: number;
  errmsg?: string;
}

export interface AiBotFrom {
  userid?: string;
}

export interface AiBotTextBody {
  msgid?: string;
  aibotid?: string;
  chatid?: string;
  chattype?: 'single' | 'group' | string;
  from?: AiBotFrom;
  msgtype?: string;
  text?: { content?: string };
  image?: { url?: string; aeskey?: string };
  file?: { url?: string; aeskey?: string };
  voice?: { content?: string };
  video?: { url?: string; aeskey?: string };
  mixed?: unknown;
  event?: { eventtype?: string; [key: string]: unknown };
  create_time?: number;
}

export interface AiBotWelcomeBody {
  msgtype: 'text' | 'template_card';
  text?: { content: string };
  template_card?: Record<string, unknown>;
}

export interface AiBotSendMessageBody {
  chatid: string;
  chat_type?: 0 | 1 | 2;
  msgtype: 'markdown' | 'template_card';
  markdown?: { content: string };
  template_card?: Record<string, unknown>;
}

export type AiBotEventName =
  | 'authenticated'
  | 'disconnected'
  | 'error'
  | 'frame'
  | 'message'
  | 'event';
