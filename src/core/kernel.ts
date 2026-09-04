import type { BaseRet } from '../common/interface';
import {
  WecomApiError,
  WecomError,
  WecomHttpError,
  isTokenInvalidErrcode,
} from './errors';
import type { FetchTransport } from './transport';
import type { TokenParam, WecomLogger, WecomRequestOptions } from './types';

export interface RequestKernelAuth {
  tokenParam: TokenParam;
  getToken: () => Promise<string>;
  invalidateToken?: () => Promise<void>;
}

export interface RequestKernelOptions {
  transport: FetchTransport;
  retryTimes: number;
  logger?: WecomLogger;
  signal?: AbortSignal;
  /** When set, authenticated requests inject the token query param. */
  auth?: RequestKernelAuth;
}

/**
 * Shared request / retry / error policy used by Wecom and unauthenticated
 * clients such as Webhook.
 */
export class RequestKernel {
  constructor(private readonly options: RequestKernelOptions) {}

  async request<T = BaseRet>(options: WecomRequestOptions): Promise<T> {
    return this.sendWithRetry<T>(options, this.options.retryTimes);
  }

  private async sendWithRetry<T>(
    options: WecomRequestOptions,
    retriesLeft: number
  ): Promise<T> {
    try {
      return await this.sendOnce<T>(options);
    } catch (error) {
      if (
        error instanceof WecomError &&
        error.retryable &&
        retriesLeft > 0 &&
        !isUserAborted(options.signal, this.options.signal)
      ) {
        if (
          error instanceof WecomApiError &&
          isTokenInvalidErrcode(error.errcode)
        ) {
          await this.options.auth?.invalidateToken?.();
        }
        this.options.logger?.warn?.('wecom.retry', {
          url: options.url,
          retriesLeft,
          message: error.message,
        });
        await delay(backoffMs(this.options.retryTimes - retriesLeft));
        return this.sendWithRetry(options, retriesLeft - 1);
      }
      throw error;
    }
  }

  private async sendOnce<T>(options: WecomRequestOptions): Promise<T> {
    const params = { ...options.params };
    const auth = this.options.auth;
    if (auth && !options.skipAuth) {
      params[auth.tokenParam] = await auth.getToken();
    }

    const response = await this.options.transport.request<T & Partial<BaseRet>>(
      {
        ...options,
        params,
      }
    );
    const requestId =
      response.headers.get('x-request-id') ??
      response.headers.get('request-id') ??
      undefined;
    const data = response.data;

    if (isBaseRet(data) && data.errcode !== 0) {
      throw new WecomApiError({
        errcode: data.errcode,
        errmsg: data.errmsg,
        requestId,
        response: data,
      });
    }

    if (response.status === 401) {
      await this.options.auth?.invalidateToken?.();
      throw new WecomHttpError({
        status: 401,
        requestId,
        retryable: true,
        response: data,
      });
    }

    if (!isHttpSuccess(response.status)) {
      throw new WecomHttpError({
        status: response.status,
        requestId,
        response: data,
      });
    }

    return data as T;
  }
}

function isBaseRet(value: unknown): value is BaseRet {
  return (
    typeof value === 'object' &&
    value !== null &&
    'errcode' in value &&
    typeof (value as BaseRet).errcode === 'number'
  );
}

function isHttpSuccess(status: number): boolean {
  return (status >= 200 && status < 300) || status === 206;
}

function isUserAborted(
  requestSignal?: AbortSignal,
  configSignal?: AbortSignal
): boolean {
  return Boolean(requestSignal?.aborted || configSignal?.aborted);
}

function backoffMs(attempt: number): number {
  return Math.min(200 * 2 ** attempt, 2000);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
