# 素材管理模块

## 模块安装

```
import {Media} from 'wecom'
```

## 快速开始

```javascript
// 素材管理模块实例化
const media = new Media({
  corpId: process.env.CORPID,
  corpSecret: process.env.CORP_SECRET,
});
// 上传素材
const ret = await media.upload(
  fs.createReadStream("/file/path/to/your/file.png")
);
```

## 实例方法

### **方法名**：`upload`

**说明**：发送消息
**例子**：

```javascript
media.upload(file, type);
```

**参数说明**：
详情参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/91054)
