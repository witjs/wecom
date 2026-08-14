# 从 0.8 迁移到 1.0

v1 尽量保留了 `User`、`Message`、`Agent` 等类名和方法名，但返回值、错误模型和运行时依赖是 breaking change。

## 环境

- 最低 Node.js 从隐式 14 提升到 **22.18**
- 同时提供 ESM 和 CommonJS
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

模块方法和 `wecom.request()` 都直接返回业务对象。

## 错误处理

以前业务错误不抛出。现在 `errcode !== 0`、HTTP 错误、超时和配置错误都会抛出：

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

`request()` 不再接受 `AxiosRequestConfig`。已移除公开的 `wecom.client`。需要代理或拦截时传入自定义 `fetch`。

## 已移除 API

- `createApi()` / `wecom.api`
- axios 实例和 axios 类型
- 对调用方入参的原地修改（`Message.send`、`Agent.set`）

`Wecom.setGlobal()` 仍可用，但已 deprecated。

## 类型修正

- 文件消息从错误的 `voice` 改为 `file.media_id`
- 小程序通知 `title` 不再写死为固定字面量
- `AgentRet.agentid` 改为 `number`
- 消息接收部门字段改为官方的 `toparty`
- 全部 DTO / 响应类型从 `wecom` 包根导入

```ts
import type { IUserCreateDto, IMessage, SendableMessage } from 'wecom';
```

不要再从 `wecom/src/...` 或 `wecom/dist/...` 深路径导入。

## 建议步骤

1. 升级到 Node.js 22.18+
2. 安装 `wecom@1`
3. 去掉所有 `const { data } = await ...`
4. 用 `try/catch` + `WecomApiError` 替换 `errcode` 判断
5. 把 axios 配置迁移到 `fetch` / `headers` / `timeout` / `signal`
6. 按本文修正消息和 agent 类型
