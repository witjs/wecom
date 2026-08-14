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
import { AgentMenu, AppChat, Message, Schedule, User, Wecom } from '../../src';

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
});
