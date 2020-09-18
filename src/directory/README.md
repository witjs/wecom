# 通讯录管理模块

## 模块安装

```
import {Directory} from 'wecom'
```

## 快速开始

```javascript
// 素材管理模块实例化
const directory = new Directory({
  agentId: Number(process.env.AGENT_ID),
  corpId: process.env.CORPID,
  corpSecret: process.env.CORP_SECRET,
});
// 上传素材
const ret = await directory.upload(
  fs.createReadStream("/Users/aidenxiong/Downloads/abac.png")
);
```

## 实例方法

### **方法名**：`upload`

**说明**：发送消息
**例子**：

```javascript
directory.upload(file, type);
```

**参数说明**：
详情参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/91054)
