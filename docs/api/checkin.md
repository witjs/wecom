# Checkin

打卡数据与规则。

```ts
import { Checkin } from 'wecom';

const checkin = new Checkin({
  corpId: process.env.CORPID!,
  corpSecret: process.env.CHECKIN_SECRET!,
});
```

## 使用说明

| 项     | 说明                                                                 |
| ------ | -------------------------------------------------------------------- |
| Secret | 打卡应用 Secret                                                      |
| 权限   | 需在管理端为应用开启打卡权限；若开了 IP 白名单，未放行的出口会被拒绝 |
| 官方   | [打卡](https://developer.work.weixin.qq.com/document/path/90261)     |

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
