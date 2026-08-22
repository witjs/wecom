import { afterEach, describe, expect, it } from 'vitest';
import {
  AiBot,
  Hardware,
  Message,
  Provider,
  Suite,
  Webhook,
  WecomConfigError,
} from '../../src';
import {
  createMockFetch,
  createWecomFetch,
  resetSdkState,
} from '../helpers/mock-fetch';

afterEach(() => {
  resetSdkState();
});

function lastNonTokenCall(
  calls: { url: URL; method: string; body: unknown }[]
) {
  return calls
    .filter((call) => {
      const path = call.url.pathname;
      return (
        !path.includes('gettoken') &&
        !path.includes('get_suite_token') &&
        !path.includes('get_provider_token') &&
        !path.includes('get_model_token') &&
        !path.includes('get_corp_token') &&
        !path.includes('get_device_token')
      );
    })
    .at(-1);
}

describe('Suite', () => {
  it('throws when suite credentials are missing', () => {
    expect(() => new Suite({ suiteId: '', suiteSecret: 's' })).toThrow(
      WecomConfigError
    );
  });

  it('requires a suite_ticket before fetching the suite token', async () => {
    const { fetch } = createWecomFetch();
    const suite = new Suite({
      suiteId: 'ww-suite',
      suiteSecret: 'suite-secret',
      fetch,
    });
    await expect(suite.getToken()).rejects.toThrow(/suite_ticket/);
  });

  it('exchanges suite_ticket for suite_access_token', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('get_suite_token')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          suite_access_token: 'suite-token',
          expires_in: 7200,
        };
      }
      return { errcode: 0, errmsg: 'ok', pre_auth_code: 'pre', expires_in: 600 };
    });
    const suite = new Suite({
      suiteId: 'ww-suite',
      suiteSecret: 'suite-secret',
      suiteTicket: 'ticket-1',
      fetch,
    });
    const ret = await suite.getPreAuthCode();
    expect(ret.pre_auth_code).toBe('pre');
    expect(calls[0].url.pathname).toContain('/service/get_suite_token');
    expect(calls[0].body).toMatchObject({
      suite_id: 'ww-suite',
      suite_secret: 'suite-secret',
      suite_ticket: 'ticket-1',
    });
    expect(calls[1].url.searchParams.get('suite_access_token')).toBe(
      'suite-token'
    );
  });

  it('lets authorized corps reuse Message', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('get_suite_token')) {
        return {
          suite_access_token: 'suite-token',
          expires_in: 7200,
        };
      }
      if (request.url.pathname.includes('get_corp_token')) {
        return { access_token: 'corp-token', expires_in: 7200 };
      }
      return { errcode: 0, errmsg: 'ok' };
    });
    const suite = new Suite({
      suiteId: 'ww-suite',
      suiteSecret: 'suite-secret',
      suiteTicket: 'ticket-1',
      fetch,
    });
    const message = new Message(suite.corp({
      authCorpId: 'ww-auth',
      permanentCode: 'perm-1',
    }));
    await message.send(
      { touser: 'alice', msgtype: 'text', text: { content: 'hi' } },
      1000002
    );
    expect(
      calls.some((call) => call.url.pathname.includes('/service/get_corp_token'))
    ).toBe(true);
    const send = lastNonTokenCall(calls);
    expect(send?.url.pathname).toContain('/message/send');
    expect(send?.url.searchParams.get('access_token')).toBe('corp-token');
  });
});

describe('Provider', () => {
  it('injects provider_access_token', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('get_provider_token')) {
        return {
          provider_access_token: 'provider-token',
          expires_in: 7200,
        };
      }
      return { errcode: 0, errmsg: 'ok', usertype: 1 };
    });
    const provider = new Provider({
      corpId: 'ww-provider',
      providerSecret: 'provider-secret',
      fetch,
    });
    await provider.getLoginInfo('auth-code');
    expect(calls[0].url.pathname).toContain('/service/get_provider_token');
    expect(calls[1].url.searchParams.get('provider_access_token')).toBe(
      'provider-token'
    );
    expect(calls[1].body).toEqual({ auth_code: 'auth-code' });
  });
});

describe('Webhook', () => {
  it('posts JSON to the webhook URL without a token', async () => {
    const { fetch, calls } = createMockFetch(() => ({
      errcode: 0,
      errmsg: 'ok',
    }));
    const webhook = new Webhook({
      url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=abc',
      fetch,
    });
    await webhook.send({
      msgtype: 'text',
      text: { content: 'hello' },
    });
    expect(calls).toHaveLength(1);
    expect(calls[0].url.searchParams.get('key')).toBe('abc');
    expect(calls[0].url.searchParams.has('access_token')).toBe(false);
    expect(calls[0].body).toEqual({
      msgtype: 'text',
      text: { content: 'hello' },
    });
  });
});

describe('Hardware', () => {
  it('exchanges model_ticket for model_access_token', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('get_model_token')) {
        return {
          model_access_token: 'model-token',
          expires_in: 7200,
        };
      }
      return { errcode: 0, errmsg: 'ok', device_secret: 'dev-secret' };
    });
    const hardware = new Hardware({
      modelId: 'model-1',
      modelSecret: 'model-secret',
      modelTicket: 'model-ticket',
      fetch,
    });
    const ret = await hardware.getDeviceSecret('auth-code');
    expect(ret.device_secret).toBe('dev-secret');
    expect(calls[0].url.pathname).toContain('/openhw/get_model_token');
    expect(calls[1].url.searchParams.get('model_access_token')).toBe(
      'model-token'
    );
  });

  it('creates a device token config', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('get_model_token')) {
        return { model_access_token: 'model-token', expires_in: 7200 };
      }
      if (request.url.pathname.includes('get_device_token')) {
        return { device_access_token: 'device-token', expires_in: 7200 };
      }
      return { errcode: 0, errmsg: 'ok' };
    });
    const hardware = new Hardware({
      modelId: 'model-1',
      modelSecret: 'model-secret',
      modelTicket: 'model-ticket',
      fetch,
    });
    const device = new Message(
      hardware.device({ deviceSn: 'SN1', deviceSecret: 'dev-secret' })
    );
    await device.request({ url: '/openhw/device/ping', skipAuth: false });
    const ping = calls.at(-1);
    expect(ping?.url.searchParams.get('device_access_token')).toBe(
      'device-token'
    );
  });
});

describe('AiBot', () => {
  it('subscribes after the socket opens and replies to messages', async () => {
    const socket = createFakeSocket();
    const bot = new AiBot({
      botId: 'bot-1',
      secret: 'bot-secret',
      heartbeatMs: 0,
      reconnect: false,
      webSocket: socket.WebSocket,
    });
    const connected = bot.connect();
    await socket.opened;
    const subscribe = JSON.parse(socket.instance!.sent[0]) as {
      cmd: string;
      headers: { req_id: string };
      body: { bot_id: string };
    };
    expect(subscribe.cmd).toBe('aibot_subscribe');
    expect(subscribe.body.bot_id).toBe('bot-1');
    socket.instance!.emit(
      'message',
      JSON.stringify({
        headers: { req_id: subscribe.headers.req_id },
        errcode: 0,
        errmsg: 'ok',
      })
    );
    await connected;

    const seen: string[] = [];
    bot.on('message', async (frame, reply) => {
      seen.push(frame.body?.text?.content ?? '');
      await reply.markdown('pong');
    });
    socket.instance!.emit(
      'message',
      JSON.stringify({
        cmd: 'aibot_msg_callback',
        headers: { req_id: 'msg-1' },
        body: { msgtype: 'text', text: { content: 'hello' } },
      })
    );
    await Promise.resolve();
    const reply = socket.instance!.sent
      .map((item) => JSON.parse(item) as { cmd: string; body?: { msgtype?: string } })
      .find((item) => item.cmd === 'aibot_respond_msg');
    expect(seen).toEqual(['hello']);
    expect(reply?.body?.msgtype).toBe('markdown');
  });
});

function createFakeSocket() {
  let instance: FakeWebSocket | undefined;
  let markOpened!: () => void;
  const opened = new Promise<void>((resolve) => {
    markOpened = resolve;
  });

  class FakeWebSocket {
    static OPEN = 1;
    static CONNECTING = 0;
    static CLOSING = 2;
    static CLOSED = 3;
    readyState = 0;
    sent: string[] = [];
    private readonly listeners = new Map<string, Set<(event: unknown) => void>>();

    constructor(public url: string) {
      instance = this;
      queueMicrotask(() => {
        this.readyState = 1;
        this.dispatch('open');
        markOpened();
      });
    }

    send(data: string): void {
      this.sent.push(data);
    }

    close(): void {
      this.readyState = 3;
      this.dispatch('close');
    }

    addEventListener(type: string, listener: (event: unknown) => void): void {
      const bucket = this.listeners.get(type) ?? new Set();
      bucket.add(listener);
      this.listeners.set(type, bucket);
    }

    removeEventListener(type: string, listener: (event: unknown) => void): void {
      this.listeners.get(type)?.delete(listener);
    }

    emit(type: string, data?: unknown): void {
      this.dispatch(type, type === 'message' ? { data } : data);
    }

    private dispatch(type: string, event: unknown = {}): void {
      for (const listener of this.listeners.get(type) ?? []) {
        listener(event);
      }
    }
  }

  return {
    WebSocket: FakeWebSocket as unknown as typeof WebSocket,
    opened,
    get instance() {
      return instance;
    },
  };
}
