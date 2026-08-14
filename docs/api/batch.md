# Batch

通讯录异步导入。先把 CSV 传到素材接口拿到 `media_id`，再提交任务并用 `jobid` 查结果。

```ts
import { Batch, Media } from 'wecom';

const media = new Media({ corpId, corpSecret });
const batch = new Batch({ corpId, corpSecret });
```

## 使用说明

| 项     | 说明                                                                     |
| ------ | ------------------------------------------------------------------------ |
| Secret | 通讯录同步 Secret                                                        |
| 权限   | 需要通讯录编辑权限；素材上传与异步任务使用同一套凭证                     |
| 官方   | [异步导入接口](https://developer.work.weixin.qq.com/document/path/90980) |

## 方法

| 方法                 | 说明         |
| -------------------- | ------------ |
| `syncUser(data)`     | 增量更新成员 |
| `replaceUser(data)`  | 全量覆盖成员 |
| `replaceParty(data)` | 全量覆盖部门 |
| `getResult(jobid)`   | 异步任务结果 |

## 示例

```ts
const { media_id } = await media.upload('./users.csv', 'file');
const { jobid } = await batch.syncUser({ media_id });
const result = await batch.getResult(jobid);
```

`BatchImportDto` 还可带 `to_invite` 和回调 `callback`。
