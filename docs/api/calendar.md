# Calendar / Schedule

日历与日程。两个类独立构造，凭证可以相同。

```ts
import { Calendar, Schedule } from 'wecom';

const calendar = new Calendar({ corpId, corpSecret });
const schedule = new Schedule({ corpId, corpSecret });
```

## Calendar

| 方法           | 说明         |
| -------------- | ------------ |
| `add(data)`    | 创建日历     |
| `update(data)` | 更新日历     |
| `get(data)`    | 批量查询日历 |
| `delete(data)` | 删除日历     |

## Schedule

| 方法                  | 说明           |
| --------------------- | -------------- |
| `add(data)`           | 创建日程       |
| `update(data)`        | 更新日程       |
| `get(data)`           | 批量查询日程   |
| `delete(data)`        | 删除日程       |
| `getByCalendar(data)` | 按日历拉取日程 |

```ts
const { cal_id } = await calendar.add({
  calendar: {
    organizer: 'zhangsan',
    summary: '产品排期',
    color: '#0000FF',
    shares: [{ userid: 'lisi' }],
  },
});

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
