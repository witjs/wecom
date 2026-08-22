# 错误处理

v1 不再让调用方检查 `errcode`。业务失败、HTTP 失败、超时和配置错误都会抛出 `WecomError` 子类。

```ts
import { User, WecomApiError, WecomError } from 'wecom';

const user = new User({ corpId, corpSecret });

try {
  await user.get('missing');
} catch (error) {
  if (error instanceof WecomApiError) {
    console.error(error.errcode, error.errmsg, error.retryable);
  } else if (error instanceof WecomError) {
    console.error(error.name, error.message, error.requestId);
  }
  throw error;
}
```

## 错误类型

| 类                  | 场景                                           | 默认可重试           |
| ------------------- | ---------------------------------------------- | -------------------- |
| `WecomConfigError`   | `corpId` / `corpSecret` / `timeout` 等配置非法 | 否                   |
| `WecomCallbackError` | 回调签名错误、解密失败、ReceiveId 不匹配       | 否                   |
| `WecomApiError`     | 企业微信返回 `errcode !== 0`                   | Token 失效和限流为是 |
| `WecomHttpError`    | 非 2xx（`206` 除外）                           | `429` / `5xx` 为是   |
| `WecomTimeoutError` | 超过 `timeout`                                 | 是                   |
| `WecomNetworkError` | DNS / 连接 / fetch 失败                        | 是                   |

`WecomApiError` 额外带 `errcode`、`errmsg`。`WecomHttpError` 带 `status`。基类还有：

- `code`：错误码或 HTTP 状态
- `requestId`：响应头 `x-request-id` / `request-id`
- `retryable`
- `response`：原始响应体
- `cause`：底层异常（超时时常见）

## 判断是否可重试

SDK 已经按 `retryTimes` 自动重试。如果要在业务层再兜一层：

```ts
import { WecomError } from 'wecom';

function shouldRetry(error: unknown): boolean {
  return error instanceof WecomError && error.retryable;
}
```
