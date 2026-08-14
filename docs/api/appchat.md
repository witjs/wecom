# AppChat

应用群聊会话。

```ts
import { AppChat } from 'wecom';

const chat = new AppChat({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

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
