# AgentMenu

应用自定义菜单。继承 `Agent`，构造时必须传 `agentId`。`get()` 覆盖为菜单查询。

```ts
import { AgentMenu } from 'wecom';

const menu = new AgentMenu({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
  agentId: Number(process.env.TEST_AGENT_ID),
});
```

缺少 `agentId` 会抛 `WecomConfigError`。

## 使用说明

| 项     | 说明                                                                   |
| ------ | ---------------------------------------------------------------------- |
| Secret | 应用 Secret                                                            |
| 权限   | 自建应用可管理本应用菜单                                               |
| 官方   | [自定义菜单](https://developer.work.weixin.qq.com/document/path/90231) |

应用详情和工作台见 [Agent](./agent)。

## 方法

| 方法           | 说明     |
| -------------- | -------- |
| `create(data)` | 创建菜单 |
| `get()`        | 菜单信息 |
| `delete()`     | 删除菜单 |

```ts
await menu.create({
  button: [{ type: 'click', name: '帮助', key: 'HELP' }],
});
```
