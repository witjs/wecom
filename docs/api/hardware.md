# Hardware

智能硬件**云对云**。型号凭证走 `model_ticket`，设备业务接口走 `device_access_token`。

设备直连 `wss://openhw.work.weixin.qq.com`、投屏 SDK、固件协议不在这里。

```ts
import { Hardware } from 'wecom';

const hardware = new Hardware({
  modelId: process.env.MODEL_ID!,
  modelSecret: process.env.MODEL_SECRET!,
  modelTicket,
});

const secret = await hardware.getDeviceSecret(authCode);
const device = hardware.deviceWecom({
  deviceSn: 'SN1',
  deviceSecret: secret.device_secret!,
});
// 或：hardware.createDeviceClient({ deviceSn, deviceSecret })
```

## 方法

| 方法                                                   | 说明                                       |
| ------------------------------------------------------ | ------------------------------------------ |
| `setTicket(ticket)` / `getTicket()`                    | 型号 `model_ticket`                        |
| `getDeviceSecret(authCode)`                            | 绑定回调里的一次性 auth_code 换设备 secret |
| `addDevice(sn)` / `deleteDevice(sn)` / `getDevice(sn)` | 型号下的设备                               |
| `device({ deviceSn, deviceSecret })`                   | 返回带 `device_access_token` 的配置        |
| `deviceWecom(options)`                                 | 同上，直接得到共享 `Wecom`                 |
| `createDeviceClient(options)`                          | 同上，得到 `createClient` 模块集合         |

官方：[硬件云端接入](https://developer.work.weixin.qq.com/document/path/95975)
