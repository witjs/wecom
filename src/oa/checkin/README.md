# 企业微信打卡应用模块

## 模块安装

```
import {Checkin} from 'wecom'
```

## 快速开始

```javascript
// 打卡模块实例化
const checkin = new Checkin({
  corpId: process.env.CORPID,
  corpSecret: process.env.CORP_SECRET,
});
// 获取打卡信息
const ret = await checkin.getCheckinData((data: QueryCheckinData));
```

## 实例方法

### **方法名**：`getCheckinData`

**说明** 获取打卡数据
**例子**：

```javascript
checkin.getCheckinData((data: QueryCheckinData));
```

### **方法名**：`getCheckinOption`

**说明** 获取打卡规则
**例子**：

```javascript
checkin.getCheckinOption((data: QueryCheckinOption));
```

**参数说明**：
详情参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/90262)
