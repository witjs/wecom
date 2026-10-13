# 配置

业务模块通过**组合**复用共享的 `Wecom` 请求内核（兼容写法仍是 `new User(config)`）。推荐 `createClient(config)` 一次拿到共享 transport / token 的模块集合。`Agent` / `AgentMenu` 额外要求 `agentId`；`Message` 也可在配置里设默认 `agentId`，发送时仍可覆盖。

```ts
import { User } from 'wecom';

const user = new User({
  corpId: process.env.CORPID!,
  corpSecret: process.env.DIRECTORY_SECRET!,
  timeout: 10_000,
  retryTimes: 2,
});
```

## 字段

| 参数            | 类型                     | 必填     | 默认值                                 | 说明                                  |
| --------------- | ------------------------ | -------- | -------------------------------------- | ------------------------------------- |
| `corpId`        | `string`                 | 自建时是 | —                                      | 企业 ID                               |
| `corpSecret`    | `string`                 | 自建时是 | —                                      | 应用 Secret                           |
| `tokenProvider` | `TokenProvider`          | 否       | —                                      | 外部换票；传入后不再要求 `corpSecret` |
| `tokenParam`    | `TokenParam`             | 否       | `access_token`                         | 自动附加的 query 名                   |
| `baseURL`       | `string`                 | 否       | `https://qyapi.weixin.qq.com/cgi-bin/` | 接口前缀，会自动补 `/`                |
| `retryTimes`    | `number`                 | 否       | `3`                                    | 可恢复错误的额外重试次数，允许 `0`    |
| `timeout`       | `number`                 | 否       | `30000`                                | 单次请求超时，毫秒                    |
| `headers`       | `Record<string, string>` | 否       | `{}`                                   | 额外请求头                            |
| `fetch`         | `typeof fetch`           | 否       | 全局 `fetch`                           | 自定义传输，便于测试或代理            |
| `tokenStore`    | `TokenStore`             | 否       | 内存缓存                               | 可替换的 Token 存储                   |
| `logger`        | `WecomLogger`            | 否       | —                                      | `debug` / `info` / `warn` / `error`   |
| `signal`        | `AbortSignal`            | 否       | —                                      | 全局取消信号                          |

校验规则：

- 自建应用强制 `corpId` 和 `corpSecret`；传入 `tokenProvider` 时改为用外部换票
- `retryTimes` 必须是大于等于 `0` 的有限数字
- `timeout` 必须是大于 `0` 的有限数字

## 推荐：createClient / createScope

```ts
import { createClient, createScope } from 'wecom';

const client = createClient({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
  agentId: Number(process.env.TEST_AGENT_ID),
});

await client.user.get('alice');
await client.message.send({
  touser: 'alice',
  msgtype: 'text',
  text: { content: 'hi' },
});

// 多租户：每个租户一个 scope（建议再配独立 tokenStore），不要用进程级全局配置
const tenant = createScope({
  corpId: process.env.CORPID!,
  corpSecret: process.env.SECRET_A!,
});
const a = tenant.createClient();
```

也支持子路径导入：`import { User } from 'wecom/user'`。

## 全局配置（已降级）

`Wecom.setGlobal()` 仍然可用，但已 deprecated。多租户或测试隔离请用 `createScope` / 显式传配置，避免进程级串扰。

```ts
import { Wecom, User } from 'wecom';

Wecom.setGlobal({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});

const user = new User();
```

实例配置会覆盖全局配置；`headers` 会浅合并。

## 自定义 fetch

需要走代理、记录流量或写单测时，传入自己的 `fetch`：

```ts
const wecom = new Wecom({
  corpId,
  corpSecret,
  fetch: async (input, init) => {
    const url = new URL(String(input));
    url.hostname = 'proxy.example.com';
    return fetch(url, init);
  },
});
```

## 请求级选项

`request()` 不再接受 Axios 配置，改用：

```ts
await wecom.request({
  url: '/user/get',
  method: 'GET',
  params: { userid: 'alice' },
  data: undefined,
  headers: { 'X-Debug': '1' },
  timeout: 5000,
  signal,
  skipAuth: false,
  responseType: 'json',
});
```

下载素材时把 `responseType` 设为 `'arrayBuffer'`。HTTP `206` 视为成功。
