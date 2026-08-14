# Token 与重试

## 共享缓存

SDK 按 `corpId + corpSecret + baseURL` 共享一份 Token。多个 `User` / `Message` 实例只要凭证相同，就不会各自打 `gettoken`。

默认使用进程内 `MemoryTokenStore`。过期前 60 秒会提前刷新；并发刷新会合并成一次请求。

## 自定义 TokenStore

多进程或需要落盘时，实现 `TokenStore`：

```ts
import { Message, type TokenStore, type TokenRecord } from 'wecom';

const redisStore: TokenStore = {
  async get(key) {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as TokenRecord) : undefined;
  },
  async set(key, record) {
    await redis.set(key, JSON.stringify(record));
  },
  async delete(key) {
    await redis.del(key);
  },
};

const message = new Message({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
  tokenStore: redisStore,
});
```

`TokenRecord` 包含 `accessToken` 和毫秒时间戳 `expiresAt`。

## 手动取 Token

```ts
const token = await wecom.getToken();
```

一般不需要自己拼 `access_token`，`request()` 会自动带上。未封装接口设 `skipAuth: true` 可跳过。

## 重试

以下错误默认 `retryable: true`，会按 `retryTimes` 退避重试（200ms 起，上限 2s）：

- Token 失效：`40014`、`42001`（重试前会作废缓存）
- 限流：`45009`、`45033`、`-1`
- HTTP `429` 和 `5xx`
- 超时 `WecomTimeoutError`
- 网络 `WecomNetworkError`

调用方主动 `abort` 后不会重试。`retryTimes: 0` 表示不重试。
