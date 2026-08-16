import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { afterEach, describe, expect, it } from 'vitest';
import { Media, WecomApiError, WecomConfigError } from '../../src';
import { toFormData, toUploadPart } from '../../src/modules/media/upload';
import {
  createMockFetch,
  createWecomFetch,
  jsonResponse,
  resetSdkState,
} from '../helpers/mock-fetch';

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

describe('toUploadPart', () => {
  it('wraps a Buffer with the given filename', async () => {
    const part = await toUploadPart(Buffer.from('hello'), 'hello.txt');
    expect(part.name).toBe('hello.txt');
    expect(await part.blob.text()).toBe('hello');
  });

  it('defaults Buffer and Blob names to file', async () => {
    const buffer = await toUploadPart(Buffer.from('x'));
    const blob = await toUploadPart(new Blob(['y']));
    expect(buffer.name).toBe('file');
    expect(blob.name).toBe('file');
    expect(await blob.blob.text()).toBe('y');
  });

  it('reads a file path and uses the basename', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'wecom-media-'));
    const path = join(dir, 'logo.png');
    await writeFile(path, 'png-bytes');
    try {
      const part = await toUploadPart(path);
      expect(part.name).toBe('logo.png');
      expect(await part.blob.text()).toBe('png-bytes');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('consumes a readable stream', async () => {
    const stream = Readable.from([Buffer.from('hel'), 'lo']);
    const part = await toUploadPart(stream, 'stream.bin');
    expect(part.name).toBe('stream.bin');
    expect(await part.blob.text()).toBe('hello');
  });

  it('rejects oversized readable streams before buffering too much data', async () => {
    const stream = Readable.from([Buffer.alloc(20 * 1024 * 1024 + 1)]);
    await expect(toUploadPart(stream, 'large.bin')).rejects.toBeInstanceOf(
      WecomConfigError
    );
  });

  it('builds multipart form data', async () => {
    const form = await toFormData(Buffer.from('hello'), 'hello.txt');
    const file = form.get('media');
    expect(file).toBeInstanceOf(File);
    expect((file as File).name).toBe('hello.txt');
  });
});

describe('Media', () => {
  it('uploads an image to the permanent URL endpoint', async () => {
    const { fetch, calls } = createWecomFetch();
    const media = new Media({ ...config, fetch });
    await media.uploadImg(Buffer.from('img'), 'logo.png');
    const call = lastApiCall(calls);
    expect(call?.url.pathname).toContain('/media/uploadimg');
    expect(call?.body).toBeInstanceOf(FormData);
  });

  it('downloads HD voice from the jssdk path', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      return new Response(Buffer.from('amr'), {
        status: 200,
        headers: { 'Content-Type': 'audio/amr' },
      });
    });
    const media = new Media({ ...config, fetch });
    const file = await media.getHdVoice('voice-1');
    expect(file.data.toString()).toBe('amr');
    expect(lastApiCall(calls)?.url.pathname).toContain('/media/get/jssdk');
    expect(lastApiCall(calls)?.url.searchParams.get('media_id')).toBe(
      'voice-1'
    );
  });

  it('forwards a Range header when downloading media', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      return new Response(Buffer.from('partial'), {
        status: 206,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Range': 'bytes 0-6/20',
        },
      });
    });
    const media = new Media({ ...config, fetch });
    const file = await media.get('media-1', 'bytes=0-6');
    expect(file.contentRange).toBe('bytes 0-6/20');
    expect(lastApiCall(calls)?.headers.get('range')).toBe('bytes=0-6');
  });

  it('throws WecomApiError when media download returns JSON', async () => {
    const { fetch } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      return jsonResponse({ errcode: 40007, errmsg: 'invalid media_id' });
    });
    const media = new Media({ ...config, fetch });
    await expect(media.get('missing')).rejects.toBeInstanceOf(WecomApiError);
  });
});
