# 消息推送模块

## 模块安装

```
import {Message} from 'wecom'
```

## 快速开始

```javascript
// 消息推送模块
const message = new Message({
  corpId: process.env.CORPID,
  corpSecret: process.env.CORP_SECRET,
});
// 发送消息
wecom.send({
  touser: "aidenxiong",
  msgtype: "text",
  text: {
    content: "test",
  },
});
```

## 实例方法

### **方法名**：`send`

**说明**：发送消息

**例子**：

```javascript
message.send(message);
```

**参数说明**

详情参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/90236)
