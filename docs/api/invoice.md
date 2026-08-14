# Invoice

电子发票查询与报销状态。

```ts
import { Invoice } from 'wecom';

const invoice = new Invoice({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 方法

| 方法                             | 说明         |
| -------------------------------- | ------------ |
| `getInvoiceInfo(data)`           | 单张发票     |
| `updateInvoiceStatus(data)`      | 更新报销状态 |
| `batchUpdateInvoiceStatus(data)` | 批量更新状态 |
| `batchGetInvoiceInfo(data)`      | 批量查询     |

```ts
const info = await invoice.getInvoiceInfo({
  card_id: 'p1Pj9jxxx',
  encrypt_code: 'XXX',
});

await invoice.updateInvoiceStatus({
  card_id: 'p1Pj9jxxx',
  encrypt_code: 'XXX',
  reimburse_status: 'INVOICE_REIMBURSE_INIT',
});
```
