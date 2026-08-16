import { afterEach, describe, expect, it } from 'vitest';
import { Agent, AgentMenu, Message, WecomConfigError } from '../../src';
import { createWecomFetch, resetSdkState } from '../helpers/mock-fetch';

const config = {
  corpId: 'ww-corp',
  corpSecret: 'secret',
};

afterEach(() => {
  resetSdkState();
});

function lastApiCall(
  calls: { url: URL; method: string; body: unknown; headers: Headers }[]
) {
  return calls.filter((call) => !call.url.pathname.includes('gettoken')).at(-1);
}

describe('Agent', () => {
  it('throws when agentId is missing', () => {
    expect(
      () => new Agent({ ...config, agentId: 0, fetch: globalThis.fetch })
    ).toThrow(WecomConfigError);
  });

  it('does not mutate workbench payloads when injecting agentid', async () => {
    const { fetch, calls } = createWecomFetch();
    const agent = new Agent({ ...config, agentId: 1000002, fetch });
    const template = { type: 'normal' as const };
    const data = { type: 'normal' as const, userid: 'alice' };
    await agent.setWorkbenchTemplate(template);
    await agent.setWorkbenchData(data);
    expect(template).toEqual({ type: 'normal' });
    expect(data).toEqual({ type: 'normal', userid: 'alice' });
    expect(lastApiCall(calls)?.body).toMatchObject({
      agentid: 1000002,
      userid: 'alice',
    });
  });
});

describe('AgentMenu', () => {
  it('keeps agentid in the query string', async () => {
    const { fetch, calls } = createWecomFetch();
    const menu = new AgentMenu({ ...config, agentId: 1000002, fetch });
    await menu.get();
    expect(lastApiCall(calls)?.url.searchParams.get('agentid')).toBe('1000002');
  });
});

describe('Message', () => {
  it('throws when agentid is missing', () => {
    const { fetch } = createWecomFetch();
    const message = new Message({ ...config, fetch });
    expect(() =>
      message.send({
        touser: 'alice',
        msgtype: 'text',
        text: { content: 'hi' },
      })
    ).toThrow(WecomConfigError);
  });

  it('prefers agentid already present on the payload', async () => {
    const { fetch, calls } = createWecomFetch();
    const message = new Message({ ...config, fetch });
    await message.send(
      {
        touser: 'alice',
        msgtype: 'text',
        agentid: 8,
        text: { content: 'hi' },
      },
      1000002
    );
    expect(lastApiCall(calls)?.body).toMatchObject({ agentid: 8 });
  });
});
