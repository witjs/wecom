# Provider

服务商后台身份，和应用无关。用 `providerSecret` 换 `provider_access_token`。

```ts
import { Provider } from 'wecom';

const provider = new Provider({
  corpId: process.env.PROVIDER_CORPID!,
  providerSecret: process.env.PROVIDER_SECRET!,
});

const login = await provider.getLoginInfo(authCode);
```

未封装的服务商接口用 `provider.request()`。

官方：[获取服务商凭证](https://developer.work.weixin.qq.com/document/path/91200)
