# Media

临时素材、永久图片和高清语音。上传源可以是路径、`Buffer`、`Blob`、`File` 或可读流。

```ts
import { Media } from 'wecom';

const media = new Media({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 使用说明

| 项     | 说明                                                                 |
| ------ | -------------------------------------------------------------------- |
| Secret | 应用 Secret                                                          |
| 权限   | 自建应用、代开发、第三方均可调用本应用素材接口                       |
| 官方   | [素材管理](https://developer.work.weixin.qq.com/document/path/90253) |

## 方法

| 方法                             | 说明                             |
| -------------------------------- | -------------------------------- |
| `upload(file, type?, filename?)` | 上传临时素材，`type` 默认 `file` |
| `uploadImg(file, filename?)`     | 上传图片，返回永久 URL           |
| `get(mediaId, range?)`           | 下载临时素材，可选 `Range`       |
| `getHdVoice(mediaId)`            | 下载高清语音                     |

`IMediaType`：`image` | `voice` | `video` | `file`。

下载结果是 `IMediaFile`：`{ data: Buffer, contentType, filename?, contentRange? }`。

## 示例

```ts
const { media_id } = await media.upload('./logo.png', 'image');
const { url } = await media.uploadImg('./cover.png');
const file = await media.get(media_id);
```

```ts
import { Readable } from 'node:stream';

await media.upload(Readable.from(buffer), 'file', 'report.csv');
```
