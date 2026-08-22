import { describe, expectTypeOf, it } from 'vitest';
import type {
  AgentRet,
  AppChatMessage,
  ICreateAgentMenu,
  IMessage,
  IUserCreateDto,
  SendableMessage,
  AddScheduleDto,
  WecomRequestOptions,
} from '../../src';
import {
  AgentMenu,
  AiBot,
  AppChat,
  Callback,
  Hardware,
  Message,
  Provider,
  Schedule,
  Suite,
  User,
  Wecom,
  Webhook,
} from '../../src';

describe('public types', () => {
  it('exports stable constructor and request types', () => {
    expectTypeOf(Wecom).toBeConstructibleWith({
      corpId: 'id',
      corpSecret: 'secret',
    });
    expectTypeOf<WecomRequestOptions>().toHaveProperty('url');
    expectTypeOf<IUserCreateDto>().toHaveProperty('userid');
    expectTypeOf<AgentRet['agentid']>().toEqualTypeOf<number>();
  });

  it('accepts corrected message payloads', () => {
    const file: IMessage.File = {
      msgtype: 'file',
      file: { media_id: 'media' },
    };
    const notice: IMessage.MiniProgramNotice = {
      msgtype: 'miniprogram_notice',
      miniprogram_notice: {
        appid: 'app',
        title: '任意标题',
      },
    };
    expectTypeOf(file).toMatchTypeOf<SendableMessage>();
    expectTypeOf(notice).toMatchTypeOf<SendableMessage>();
    expectTypeOf<
      Parameters<Message['send']>[0]
    >().toMatchTypeOf<SendableMessage>();
    expectTypeOf<
      Parameters<User['create']>[0]
    >().toMatchTypeOf<IUserCreateDto>();
  });

  it('exports split client constructors and types from the package root', () => {
    expectTypeOf(AgentMenu).toBeConstructibleWith({
      corpId: 'id',
      corpSecret: 'secret',
      agentId: 1000002,
    });
    expectTypeOf(AppChat).toBeConstructibleWith({
      corpId: 'id',
      corpSecret: 'secret',
    });
    expectTypeOf(Schedule).toBeConstructibleWith({
      corpId: 'id',
      corpSecret: 'secret',
    });
    expectTypeOf<ICreateAgentMenu>().toHaveProperty('button');
    expectTypeOf<AppChatMessage>().toHaveProperty('chatid');
    expectTypeOf<AddScheduleDto>().toHaveProperty('schedule');
  });

  it('exports identity clients from the package root', () => {
    expectTypeOf(Callback).toBeConstructibleWith({
      token: 'token',
      encodingAESKey: 'jWmYm7qr5nMoAUwZRjGtBxmz3KA1tkAj3ykkR6q2B2C',
      receiveId: 'ww-corp',
    });
    expectTypeOf(Suite).toBeConstructibleWith({
      suiteId: 'ww-suite',
      suiteSecret: 'secret',
    });
    expectTypeOf(Provider).toBeConstructibleWith({
      corpId: 'ww-provider',
      providerSecret: 'secret',
    });
    expectTypeOf(Webhook).toBeConstructibleWith({
      url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=abc',
    });
    expectTypeOf(AiBot).toBeConstructibleWith({
      botId: 'bot',
      secret: 'secret',
    });
    expectTypeOf(Hardware).toBeConstructibleWith({
      modelId: 'model',
      modelSecret: 'secret',
    });
    expectTypeOf(Wecom).toBeConstructibleWith({
      tokenProvider: {
        cacheKey: 'suite-corp:ww:auth:perm:https://qyapi.weixin.qq.com/cgi-bin/',
        fetch: async () => ({ accessToken: 't', expiresIn: 7200 }),
      },
    });
  });
});
