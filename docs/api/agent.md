# Agent / AgentMenu

自建应用与自定义菜单。构造时必须传 `agentId`。

```ts
import { Agent, AgentMenu } from 'wecom';

const agent = new Agent({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
  agentId: Number(process.env.TEST_AGENT_ID),
});
```

缺少 `agentId` 会抛 `WecomConfigError`。

## Agent

| 方法                         | 说明                             |
| ---------------------------- | -------------------------------- |
| `get()`                      | 当前应用详情                     |
| `list()`                     | 当前凭证可见的应用列表           |
| `set(data)`                  | 修改自建应用；不会改写调用方对象 |
| `setWorkbenchTemplate(data)` | 设置工作台模版                   |
| `getWorkbenchTemplate()`     | 获取工作台模版                   |
| `setWorkbenchData(data)`     | 设置用户工作台数据               |

```ts
const info = await agent.get();
await agent.set({ name: '通知助手', description: '内部通知' });
```

## AgentMenu

继承 `Agent`，`get()` 覆盖为菜单查询。

| 方法           | 说明     |
| -------------- | -------- |
| `create(data)` | 创建菜单 |
| `get()`        | 菜单信息 |
| `delete()`     | 删除菜单 |

```ts
const menu = new AgentMenu({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
  agentId: Number(process.env.TEST_AGENT_ID),
});

await menu.create({
  button: [{ type: 'click', name: '帮助', key: 'HELP' }],
});
```
