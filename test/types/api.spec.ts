import { describe, expectTypeOf, it } from 'vitest';
import type {
  AgentRet,
  IMessage,
  IUserCreateDto,
  SendableMessage,
  WecomRequestOptions,
} from '../../src';
import { Message, User, Wecom } from '../../src';

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
});
