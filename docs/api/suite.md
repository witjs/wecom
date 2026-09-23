# Suite

第三方应用和代开发模板共用这个客户端。`suite_id` 以 `dk` 开头时就是代开发模板。

```ts
import { Message, Suite } from 'wecom';

const suite = new Suite({
  suiteId: process.env.SUITE_ID!,
  suiteSecret: process.env.SUITE_SECRET!,
  suiteTicket: latestTicket,
});
```

`getToken()` 走 `/service/get_suite_token`，请求自动带 `suite_access_token`。没有 ticket 时会抛 `WecomConfigError`。

## 方法

| 方法                                                    | 说明                                               |
| ------------------------------------------------------- | -------------------------------------------------- |
| `setTicket(ticket)` / `getTicket()`                     | 写入或读取最新 `suite_ticket`                      |
| `getPreAuthCode()`                                      | 预授权码                                           |
| `setSessionInfo(data)`                                  | 授权时的应用可见范围                               |
| `getPermanentCode(authCode)`                            | 永久授权码（v2）                                   |
| `getAuthInfo({ authCorpId, permanentCode })`            | 企业授权信息（v2）                                 |
| `getAdminList(authCorpId, agentId)`                     | 应用管理员                                         |
| `getUserInfo3rd(code)` / `getUserDetail3rd(userTicket)` | 第三方 OAuth                                       |
| `corp({ authCorpId, permanentCode })`                   | 返回可交给 `Message` / `User` 的 `WecomConfig`     |
| `corpWecom(options)`                                    | 同上，直接得到共享 `Wecom`                         |
| `createCorpClient(options)`                             | 同上，得到 `createClient` 模块集合（无 SuiteUser） |

```ts
const corp = suite.corp({
  authCorpId: 'wwAuth',
  permanentCode: 'perm',
});
const message = new Message(corp);
```

官方：[获取第三方应用凭证](https://developer.work.weixin.qq.com/document/path/90600)
