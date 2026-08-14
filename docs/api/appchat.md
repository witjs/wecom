# AppChat

应用群聊会话。

```ts
import { AppChat } from 'wecom';

const chat = new AppChat({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 使用说明

| 项     | 说明                                                                               |
| ------ | ---------------------------------------------------------------------------------- |
| Secret | 应用 Secret                                                                        |
| 权限   | 只能操作本应用创建的群聊                                                           |
| 官方   | [应用发送消息到群聊会话](https://developer.work.weixin.qq.com/document/path/90245) |

应用消息见 [Message](./message)。

## 方法

| 方法            | 说明           |
| --------------- | -------------- |
| `create(data)`  | 创建群聊       |
| `update(data)`  | 修改群聊       |
| `get(chatid)`   | 群聊详情       |
| `send(message)` | 向群聊推送消息 |

## 示例

```ts
const { chatid } = await chat.create({
  name: '发布通知',
  owner: 'zhangsan',
  userlist: ['zhangsan', 'lisi'],
});

await chat.send({
  chatid,
  msgtype: 'text',
  text: { content: '今晚发版' },
});
```
