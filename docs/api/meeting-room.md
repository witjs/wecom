# MeetingRoom

会议室管理与预订。

```ts
import { MeetingRoom } from 'wecom';

const rooms = new MeetingRoom({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 使用说明

| 项     | 说明                                                               |
| ------ | ------------------------------------------------------------------ |
| Secret | 具备会议室权限的应用 Secret                                        |
| 权限   | 应用需开启「会议室」                                               |
| 官方   | [会议室](https://developer.work.weixin.qq.com/document/path/93619) |

## 方法

| 方法                    | 说明                              |
| ----------------------- | --------------------------------- |
| `add(data)`             | 添加会议室                        |
| `edit(data)`            | 编辑会议室，需带 `meetingroom_id` |
| `delete(meetingroomId)` | 删除会议室                        |
| `list(data?)`           | 会议室列表                        |
| `book(data)`            | 预订                              |
| `cancelBook(data)`      | 取消预订                          |
| `getBookingInfo(data?)` | 预订信息                          |

```ts
const { meetingroom_id } = await rooms.add({
  name: '星辰',
  capacity: 8,
  city: '深圳',
  building: 'A',
  floor: '18F',
});

const { booking_id } = await rooms.book({
  meetingroom_id,
  start_time: 1717200000,
  end_time: 1717203600,
  booker: 'zhangsan',
});
```
