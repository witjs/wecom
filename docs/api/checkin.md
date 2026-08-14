# Checkin

打卡数据与规则。需要打卡应用 Secret。

```ts
import { Checkin } from 'wecom';

const checkin = new Checkin({
  corpId: process.env.CORPID!,
  corpSecret: process.env.CHECKIN_SECRET!,
});
```

## 方法

| 方法                     | 说明     |
| ------------------------ | -------- |
| `getCheckinData(data)`   | 打卡记录 |
| `getCheckinOption(data)` | 打卡规则 |

`QueryCheckinData` 需要 `opencheckindatatype`、`starttime`、`endtime`、`useridlist`。时间是 Unix 秒。

```ts
const data = await checkin.getCheckinData({
  opencheckindatatype: 3,
  starttime: 1717200000,
  endtime: 1717286400,
  useridlist: ['zhangsan'],
});
```
