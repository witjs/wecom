# Callback

回调 URL 验证、签名和 AES 加解密。第三方、代开发、应用回调、智能机器人短连接都用它。`receiveId` 在自建应用里是 `corpId`，在第三方 / 代开发模板里是 `suiteId`。

```ts
import { Callback } from 'wecom';

const callback = new Callback({
  token: process.env.CALLBACK_TOKEN!,
  encodingAESKey: process.env.CALLBACK_AES_KEY!,
  receiveId: process.env.CORPID!,
});
```

## 构造

```ts
new Callback({ token, encodingAESKey, receiveId });
```

`encodingAESKey` 必须是 43 位。缺少任一字段会抛 `WecomConfigError`。

## 方法

| 方法                              | 说明                                 |
| --------------------------------- | ------------------------------------ |
| `verifyUrl(query)`                | 校验 `echostr` 签名并解密，返回明文  |
| `decrypt(body, query)`            | 校验 POST 签名并解密，返回字段和原文 |
| `encrypt(plaintext)`              | 加密被动回复，同时给出 XML / JSON    |
| `sign(timestamp, nonce, encrypt)` | 计算 `msg_signature`                 |

`body` 可以是 XML 字符串、JSON 字符串，或 `{ encrypt }` 对象。

```ts
const echo = callback.verifyUrl(query);
const event = callback.decrypt(rawBody, query);
if (event.suiteTicket) {
  suite.setTicket(event.suiteTicket);
}
```

签名错误、ReceiveId 对不上、密文损坏会抛 `WecomCallbackError`。

官方：[加解密方案说明](https://developer.work.weixin.qq.com/document/path/90930)
