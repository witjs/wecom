import { randomBytes } from 'node:crypto';
import { WecomApiError, WecomConfigError } from '../../core/errors';
import type {
  AiBotConfig,
  AiBotEventName,
  AiBotFrame,
  AiBotSendMessageBody,
  AiBotTextBody,
  AiBotWelcomeBody,
} from './interface';
import { DEFAULT_AIBOT_WS_URL } from './interface';

export type {
  AiBotConfig,
  AiBotEventName,
  AiBotFrame,
  AiBotFrameHeaders,
  AiBotFrom,
  AiBotSendMessageBody,
  AiBotTextBody,
  AiBotWelcomeBody,
} from './interface';
export { DEFAULT_AIBOT_WS_URL } from './interface';

export function generateAiBotReqId(prefix = 'req'): string {
  return `${prefix}-${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`;
}

export class AiBotReply {
  constructor(
    private readonly bot: AiBot,
    private readonly reqId: string
  ) {}

  stream(
    content: string,
    options: { id?: string; finish?: boolean } = {}
  ): Promise<AiBotFrame> {
    return this.bot.respond(this.reqId, {
      msgtype: 'stream',
      stream: {
        id: options.id ?? generateAiBotReqId('stream'),
        finish: options.finish ?? true,
        content,
      },
    });
  }

  markdown(content: string): Promise<AiBotFrame> {
    return this.bot.respond(this.reqId, {
      msgtype: 'markdown',
      markdown: { content },
    });
  }

  text(content: string): Promise<AiBotFrame> {
    return this.bot.respond(this.reqId, {
      msgtype: 'text',
      text: { content },
    });
  }

  welcome(body: AiBotWelcomeBody): Promise<AiBotFrame> {
    return this.bot.respondWelcome(this.reqId, body);
  }

  updateTemplateCard(templateCard: Record<string, unknown>): Promise<AiBotFrame> {
    return this.bot.updateTemplateCard(this.reqId, templateCard);
  }
}

type Listener = (...args: unknown[]) => void;

/**
 * @description 智能机器人 WebSocket 长连接
 */
export class AiBot {
  readonly botId: string;
  private readonly secret: string;
  private readonly wsURL: string;
  private readonly heartbeatMs: number;
  private readonly reconnect: boolean;
  private readonly reconnectMaxMs: number;
  private readonly WebSocketImpl: typeof WebSocket;
  private readonly logger: AiBotConfig['logger'];
  private readonly listeners = new Map<string, Set<Listener>>();
  private socket?: WebSocket;
  private heartbeat?: ReturnType<typeof setInterval>;
  private closedByUser = false;
  private reconnectAttempt = 0;
  private connecting?: Promise<void>;
  private readonly pending = new Map<
    string,
    {
      resolve: (frame: AiBotFrame<unknown>) => void;
      reject: (error: unknown) => void;
    }
  >();

  constructor(config: AiBotConfig) {
    if (!config.botId) {
      throw new WecomConfigError('botId should not be empty');
    }
    if (!config.secret) {
      throw new WecomConfigError('secret should not be empty');
    }
    this.botId = config.botId;
    this.secret = config.secret;
    this.wsURL = config.wsURL ?? DEFAULT_AIBOT_WS_URL;
    this.heartbeatMs = config.heartbeatMs ?? 30_000;
    this.reconnect = config.reconnect ?? true;
    this.reconnectMaxMs = config.reconnectMaxMs ?? 30_000;
    this.WebSocketImpl = config.webSocket ?? WebSocket;
    this.logger = config.logger;
  }

  get connected(): boolean {
    return this.socket?.readyState === this.WebSocketImpl.OPEN;
  }

  on(event: 'authenticated', listener: () => void): this;
  on(event: 'disconnected', listener: (frame?: AiBotFrame) => void): this;
  on(event: 'error', listener: (error: unknown) => void): this;
  on(event: 'frame', listener: (frame: AiBotFrame) => void): this;
  on(
    event: 'message',
    listener: (frame: AiBotFrame<AiBotTextBody>, reply: AiBotReply) => void
  ): this;
  on(
    event: 'event',
    listener: (frame: AiBotFrame<AiBotTextBody>, reply: AiBotReply) => void
  ): this;
  on(event: string, listener: (...args: never[]) => void): this {
    const bucket = this.listeners.get(event) ?? new Set();
    bucket.add(listener as Listener);
    this.listeners.set(event, bucket);
    return this;
  }

  off(event: string, listener: Listener): this {
    this.listeners.get(event)?.delete(listener);
    return this;
  }

  connect(): Promise<void> {
    if (this.connected) {
      return Promise.resolve();
    }
    if (this.connecting) {
      return this.connecting;
    }
    this.closedByUser = false;
    this.connecting = this.openSocket().finally(() => {
      this.connecting = undefined;
    });
    return this.connecting;
  }

  disconnect(): void {
    this.closedByUser = true;
    this.stopHeartbeat();
    this.socket?.close();
    this.socket = undefined;
  }

  async respond(reqId: string, body: object): Promise<AiBotFrame> {
    return this.sendFrame({
      cmd: 'aibot_respond_msg',
      headers: { req_id: reqId },
      body,
    });
  }

  async respondWelcome(
    reqId: string,
    body: AiBotWelcomeBody
  ): Promise<AiBotFrame> {
    return this.sendFrame({
      cmd: 'aibot_respond_welcome_msg',
      headers: { req_id: reqId },
      body,
    });
  }

  async updateTemplateCard(
    reqId: string,
    templateCard: Record<string, unknown>
  ): Promise<AiBotFrame> {
    return this.sendFrame({
      cmd: 'aibot_respond_update_msg',
      headers: { req_id: reqId },
      body: {
        response_type: 'update_template_card',
        template_card: templateCard,
      },
    });
  }

  async sendMessage(body: AiBotSendMessageBody): Promise<AiBotFrame> {
    return this.sendFrame({
      cmd: 'aibot_send_msg',
      headers: { req_id: generateAiBotReqId('send') },
      body,
    });
  }

  private async openSocket(): Promise<void> {
    const socket = new this.WebSocketImpl(this.wsURL);
    this.socket = socket;
    await waitForOpen(socket);
    socket.addEventListener('message', (event) => {
      this.handleMessage(String((event as MessageEvent).data));
    });
    socket.addEventListener('close', () => {
      this.stopHeartbeat();
      this.emit('disconnected');
      this.scheduleReconnect();
    });
    socket.addEventListener('error', (event) => {
      this.emit('error', event);
    });
    await this.subscribe();
    this.startHeartbeat();
    this.reconnectAttempt = 0;
    this.emit('authenticated');
  }

  private async subscribe(): Promise<void> {
    const frame = await this.sendFrame(
      {
        cmd: 'aibot_subscribe',
        headers: { req_id: generateAiBotReqId('sub') },
        body: {
          bot_id: this.botId,
          secret: this.secret,
        },
      },
      true
    );
    if (frame.errcode && frame.errcode !== 0) {
      throw new WecomApiError({
        errcode: frame.errcode,
        errmsg: frame.errmsg || 'Failed to subscribe AiBot',
        response: frame,
      });
    }
  }

  private async sendFrame(
    frame: AiBotFrame<unknown>,
    waitForAck = false
  ): Promise<AiBotFrame<unknown>> {
    const socket = this.socket;
    if (!socket || socket.readyState !== this.WebSocketImpl.OPEN) {
      throw new WecomConfigError('AiBot is not connected');
    }
    const payload = JSON.stringify(frame);
    this.logger?.debug?.('wecom.aibot.send', { cmd: frame.cmd });
    if (waitForAck) {
      const ack = new Promise<AiBotFrame>((resolve, reject) => {
        this.pending.set(frame.headers.req_id, { resolve, reject });
      });
      socket.send(payload);
      return ack;
    }
    socket.send(payload);
    return frame;
  }

  private handleMessage(raw: string): void {
    let frame: AiBotFrame<AiBotTextBody>;
    try {
      frame = JSON.parse(raw) as AiBotFrame<AiBotTextBody>;
    } catch (error) {
      this.emit('error', error);
      return;
    }
    this.logger?.debug?.('wecom.aibot.recv', { cmd: frame.cmd });
    this.emit('frame', frame);
    const pending = frame.headers?.req_id
      ? this.pending.get(frame.headers.req_id)
      : undefined;
    if (pending && !frame.cmd?.endsWith('_callback')) {
      this.pending.delete(frame.headers.req_id);
      pending.resolve(frame);
      return;
    }
    const reply = new AiBotReply(this, frame.headers?.req_id ?? '');
    if (frame.cmd === 'aibot_msg_callback') {
      this.emit('message', frame, reply);
      return;
    }
    if (frame.cmd === 'aibot_event_callback') {
      const eventType = frame.body?.event?.eventtype;
      if (eventType === 'disconnected_event') {
        this.emit('disconnected', frame);
      }
      this.emit('event', frame, reply);
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    if (this.heartbeatMs <= 0) {
      return;
    }
    this.heartbeat = setInterval(() => {
      void this.sendFrame({
        cmd: 'ping',
        headers: { req_id: generateAiBotReqId('ping') },
      }).catch((error) => this.emit('error', error));
    }, this.heartbeatMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = undefined;
    }
  }

  private scheduleReconnect(): void {
    if (this.closedByUser || !this.reconnect) {
      return;
    }
    const delay = Math.min(
      1000 * 2 ** this.reconnectAttempt,
      this.reconnectMaxMs
    );
    this.reconnectAttempt += 1;
    setTimeout(() => {
      if (!this.closedByUser) {
        void this.connect().catch((error) => this.emit('error', error));
      }
    }, delay);
  }

  private emit(event: AiBotEventName | string, ...args: unknown[]): void {
    for (const listener of this.listeners.get(event) ?? []) {
      listener(...args);
    }
  }
}

function waitForOpen(socket: WebSocket): Promise<void> {
  if (socket.readyState === WebSocket.OPEN) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const onOpen = () => {
      cleanup();
      resolve();
    };
    const onError = (event: Event) => {
      cleanup();
      reject(event);
    };
    const cleanup = () => {
      socket.removeEventListener('open', onOpen);
      socket.removeEventListener('error', onError);
    };
    socket.addEventListener('open', onOpen);
    socket.addEventListener('error', onError);
  });
}
