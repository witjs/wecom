# Calendar

日历的增删改查。日程见 [Schedule](./schedule)。

```ts
import { Calendar } from 'wecom';

const calendar = new Calendar({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 使用说明

| 项     | 说明                                                                 |
| ------ | -------------------------------------------------------------------- |
| Secret | 有日程权限的应用 Secret                                              |
| 权限   | 应用需具备「日程」使用权限                                           |
| 官方   | [管理日历](https://developer.work.weixin.qq.com/document/path/93647) |

## 方法

| 方法           | 说明         |
| -------------- | ------------ |
| `add(data)`    | 创建日历     |
| `update(data)` | 更新日历     |
| `get(data)`    | 批量查询日历 |
| `delete(data)` | 删除日历     |

```ts
const { cal_id } = await calendar.add({
  calendar: {
    organizer: 'zhangsan',
    summary: '产品排期',
    color: '#0000FF',
    shares: [{ userid: 'lisi' }],
  },
});
```
