import { describe, expect, it, vi } from 'vitest';
import {
  WecomHttpError,
  WecomNetworkError,
  WecomTimeoutError,
} from '../../src';
import {
  buildURL,
  combineSignals,
  FetchTransport,
} from '../../src/core/transport';
import { createMockFetch, jsonResponse } from '../helpers/mock-fetch';

function createTransport(
  fetchImpl: typeof fetch,
  extra: Partial<ConstructorParameters<typeof FetchTransport>[0]> = {}
) {
  return new FetchTransport({
    baseURL: 'https://qyapi.weixin.qq.com/cgi-bin/',
    timeout: 30_000,
    headers: {},
    fetch: fetchImpl,
    ...extra,
  });
}

describe('buildURL', () => {
  it('joins the path and serializes query params', () => {
    expect(
      buildURL('https://qyapi.weixin.qq.com/cgi-bin/', '/user/get', {
        userid: 'alice',
        extra: 1,
      })
    ).toBe('https://qyapi.weixin.qq.com/cgi-bin/user/get?userid=alice&extra=1');
  });

  it('skips null and undefined params', () => {
    const url = buildURL(
      'https://qyapi.weixin.qq.com/cgi-bin/',
      'department/list',
      {
        id: undefined,
        name: null,
        keep: 'yes',
      }
    );
    expect(url).toBe(
      'https://qyapi.weixin.qq.com/cgi-bin/department/list?keep=yes'
    );
  });
});

describe('combineSignals', () => {
  it('returns the only active signal', () => {
    const controller = new AbortController();
    expect(combineSignals([undefined, controller.signal])).toBe(
      controller.signal
    );
  });

  it('aborts when any combined signal aborts', () => {
    const first = new AbortController();
    const second = new AbortController();
    const combined = combineSignals([first.signal, second.signal]);
    second.abort('stop');
    expect(combined.aborted).toBe(true);
  });
});

describe('FetchTransport', () => {
  it('defaults to GET without a body and POST with JSON data', async () => {
    const { fetch, calls } = createMockFetch(() => ({
      errcode: 0,
      errmsg: 'ok',
    }));
    const transport = createTransport(fetch);
    await transport.request({ url: '/user/get' });
    await transport.request({ url: '/user/create', data: { userid: 'a' } });
    expect(calls[0].method).toBe('GET');
    expect(calls[1].method).toBe('POST');
    expect(calls[1].body).toEqual({ userid: 'a' });
    expect(calls[1].headers.get('content-type')).toContain('application/json');
  });

  it('sends FormData, string and Buffer bodies without forcing JSON', async () => {
    const { fetch, calls } = createMockFetch(() => ({
      errcode: 0,
      errmsg: 'ok',
    }));
    const transport = createTransport(fetch);
    const form = new FormData();
    form.append('media', new Blob(['hi']), 'hi.txt');
    await transport.request({ url: '/media/upload', data: form });
    await transport.request({ url: '/echo', data: 'plain' });
    await transport.request({ url: '/bin', data: Buffer.from('bytes') });
    expect(calls[0].body).toBeInstanceOf(FormData);
    expect(calls[0].headers.get('content-type') ?? '').not.toContain(
      'application/json'
    );
    expect(calls[1].body).toBe('plain');
    expect(calls[2].body).toBeInstanceOf(Uint8Array);
  });

  it('merges default and per-request headers', async () => {
    const { fetch, calls } = createMockFetch(() => ({
      errcode: 0,
      errmsg: 'ok',
    }));
    const transport = createTransport(fetch, {
      headers: { 'X-App': 'wecom' },
    });
    await transport.request({
      url: '/user/get',
      headers: { 'X-Request': '1' },
    });
    expect(calls[0].headers.get('x-app')).toBe('wecom');
    expect(calls[0].headers.get('x-request')).toBe('1');
    expect(calls[0].headers.get('accept')).toBe('application/json');
  });

  it('returns an empty object for a successful empty body', async () => {
    const { fetch } = createMockFetch(() => new Response('', { status: 200 }));
    const transport = createTransport(fetch);
    await expect(transport.request({ url: '/ok' })).resolves.toMatchObject({
      status: 200,
      data: {},
    });
  });

  it('throws WecomHttpError for an empty error body', async () => {
    const { fetch } = createMockFetch(() => new Response('', { status: 502 }));
    const transport = createTransport(fetch);
    await expect(transport.request({ url: '/fail' })).rejects.toMatchObject({
      name: 'WecomHttpError',
      status: 502,
    });
  });

  it('throws when a successful response is not JSON', async () => {
    const { fetch } = createMockFetch(
      () =>
        new Response('not-json', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        })
    );
    const transport = createTransport(fetch);
    await expect(transport.request({ url: '/plain' })).rejects.toBeInstanceOf(
      WecomHttpError
    );
  });

  it('uses the raw text as the HTTP error message', async () => {
    const { fetch } = createMockFetch(
      () => new Response('bad gateway', { status: 502 })
    );
    const transport = createTransport(fetch);
    await expect(transport.request({ url: '/fail' })).rejects.toMatchObject({
      message: 'bad gateway',
      status: 502,
    });
  });

  it('parses binary responses and UTF-8 filenames', async () => {
    const { fetch } = createMockFetch(
      () =>
        new Response(Buffer.from('image-bytes'), {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition':
              "attachment; filename*=UTF-8''%E6%B5%8B%E8%AF%95.png",
            'Content-Range': 'bytes 0-10/11',
          },
        })
    );
    const transport = createTransport(fetch);
    const response = await transport.request<{
      data: Buffer;
      contentType: string;
      filename?: string;
      contentRange?: string;
    }>({
      url: '/media/get',
      responseType: 'arrayBuffer',
    });
    expect(response.data.data.toString()).toBe('image-bytes');
    expect(response.data.contentType).toBe('image/png');
    expect(response.data.filename).toBe('测试.png');
    expect(response.data.contentRange).toBe('bytes 0-10/11');
  });

  it('still parses JSON when responseType is arrayBuffer', async () => {
    const { fetch } = createMockFetch(() => ({
      errcode: 40007,
      errmsg: 'invalid media_id',
    }));
    const transport = createTransport(fetch);
    const response = await transport.request({
      url: '/media/get',
      responseType: 'arrayBuffer',
    });
    expect(response.data).toMatchObject({ errcode: 40007 });
  });

  it('wraps fetch failures as WecomNetworkError', async () => {
    const { fetch } = createMockFetch(() => {
      throw new Error('socket hang up');
    });
    const transport = createTransport(fetch);
    await expect(transport.request({ url: '/user/get' })).rejects.toMatchObject(
      {
        name: 'WecomNetworkError',
        message: 'socket hang up',
      }
    );
    expect(new WecomNetworkError()).toBeInstanceOf(WecomNetworkError);
  });

  it('wraps abort as WecomTimeoutError', async () => {
    const controller = new AbortController();
    const { fetch } = createMockFetch(() => {
      controller.abort();
      throw new DOMException('Aborted', 'AbortError');
    });
    const transport = createTransport(fetch);
    await expect(
      transport.request({ url: '/user/get', signal: controller.signal })
    ).rejects.toBeInstanceOf(WecomTimeoutError);
  });

  it('invokes debug logger hooks', async () => {
    const logger = { debug: vi.fn() };
    const { fetch } = createMockFetch(() =>
      jsonResponse(
        { errcode: 0, errmsg: 'ok' },
        { headers: { 'x-request-id': 'req-9' } }
      )
    );
    const transport = createTransport(fetch, { logger });
    await transport.request({ url: '/user/get' });
    expect(logger.debug).toHaveBeenCalledWith(
      'wecom.request',
      expect.objectContaining({ method: 'GET' })
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'wecom.response',
      expect.objectContaining({ status: 200, requestId: 'req-9' })
    );
  });
});
