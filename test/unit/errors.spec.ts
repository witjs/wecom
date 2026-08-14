import { describe, expect, it } from 'vitest';
import {
  WecomApiError,
  WecomConfigError,
  WecomError,
  WecomHttpError,
  WecomNetworkError,
  WecomTimeoutError,
} from '../../src';
import {
  isRetryableErrcode,
  isTokenInvalidErrcode,
} from '../../src/core/errors';

describe('WecomError hierarchy', () => {
  it('preserves name, requestId and cause', () => {
    const cause = new Error('upstream');
    const error = new WecomError({
      message: 'failed',
      code: 500,
      requestId: 'req-1',
      retryable: true,
      response: { ok: false },
      cause,
    });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('WecomError');
    expect(error.code).toBe(500);
    expect(error.requestId).toBe('req-1');
    expect(error.retryable).toBe(true);
    expect(error.response).toEqual({ ok: false });
    expect(error.cause).toBe(cause);
  });

  it('defaults retryable to false', () => {
    expect(new WecomError({ message: 'x' }).retryable).toBe(false);
  });

  it('marks config errors as non-retryable', () => {
    const error = new WecomConfigError('corpId should not be empty');
    expect(error.name).toBe('WecomConfigError');
    expect(error.retryable).toBe(false);
  });

  it('exposes errcode/errmsg and infers retryable API errors', () => {
    const retryable = new WecomApiError({
      errcode: 40014,
      errmsg: 'invalid token',
    });
    const fatal = new WecomApiError({
      errcode: 60003,
      errmsg: 'invalid user',
    });
    expect(retryable.errcode).toBe(40014);
    expect(retryable.errmsg).toBe('invalid token');
    expect(retryable.retryable).toBe(true);
    expect(fatal.retryable).toBe(false);
  });

  it('falls back to a default API error message', () => {
    const error = new WecomApiError({ errcode: 1, errmsg: '' });
    expect(error.message).toBe('WeCom API error 1');
  });

  it('marks HTTP 5xx and 429 as retryable', () => {
    expect(new WecomHttpError({ status: 500 }).retryable).toBe(true);
    expect(new WecomHttpError({ status: 429 }).retryable).toBe(true);
    expect(new WecomHttpError({ status: 404 }).retryable).toBe(false);
    expect(new WecomHttpError({ status: 401 }).status).toBe(401);
    expect(new WecomHttpError({ status: 502 }).message).toBe('HTTP 502');
  });

  it('marks timeout and network errors as retryable', () => {
    expect(new WecomTimeoutError().retryable).toBe(true);
    expect(new WecomNetworkError().retryable).toBe(true);
    expect(new WecomTimeoutError().name).toBe('WecomTimeoutError');
    expect(new WecomNetworkError().name).toBe('WecomNetworkError');
  });
});

describe('errcode helpers', () => {
  it('treats token invalid and rate-limit codes as retryable', () => {
    expect(isRetryableErrcode(40014)).toBe(true);
    expect(isRetryableErrcode(42001)).toBe(true);
    expect(isRetryableErrcode(45009)).toBe(true);
    expect(isRetryableErrcode(45033)).toBe(true);
    expect(isRetryableErrcode(-1)).toBe(true);
    expect(isRetryableErrcode(60003)).toBe(false);
  });

  it('identifies token invalid codes only', () => {
    expect(isTokenInvalidErrcode(40014)).toBe(true);
    expect(isTokenInvalidErrcode(42001)).toBe(true);
    expect(isTokenInvalidErrcode(45009)).toBe(false);
  });
});
