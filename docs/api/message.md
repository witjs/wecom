# Message

应用消息。支持文本、图片、文件、卡片、图文、Markdown、小程序通知、任务卡片和模版卡片。

```ts
import { Message, type SendableMessage } from 'wecom';

const message = new Message({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 方法

| 方法                       | 说明                                           |
| -------------------------- | ---------------------------------------------- |
| `send(message, agentId?)`  | 发送应用消息；`agentid` 可在消息体或第二参传入 |
| `recall(data)`             | 撤回消息                                       |
| `updateTemplateCard(data)` | 更新模版卡片                                   |
| `getStatistics(data)`      | 发送统计                                       |

`send` 不会修改传入对象。

## 示例

```ts
const ret = await message.send(
  {
    touser: 'zhangsan',
    msgtype: 'text',
    text: { content: '构建完成' },
  },
  1000002
);

await message.recall({
  msgid: ret.msgid,
});
```

Markdown：

```ts
await message.send({
  touser: '@all',
  msgtype: 'markdown',
  agentid: 1000002,
  markdown: {
    content: '**发布成功**\n> 版本 1.0.0',
  },
});
```

`SendableMessage` 是所有可发送消息类型的联合。部门字段使用官方的 `toparty`。
