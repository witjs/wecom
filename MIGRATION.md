# 从 0.8 迁移到 1.0

v1 尽量保留了 `User`、`Message`、`Agent` 等类名和方法名，但按现代 SDK 实践调整了返回值、错误模型和运行时依赖。这是一次主版本 breaking change。

## 环境

- 最低 Node.js 版本从隐式 14 提升到 **22.18**
- 包同时提供 ESM 和 CommonJS
- 运行时不再依赖 `axios` 和 `form-data`

## 返回值

以前：

```ts
const { data } = await user.get('userid');
if (data.errcode !== 0) {
  throw new Error(data.errmsg);
}
```

现在：

```ts
const userInfo = await user.get('userid');
```

模块方法和 `wecom.request()` 都直接返回业务对象，不再包装 `AxiosResponse`。

## 错误处理

以前业务错误不抛出，调用方检查 `errcode`。

现在 `errcode !== 0`、HTTP 错误、超时和配置错误都会抛出：

```ts
import { WecomApiError } from 'wecom';

try {
  await user.get('missing');
} catch (error) {
  if (error instanceof WecomApiError) {
    console.error(error.errcode, error.errmsg, error.retryable);
  }
}
```

## 请求配置

`request()` 不再接受 `AxiosRequestConfig`。请改用：

```ts
await wecom.request({
  url: '/user/get',
  method: 'GET',
  params: { userid: 'alice' },
  data: undefined,
  headers: { 'X-Debug': '1' },
  signal,
});
```

已移除公开的 `wecom.client`。如需代理或拦截，传入自定义 `fetch`。

## 已移除 API

- `createApi()` / `wecom.api`
- axios 实例和 axios 类型
- 对调用方入参的原地修改（`Message.send`、`Agent.set`）

`Wecom.setGlobal()` 仍可用，但已 deprecated。

## 类型修正

这些类型按官方字段做了修正，可能影响现有 TypeScript 代码：

- 文件消息从错误的 `voice` 改为 `file.media_id`
- 小程序通知 `title` 不再写死为固定字面量
- `AgentRet.agentid` 改为 `number`
- 消息接收部门字段改为官方的 `toparty`
- 全部 DTO / 响应类型可从 `wecom` 包根导入

```ts
import type { IUserCreateDto, IMessage, SendableMessage } from 'wecom';
```

不要再从 `wecom/src/...` 或 `wecom/dist/...` 深路径导入。

## 配置校验

- `retryTimes: 0` 现在合法，表示不重试
- 只强制校验 `corpId` 和 `corpSecret`，不再把所有字段当成必填

## 建议的升级步骤

1. 升级到 Node.js 22.18+
2. 安装 `wecom@next`（当前是 `1.0.0-rc.1`；`wecom@1` 要等正式版）
3. 去掉所有 `const { data } = await ...`，改为直接使用返回值
4. 用 `try/catch` + `WecomApiError` 替换 `errcode` 判断
5. 把 axios 配置迁移到 `fetch` / `headers` / `timeout` / `signal`
6. 按本文修正消息和 agent 类型
