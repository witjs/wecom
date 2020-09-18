# 成员管理模块

## 模块安装

```
import {User} from 'wecom'
```

## 快速开始

```javascript
// 成员管理模块实例化
const user = new User({
  corpId: process.env.CORPID,
  corpSecret: process.env.CORP_SECRET,
});
```

## 实例方法

### **方法名**：`get`

**说明** 获取成员信息
**例子**：

```javascript
user.get("aidenxiong");
```

**参数说明**：
详情参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/90194)
