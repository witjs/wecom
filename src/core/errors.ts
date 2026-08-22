export interface WecomErrorOptions {
  message: string;
  code?: number;
  requestId?: string;
  retryable?: boolean;
  response?: unknown;
  cause?: unknown;
}

export class WecomError extends Error {
  readonly code?: number;
  readonly requestId?: string;
  readonly retryable: boolean;
  readonly response?: unknown;

  constructor(options: WecomErrorOptions) {
    super(
      options.message,
      options.cause ? { cause: options.cause } : undefined
    );
    this.name = new.target.name;
    this.code = options.code;
    this.requestId = options.requestId;
    this.retryable = options.retryable ?? false;
    this.response = options.response;
  }
}

export class WecomConfigError extends WecomError {
  constructor(message: string) {
    super({ message, retryable: false });
  }
}

export class WecomCallbackError extends WecomError {
  constructor(message: string, cause?: unknown) {
    super({ message, retryable: false, cause });
  }
}

export class WecomApiError extends WecomError {
  readonly errcode: number;
  readonly errmsg: string;

  constructor(options: {
    errcode: number;
    errmsg: string;
    requestId?: string;
    retryable?: boolean;
    response?: unknown;
  }) {
    super({
      message: options.errmsg || `WeCom API error ${options.errcode}`,
      code: options.errcode,
      requestId: options.requestId,
      retryable: options.retryable ?? isRetryableErrcode(options.errcode),
      response: options.response,
    });
    this.errcode = options.errcode;
    this.errmsg = options.errmsg;
  }
}

export class WecomHttpError extends WecomError {
  readonly status: number;

  constructor(options: {
    status: number;
    message?: string;
    requestId?: string;
    retryable?: boolean;
    response?: unknown;
  }) {
    super({
      message: options.message ?? `HTTP ${options.status}`,
      code: options.status,
      requestId: options.requestId,
      retryable:
        options.retryable ?? (options.status >= 500 || options.status === 429),
      response: options.response,
    });
    this.status = options.status;
  }
}

export class WecomTimeoutError extends WecomError {
  constructor(message = 'Request timed out', cause?: unknown) {
    super({ message, retryable: true, cause });
  }
}

export class WecomAbortError extends WecomError {
  constructor(message = 'Request aborted', cause?: unknown) {
    super({ message, retryable: false, cause });
  }
}

export class WecomNetworkError extends WecomError {
  constructor(message = 'Network request failed', cause?: unknown) {
    super({ message, retryable: true, cause });
  }
}

export const TOKEN_INVALID_CODES = new Set([40014, 42001]);
export const RATE_LIMIT_CODES = new Set([45009, 45033, -1]);

export function isRetryableErrcode(errcode: number): boolean {
  return TOKEN_INVALID_CODES.has(errcode) || RATE_LIMIT_CODES.has(errcode);
}

export function isTokenInvalidErrcode(errcode: number): boolean {
  return TOKEN_INVALID_CODES.has(errcode);
}
