import { resetGlobalConfig } from '../../src/core/config';
import { resetTokenManagers } from '../../src/core/token';

export interface MockRequest {
  url: URL;
  method: string;
  headers: Headers;
  body: unknown;
}

export type MockHandler = (
  request: MockRequest
) =>
  | Response
  | Record<string, unknown>
  | Promise<Response | Record<string, unknown>>;

export function jsonResponse(
  body: unknown,
  init: ResponseInit = { status: 200 }
): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
}

export function createMockFetch(handler: MockHandler) {
  const calls: MockRequest[] = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = new URL(String(input));
    const request: MockRequest = {
      url,
      method: init?.method ?? 'GET',
      headers: new Headers(init?.headers),
      body: await parseBody(init?.body),
    };
    calls.push(request);
    const result = await Promise.race([
      Promise.resolve(handler(request)),
      abortPromise(init?.signal ?? undefined),
    ]);
    return result instanceof Response ? result : jsonResponse(result);
  };
  return { fetch: fetchImpl, calls };
}

export function createWecomFetch(overrides: Record<string, MockHandler> = {}) {
  return createMockFetch(async (request) => {
    const path = request.url.pathname.replace(/\/cgi-bin\/?/, '/');
    if (path === '/gettoken' || path.endsWith('/gettoken')) {
      if (overrides.gettoken) {
        return overrides.gettoken(request);
      }
      return {
        errcode: 0,
        errmsg: 'ok',
        access_token: 'token-1',
        expires_in: 7200,
      };
    }
    const key = Object.keys(overrides).find((name) =>
      path.endsWith(`/${name}`)
    );
    if (key) {
      return overrides[key](request);
    }
    return { errcode: 0, errmsg: 'ok' };
  });
}

export function resetSdkState(): void {
  resetTokenManagers();
  resetGlobalConfig();
}

function abortPromise(signal?: AbortSignal): Promise<never> {
  return new Promise((_, reject) => {
    if (!signal) {
      return;
    }
    if (signal.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      return;
    }
    signal.addEventListener(
      'abort',
      () => {
        reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

async function parseBody(
  body: RequestInit['body'] | null | undefined
): Promise<unknown> {
  if (!body) {
    return undefined;
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
  if (body instanceof FormData) {
    return body;
  }
  if (body instanceof URLSearchParams) {
    return Object.fromEntries(body.entries());
  }
  return body;
}
