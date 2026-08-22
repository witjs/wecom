# 选择接入方式

企业微信按产品形态分栏，SDK 按**手里的凭证**分客户端。先对上身份，再复用业务模块。

## 对照

| 你在做什么 | 手里的凭证 | 用哪个客户端 | 换到的 token |
| --- | --- | --- | --- |
| 企业自建应用 | `corpId` + `corpSecret` | `Wecom` / `Message` / `User` … | `access_token` |
| 第三方应用 | `suiteId` + `suiteSecret` + `suite_ticket` | `Suite`，再用 `suite.corp()` | `suite_access_token` → 企业 `access_token` |
| 服务商代开发（模板期） | `suiteId`（`dk` 开头）+ `suiteSecret` + `suite_ticket` | 同一个 `Suite` | 同上 |
| 代开发发布后 | `corpId` + `permanent_code`（当作 secret） | 回到 `Message` / `User` | `access_token` |
| 服务商后台（登录、注册定制化） | `corpId` + `providerSecret` | `Provider` | `provider_access_token` |
| 群机器人消息推送 | webhook URL | `Webhook` | 无 |
| 智能机器人 | `botId` + `secret` | `AiBot` | WebSocket 订阅 |
| 硬件云对云 | `modelId` + `modelSecret` + `model_ticket` | `Hardware` | `model_access_token` / `device_access_token` |

不要为第三方再找一套 `SuiteUser`。`Suite.corp()` 返回的配置可以直接交给现有业务客户端。

## 自建应用

```ts
import { Message } from 'wecom';

const message = new Message({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 第三方 / 代开发模板

指令回调里先用 [Callback](/api/callback) 解开 `suite_ticket`，再写进 `Suite`。

```ts
import { Callback, Message, Suite } from 'wecom';

const callback = new Callback({
  token: process.env.SUITE_TOKEN!,
  encodingAESKey: process.env.SUITE_AES_KEY!,
  receiveId: process.env.SUITE_ID!,
});

const suite = new Suite({
  suiteId: process.env.SUITE_ID!,
  suiteSecret: process.env.SUITE_SECRET!,
});

const event = callback.decrypt(body, query);
if (event.suiteTicket) {
  suite.setTicket(event.suiteTicket);
}

const auth = await suite.getPermanentCode(authCode);
const message = new Message(
  suite.corp({
    authCorpId: auth.auth_corp_info?.corpid ?? auth.auth_corpid!,
    permanentCode: auth.permanent_code,
  })
);
```

代开发发布后不必换类：`permanent_code` 就是 secret。

```ts
new Message({
  corpId: authCorpId,
  corpSecret: permanentCode,
});
```

## 服务商

```ts
import { Provider } from 'wecom';

const provider = new Provider({
  corpId: process.env.PROVIDER_CORPID!,
  providerSecret: process.env.PROVIDER_SECRET!,
});

const login = await provider.getLoginInfo(authCode);
```

## 群机器人和智能机器人

这两类不要混用。群机器人只能往一个 URL 推消息；智能机器人要收消息、流式回复。

```ts
import { AiBot, Webhook } from 'wecom';

const hook = new Webhook({ url: process.env.WEBHOOK_URL! });
await hook.send({ msgtype: 'markdown', markdown: { content: '部署完成' } });

const bot = new AiBot({
  botId: process.env.BOT_ID!,
  secret: process.env.BOT_SECRET!,
});
bot.on('message', async (frame, reply) => {
  await reply.markdown(`收到：${frame.body?.text?.content ?? ''}`);
});
await bot.connect();
```

## 硬件云对云

设备直连 `wss://openhw.work.weixin.qq.com` 不在本 SDK 里。厂商云对接用 `Hardware`。

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
