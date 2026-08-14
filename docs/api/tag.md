# Tag

通讯录标签。

```ts
import { Tag } from 'wecom';

const tag = new Tag({
  corpId: process.env.CORPID!,
  corpSecret: process.env.DIRECTORY_SECRET!,
});
```

## 方法

| 方法               | 说明                                            |
| ------------------ | ----------------------------------------------- |
| `create(tag)`      | 创建标签；可传 `{ tagname }` 或直接传名称字符串 |
| `update(tag)`      | 更新标签名                                      |
| `delete(tagid)`    | 删除标签                                        |
| `get(tagid)`       | 标签成员                                        |
| `addTagUser(data)` | 增加标签成员                                    |
| `delTagUser(data)` | 删除标签成员                                    |
| `list()`           | 标签列表                                        |

## 示例

```ts
const { tagid } = await tag.create('核心成员');
await tag.addTagUser({
  tagid,
  userlist: ['zhangsan'],
});
const members = await tag.get(tagid);
```
