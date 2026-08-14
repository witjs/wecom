import {
  WecomError,
  WecomHttpError,
  WecomNetworkError,
  WecomTimeoutError,
} from './errors';
import type {
  TransportResponse,
  WecomLogger,
  WecomRequestOptions,
} from './types';

export interface FetchTransportOptions {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  fetch: typeof fetch;
  logger?: WecomLogger;
  signal?: AbortSignal;
}

export class FetchTransport {
  constructor(private readonly options: FetchTransportOptions) {}

  async request<T>(
    request: WecomRequestOptions
  ): Promise<TransportResponse<T>> {
    const url = buildURL(this.options.baseURL, request.url, request.params);
    const method = request.method ?? (request.data ? 'POST' : 'GET');
    const headers = new Headers({
      Accept: 'application/json',
      ...this.options.headers,
      ...request.headers,
    });

    const { body, contentType } = encodeBody(request.data);
    if (contentType && !headers.has('Content-Type')) {
      headers.set('Content-Type', contentType);
    }

    const signal = combineSignals([
      this.options.signal,
      request.signal,
      AbortSignal.timeout(request.timeout ?? this.options.timeout),
    ]);

    this.options.logger?.debug?.('wecom.request', { method, url });

    let response: Response;
    try {
      response = await this.options.fetch(url, {
        method,
        headers,
        body,
        signal,
      });
    } catch (error) {
      throw normalizeFetchError(error, signal);
    }

    const requestId =
      response.headers.get('x-request-id') ??
      response.headers.get('request-id') ??
      undefined;
    const data = await parseResponseBody<T>(response, request.responseType);

    this.options.logger?.debug?.('wecom.response', {
      method,
      url,
      status: response.status,
      requestId,
    });

    return {
      status: response.status,
      headers: response.headers,
      data,
      url,
    };
  }
}

export function buildURL(
  baseURL: string,
  path: string,
  params?: Record<string, unknown>
): string {
  const normalizedPath = path.replace(/^\/+/, '');
  const url = new URL(normalizedPath, baseURL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function encodeBody(data: unknown): {
  body?: RequestInit['body'];
  contentType?: string;
} {
  if (data === undefined || data === null) {
    return {};
  }
  if (data instanceof FormData) {
    return { body: data };
  }
  if (data instanceof Blob || data instanceof ArrayBuffer) {
    return { body: data };
  }
  if (typeof data === 'string' || data instanceof URLSearchParams) {
    return { body: data };
  }
  if (Buffer.isBuffer(data)) {
    return { body: new Uint8Array(data) };
  }
  return {
    body: JSON.stringify(data),
    contentType: 'application/json',
  };
}

async function parseResponseBody<T>(
  response: Response,
  responseType: 'json' | 'arrayBuffer' = 'json'
): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  if (responseType === 'arrayBuffer' && !contentType.includes('json')) {
    const buffer = Buffer.from(await response.arrayBuffer());
    return {
      data: buffer,
      contentType,
      filename: parseFilename(response.headers.get('content-disposition')),
      contentRange: response.headers.get('content-range') ?? undefined,
    } as T;
  }

  const text = await response.text();
  if (!text) {
    if (!response.ok) {
      throw new WecomHttpError({
        status: response.status,
        message: `HTTP ${response.status}`,
      });
    }
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    if (!response.ok) {
      throw new WecomHttpError({
        status: response.status,
        message: text,
      });
    }
    throw new WecomHttpError({
      status: response.status,
      message: 'Failed to parse WeCom response as JSON',
      response: text,
    });
  }
}

function parseFilename(contentDisposition: string | null): string | undefined {
  if (!contentDisposition) {
    return undefined;
  }
  const utf8 = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8?.[1]) {
    return decodeURIComponent(utf8[1]);
  }
  const ascii = contentDisposition.match(/filename="?([^"]+)"?/i);
  return ascii?.[1];
}

function normalizeFetchError(error: unknown, signal: AbortSignal): Error {
  if (error instanceof WecomError) {
    return error;
  }
  if (signal.aborted || isAbortError(error)) {
    if (isTimeoutError(error) || isTimeoutError(signal.reason)) {
      return new WecomTimeoutError('Request timed out', error);
    }
    return new WecomTimeoutError('Request aborted', error);
  }
  return new WecomNetworkError(
    error instanceof Error ? error.message : 'Network request failed',
    error
  );
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    ((error as { name: string }).name === 'AbortError' ||
      (error as { name: string }).name === 'TimeoutError')
  );
}

function isTimeoutError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'TimeoutError'
  );
}

export function combineSignals(
  signals: Array<AbortSignal | undefined>
): AbortSignal {
  const active = signals.filter((signal): signal is AbortSignal =>
    Boolean(signal)
  );
  if (active.length === 1) {
    return active[0];
  }
  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any(active);
  }
  const controller = new AbortController();
  for (const signal of active) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      break;
    }
    signal.addEventListener('abort', () => controller.abort(signal.reason), {
      once: true,
    });
  }
  return controller.signal;
}
