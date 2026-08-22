# AiBot

智能机器人 WebSocket 长连接。默认连 `wss://openws.work.weixin.qq.com`，用 Node 22 全局 `WebSocket`，没有额外依赖。

```ts
import { AiBot } from 'wecom';

const bot = new AiBot({
  botId: process.env.BOT_ID!,
  secret: process.env.BOT_SECRET!,
});

bot.on('message', async (frame, reply) => {
  await reply.stream(`收到：${frame.body?.text?.content ?? ''}`);
});

bot.on('event', async (frame, reply) => {
  if (frame.body?.event?.eventtype === 'enter_chat') {
    await reply.welcome({
      msgtype: 'text',
      text: { content: '你好，我是机器人' },
    });
  }
});

await bot.connect();
```

## 方法

| 方法 | 说明 |
| --- | --- |
| `connect()` / `disconnect()` | 建连、订阅、断开 |
| `respond(reqId, body)` | 通用回复 |
| `respondWelcome(reqId, body)` | 欢迎语，需在 5s 内 |
| `updateTemplateCard(reqId, card)` | 更新模板卡片 |
| `sendMessage({ chatid, msgtype, ... })` | 主动推送到会话 |

`reply.stream` / `reply.markdown` / `reply.text` 会透传回调里的 `req_id`。短连接模式的验签解密用 [Callback](./callback)。

官方：[智能机器人长连接](https://developer.work.weixin.qq.com/document/path/101463)
