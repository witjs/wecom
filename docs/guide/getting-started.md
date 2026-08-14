# 快速开始

`wecom` 是企业微信服务端 TypeScript SDK。只在 Node.js 里使用，不要把 `corpSecret` 下发到浏览器。

## 环境

- Node.js 22.18 及以上
- 企业微信自建应用的 `corpId` 与 `corpSecret`

## 安装

```bash
pnpm add wecom
```

也支持 npm / yarn。

## 发送一条文本消息

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

成功时方法直接返回业务对象，不再包装 HTTP 响应。企业微信 `errcode !== 0` 会抛错。

## 使用底层 request

未封装的接口可以用 `Wecom.request()`：

```ts
import { Wecom } from 'wecom';

const wecom = new Wecom({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});

const ret = await wecom.request({
  url: '/user/get',
  method: 'GET',
  params: { userid: 'alice' },
});
```

## 按模块引入

```ts
import {
  Agent,
  Approval,
  Calendar,
  ExternalContact,
  Media,
  MeetingRoom,
  Message,
  User,
} from 'wecom';
```

每个模块都是独立客户端，构造时传入同一套 [配置](./config)。相同凭证会自动共享 Token。

## 下一步

- [配置项与默认值](./config)
- [Token 缓存与重试](./token)
- [错误类型](./errors)
- [模块总览](/api/)
