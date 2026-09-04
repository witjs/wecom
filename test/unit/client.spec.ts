import { afterEach, describe, expect, it } from 'vitest';
import { MemoryTokenStore, createClient, createScope, Wecom } from '../../src';
import { createWecomFetch, resetSdkState } from '../helpers/mock-fetch';

const baseConfig = {
  corpId: 'ww-corp',
  corpSecret: 'secret',
};

afterEach(() => {
  resetSdkState();
});

describe('createClient', () => {
  it('shares one Wecom across modules', async () => {
    const { fetch, calls } = createWecomFetch({
      get: () => ({ errcode: 0, errmsg: 'ok', userid: 'alice' }),
    });
    const client = createClient({ ...baseConfig, fetch, agentId: 1000002 });
    await client.user.get('alice');
    await client.message.send({
      touser: 'alice',
      msgtype: 'text',
      text: { content: 'hi' },
    });
    expect(client.user.config.tokenCacheKey).toBe(
      client.message.config.tokenCacheKey
    );
    expect(client.wecom).toBeInstanceOf(Wecom);
    const tokens = calls.filter((c) => c.url.pathname.includes('gettoken'));
    expect(tokens).toHaveLength(1);
    expect(client.message.agentId).toBe(1000002);
  });

  it('agent() and agentMenu() share the same client', async () => {
    const { fetch, calls } = createWecomFetch();
    const client = createClient({ ...baseConfig, fetch });
    const agent = client.agent(1000002);
    await agent.list();
    await client.user.getToken();
    expect(
      calls.filter((c) => c.url.pathname.includes('gettoken'))
    ).toHaveLength(1);
    expect(agent.agentId).toBe(1000002);
  });
});

describe('createScope', () => {
  it('applies scoped defaults without setGlobal', () => {
    const scope = createScope({
      corpId: 'scope-corp',
      corpSecret: 'scope-secret',
      retryTimes: 1,
    });
    const { fetch } = createWecomFetch();
    const client = scope.createClient({ fetch });
    expect(client.wecom.config.corpId).toBe('scope-corp');
    expect(client.wecom.config.retryTimes).toBe(1);
    // Scope must not write process-wide globals
    expect(() => new Wecom({ fetch })).toThrow(/corpId/);
  });

  it('isolates multi-tenant token caches with separate stores', async () => {
    const { fetch, calls } = createWecomFetch();
    const tenantA = createScope({
      corpId: 'corp-a',
      corpSecret: 'secret-a',
      tokenStore: new MemoryTokenStore(),
    });
    const tenantB = createScope({
      corpId: 'corp-b',
      corpSecret: 'secret-b',
      tokenStore: new MemoryTokenStore(),
    });
    await tenantA.createClient({ fetch }).wecom.getToken();
    await tenantB.createClient({ fetch }).wecom.getToken();
    expect(
      calls.filter((c) => c.url.pathname.includes('gettoken'))
    ).toHaveLength(2);
  });

  it('does not leak credentials across scopes with same corpId but different stores', async () => {
    const { fetch, calls } = createWecomFetch();
    const storeA = new MemoryTokenStore();
    const storeB = new MemoryTokenStore();
    await createScope({
      ...baseConfig,
      tokenStore: storeA,
    })
      .createClient({ fetch })
      .wecom.getToken();
    await createScope({
      ...baseConfig,
      tokenStore: storeB,
    })
      .createClient({ fetch })
      .wecom.getToken();
    expect(
      calls.filter((c) => c.url.pathname.includes('gettoken'))
    ).toHaveLength(2);
  });
});
