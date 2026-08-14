# Agent

自建应用详情、工作台模版和可见范围。构造时必须传 `agentId`。

```ts
import { Agent } from 'wecom';

const agent = new Agent({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
  agentId: Number(process.env.TEST_AGENT_ID),
});
```

缺少 `agentId` 会抛 `WecomConfigError`。

## 使用说明

| 项     | 说明                                                                 |
| ------ | -------------------------------------------------------------------- |
| Secret | 应用 Secret                                                          |
| 权限   | 自建应用可读写本应用；第三方/代开发应用受授权范围限制                |
| 官方   | [应用管理](https://developer.work.weixin.qq.com/document/path/90227) |

自定义菜单见 [AgentMenu](./agent-menu)。

## 方法

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
