# 应用管理模块

## 模块安装

```
import {Agent} from 'wecom'
```

## 快速开始

```javascript
// 应用管理模块实例化
const agent = new Agent({
  corpId: process.env.CORPID,
  corpSecret: process.env.CORP_SECRET,
});
// 获取应用详情
const ret = await agent.get(agentid);
```

## 实例方法

### **方法名**：`get`

**说明**：获取应用详情
**例子**：

```javascript
agent.get(agentid);
```

**参数说明**：
详情参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/90227)
