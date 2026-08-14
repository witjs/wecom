# Wecom

底层客户端。各业务模块都继承它。未封装的接口用 `request()`。

```ts
import { Wecom } from 'wecom';

const wecom = new Wecom({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 构造

```ts
new Wecom(config?: Partial<WecomConfig>)
```

配置见 [配置](/guide/config)。缺少 `corpId` 或 `corpSecret` 会抛 `WecomConfigError`。

## 使用说明

| 项     | 说明                                                                          |
| ------ | ----------------------------------------------------------------------------- |
| Secret | 与目标接口匹配的应用 Secret、通讯录同步 Secret 或功能应用 Secret              |
| 权限   | 取决于具体接口；`request()` 不会补齐业务权限                                  |
| 官方   | [获取 access_token](https://developer.work.weixin.qq.com/document/path/91039) |

## 方法

| 方法                  | 说明                                    |
| --------------------- | --------------------------------------- |
| `getToken()`          | 返回当前可用 `access_token`，必要时刷新 |
| `request<T>(options)` | 发送已鉴权请求，返回业务数据 `T`        |
| `setGlobal(config)`   | 写入全局默认配置，已 deprecated         |

### request

```ts
interface WecomRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  skipAuth?: boolean;
  timeout?: number;
  responseType?: 'json' | 'arrayBuffer';
}
```

`url` 相对 `baseURL`。默认自动附加 `access_token`。`data` 为对象时发 JSON；`FormData` 会按 multipart 发送。

```ts
const ret = await wecom.request({
  url: '/message/send',
  method: 'POST',
  data: {
    touser: 'userid',
    msgtype: 'text',
    agentid: 1000002,
    text: { content: 'hello' },
  },
});
```

## 导出的辅助类型

```ts
import type {
  ResolvedWecomConfig,
  TokenRecord,
  TokenStore,
  WecomConfig,
  WecomLogger,
  WecomRequestOptions,
} from 'wecom';
import { MemoryTokenStore } from 'wecom';
```
