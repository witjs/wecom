# Webhook

群机器人消息推送。构造时传入完整 webhook URL，不使用 `access_token`。

```ts
import { Webhook } from 'wecom';

const webhook = new Webhook({
  url: process.env.WEBHOOK_URL!,
});

await webhook.send({
  msgtype: 'text',
  text: { content: 'hello', mentioned_list: ['@all'] },
});
```

支持 `text` / `markdown` / `markdown_v2` / `image` / `news` / `file` / `template_card`。

这和 [AiBot](./aibot) 不是一类东西：Webhook 只能主动推，不能收消息。
