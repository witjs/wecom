# Dial

公费电话拨打记录。

```ts
import { Dial } from 'wecom';

const dial = new Dial({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 使用说明

| 项     | 说明                                                                 |
| ------ | -------------------------------------------------------------------- |
| Secret | 具备公费电话权限的应用 Secret                                        |
| 权限   | 应用需开启「公费电话」                                               |
| 官方   | [公费电话](https://developer.work.weixin.qq.com/document/path/93644) |

## 方法

| 方法                   | 说明                               |
| ---------------------- | ---------------------------------- |
| `getDialRecord(data?)` | 拨打记录，可按时间或 `caller` 过滤 |

```ts
const { record } = await dial.getDialRecord({
  starttime: 1717200000,
  endtime: 1717286400,
});
```
