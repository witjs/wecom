# Hardware

智能硬件**云对云**。型号凭证走 `model_ticket`，设备业务接口走 `device_access_token`。

设备直连 `wss://openhw.work.weixin.qq.com`、投屏 SDK、固件协议不在这里。

```ts
import { Hardware, Wecom } from 'wecom';

const hardware = new Hardware({
  modelId: process.env.MODEL_ID!,
  modelSecret: process.env.MODEL_SECRET!,
  modelTicket,
});

const secret = await hardware.getDeviceSecret(authCode);
const device = new Wecom(
  hardware.device({
    deviceSn: 'SN1',
    deviceSecret: secret.device_secret!,
  })
);
```

## 方法

| 方法 | 说明 |
| --- | --- |
| `setTicket(ticket)` / `getTicket()` | 型号 `model_ticket` |
| `getDeviceSecret(authCode)` | 绑定回调里的一次性 auth_code 换设备 secret |
| `addDevice(sn)` / `deleteDevice(sn)` / `getDevice(sn)` | 型号下的设备 |
| `device({ deviceSn, deviceSecret })` | 返回带 `device_access_token` 的配置 |

官方：[硬件云端接入](https://developer.work.weixin.qq.com/document/path/95975)
