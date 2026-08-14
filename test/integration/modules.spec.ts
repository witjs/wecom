import { describe, expect, it } from 'vitest';
import { Agent, Checkin, Message, User } from '../../src';
import { integrationEnabled, requireEnv } from './setup';

describe.skipIf(!integrationEnabled())('live WeCom APIs', () => {
  it('reads a user list without throwing', async () => {
    const user = new User({
      corpId: requireEnv('CORPID'),
      corpSecret: requireEnv('DIRECTORY_SECRET'),
    });
    const ret = await user.simpleList(1);
    expect(ret.errcode).toBe(0);
  });

  it('reads agent detail', async () => {
    const agent = new Agent({
      corpId: requireEnv('CORPID'),
      corpSecret: requireEnv('TEST_SECRET'),
      agentId: Number(requireEnv('TEST_AGENT_ID')),
    });
    const ret = await agent.get();
    expect(ret.agentid).toBe(Number(requireEnv('TEST_AGENT_ID')));
  });

  it('sends a text message', async () => {
    const message = new Message({
      corpId: requireEnv('CORPID'),
      corpSecret: requireEnv('TEST_SECRET'),
    });
    const ret = await message.send(
      {
        touser: process.env.TEST_USERID ?? '@all',
        msgtype: 'text',
        text: { content: 'wecom v1 integration test' },
      },
      Number(requireEnv('TEST_AGENT_ID'))
    );
    expect(ret.errcode).toBe(0);
  });

  it('reads checkin options when secret exists', async () => {
    if (!process.env.CHECKIN_SECRET) {
      return;
    }
    const checkin = new Checkin({
      corpId: requireEnv('CORPID'),
      corpSecret: process.env.CHECKIN_SECRET,
    });
    const ret = await checkin.getCheckinOption({
      datetime: Math.floor(Date.now() / 1000),
      useridlist: [process.env.TEST_USERID ?? ''],
    });
    expect(ret.errcode).toBe(0);
  });
});
