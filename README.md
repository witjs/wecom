# 企业微信 Node SDK

面向 Node.js 22.18+ 的企业微信 TypeScript SDK。v1 使用原生 `fetch`、共享 Token、结构化错误，方法直接返回业务数据。零运行时依赖，仅发布 ESM。

已封装通讯录、应用、素材、消息、客户联系、OA、日程、会议室和发票等常用服务端模块。自建应用之外，还按身份提供第三方 / 代开发（`Suite`）、服务商（`Provider`）、回调加解密（`Callback`）、群机器人（`Webhook`）、智能机器人（`AiBot`）和硬件云对云（`Hardware`）。

企业微信文档：[工作台开发文档](https://developer.work.weixin.qq.com/document/path/90664)

## 要求

- Node.js 22.18 及以上
- 仅用于服务端。不要把 `corpSecret` 下发到浏览器

## 安装

当前 v1 是 `1.0.0-rc.3`，发布在 `next` 标签。直接 `pnpm add wecom` 仍会装到稳定版 `0.8.3`。

```bash
pnpm add wecom@next
# 或 npm / yarn：npm i wecom@next
```

## 快速开始

```ts
import { Message, WecomApiError } from 'wecom';

const message = new Message({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});

try {
  const ret = await message.send(
    {
      touser: 'userid',
      msgtype: 'text',
      text: { content: 'hello wecom' },
    },
    Number(process.env.TEST_AGENT_ID)
  );
  console.log(ret.errmsg);
} catch (error) {
  if (error instanceof WecomApiError) {
    console.error(error.errcode, error.errmsg);
  }
  throw error;
}
```

未封装的接口可以用底层逃生口：

```ts
import { Wecom } from 'wecom';

const wecom = new Wecom({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});

const ret = await wecom.request({
  url: '/message/send',
  method: 'POST',
  data: {
    touser: 'userid',
    msgtype: 'text',
    agentid: Number(process.env.TEST_AGENT_ID),
    text: { content: 'hello wecom' },
  },
});
```

## 配置

| 参数          | 类型          |   必填   | 说明                                         |
| :------------ | :------------ | :------: | :------------------------------------------- |
| corpId        | string        | 自建时是 | 企业 ID                                      |
| corpSecret    | string        | 自建时是 | 应用 Secret                                  |
| tokenProvider | TokenProvider |    否    | 外部换票，供 Suite.corp() 等身份复用         |
| baseURL       | string        | 否       | 默认 `https://qyapi.weixin.qq.com/cgi-bin/`  |
| retryTimes    | number        |    否    | 可恢复错误的额外重试次数，默认 `3`，允许 `0` |
| timeout       | number        |    否    | 请求超时，默认 `30000`                       |
| headers       | object        |    否    | 额外请求头                                   |
| fetch         | typeof fetch  |    否    | 自定义 fetch，便于测试或代理                 |
| tokenStore    | TokenStore    |    否    | 可替换的 Token 缓存                          |
| logger        | WecomLogger   |    否    | 调试日志钩子                                 |
| signal        | AbortSignal   |    否    | 全局取消信号                                 |

相同凭证会共享 Token，并合并并发刷新。自建应用的缓存键是 `corp:{corpId}:{corpSecret}:{baseURL}`。

`Wecom.setGlobal()` 仍然可用但已 deprecated。推荐 `createClient(config)` / `createScope(defaults)` 显式共享配置；多租户请用独立 scope（和 `tokenStore`），不要依赖进程全局。

## 模块

每个模块都是独立客户端，从包根或子路径（如 `wecom/user`）导入。可用 `new User(config)` 兼容构造，或 `createClient(config)` 让多个模块共享同一个 `Wecom`（transport / logger / signal / token）。

```ts
import { createClient } from 'wecom';
// 或：import { User } from 'wecom/user';

const client = createClient({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
  agentId: Number(process.env.TEST_AGENT_ID),
});
await client.message.send({
  touser: 'userid',
  msgtype: 'text',
  text: { content: 'hello' },
});
```

| 分组       | 模块                                                                                                                                                                                              | 说明                               |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------- |
| 核心       | [Wecom](docs/api/wecom.md)                                                                                                                                                                        | Token、`request()`、重试           |
| 身份       | [Callback](docs/api/callback.md) / [Suite](docs/api/suite.md) / [Provider](docs/api/provider.md) / [Webhook](docs/api/webhook.md) / [AiBot](docs/api/aibot.md) / [Hardware](docs/api/hardware.md) | 回调、第三方、服务商、机器人、硬件 |
| 通讯录     | [User](docs/api/user.md) / [Department](docs/api/department.md) / [Tag](docs/api/tag.md) / [Batch](docs/api/batch.md)                                                                             | 成员、部门、标签、异步导入         |
| 应用与消息 | [Agent](docs/api/agent.md) / [AgentMenu](docs/api/agent-menu.md) / [Media](docs/api/media.md) / [Message](docs/api/message.md) / [AppChat](docs/api/appchat.md)                                   | 应用、菜单、素材、消息             |
| 客户联系   | [ExternalContact](docs/api/external-contact.md)                                                                                                                                                   | 客户、联系我、群聊、分配           |
| 协作工具   | [Calendar](docs/api/calendar.md) / [Schedule](docs/api/schedule.md) / [MeetingRoom](docs/api/meeting-room.md)                                                                                     | 日历、日程、会议室                 |
| OA         | [Checkin](docs/api/checkin.md) / [Approval](docs/api/approval.md) / [Dial](docs/api/dial.md)                                                                                                      | 打卡、审批、公费电话               |
| 财务       | [Invoice](docs/api/invoice.md)                                                                                                                                                                    | 电子发票查询和报销状态             |

```ts
import {
  Agent,
  AgentMenu,
  Approval,
  Calendar,
  ExternalContact,
  Media,
  MeetingRoom,
  Message,
  Schedule,
  User,
} from 'wecom';
```

上传素材支持 `Buffer`、`Blob`、文件路径和可读流：

```ts
import { Media } from 'wecom';

const media = new Media({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});

await media.upload('./logo.png', 'image');
```

## 错误处理

SDK 会在企业微信 `errcode !== 0`、HTTP 失败、超时和配置错误时抛出：

- `WecomConfigError`
- `WecomApiError`（含 `errcode` / `errmsg`）
- `WecomHttpError`
- `WecomTimeoutError`
- `WecomNetworkError`

可恢复错误（Token 失效、限流、网络抖动、5xx）会按 `retryTimes` 重试。

## 文档

在线文档：<https://witjs.github.io/wecom/>

本地预览（路径带 `/wecom/`，和 GitHub Pages 一致）：

```bash
pnpm docs:dev
```

推到 `next` / `master` / `main` 后，GitHub Actions 会构建并发布到 Pages。仓库 Settings → Pages → Source 选 **GitHub Actions**。

从 0.8 升级请看 [MIGRATION.md](MIGRATION.md)。

## 开发

```bash
pnpm install
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test` 跑单元测试、契约测试和类型测试，用 mock `fetch`，不访问企业微信。

集成测试需要真实凭据：

```bash
cp .env.example .env
WECOM_INTEGRATION=1 pnpm test:integration
```

`.env` 中的 `TEST_SECRET` / `DIRECTORY_SECRET` / `CHECKIN_SECRET` 分别对应应用、通讯录和打卡。通讯录或打卡若开了 IP 白名单，未放行的出口会跳过相关用例。`TEST_USERID` 用于发消息、撤回和打卡；不填则尝试从通讯录取一名成员。
