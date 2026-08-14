# Schedule

日程的增删改查。日历见 [Calendar](./calendar)。

```ts
import { Schedule } from 'wecom';

const schedule = new Schedule({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 使用说明

| 项     | 说明                                                                 |
| ------ | -------------------------------------------------------------------- |
| Secret | 有日程权限的应用 Secret                                              |
| 权限   | 应用需具备「日程」使用权限                                           |
| 官方   | [管理日程](https://developer.work.weixin.qq.com/document/path/93648) |

`cal_id` 来自日历接口，两边没有源码依赖。

## 方法

| 方法                  | 说明           |
| --------------------- | -------------- |
| `add(data)`           | 创建日程       |
| `update(data)`        | 更新日程       |
| `get(data)`           | 批量查询日程   |
| `delete(data)`        | 删除日程       |
| `getByCalendar(data)` | 按日历拉取日程 |

```ts
const { schedule_id } = await schedule.add({
  schedule: {
    organizer: 'zhangsan',
    start_time: 1717200000,
    end_time: 1717203600,
    summary: '周会',
    cal_id,
  },
});
```
