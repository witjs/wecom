# 部门管理模块

## 模块安装

```
import {Department} from 'wecom'
```

## 快速开始

```javascript
// 部门管理模块实例化
const department = new Department({
  corpId: process.env.CORPID,
  corpSecret: process.env.CORP_SECRET,
});
// 获取部门列表 不传参数的话表示获取全部部门信息
const ret = await department.list();
```

## 实例方法

### **方法名**：`list`

**说明** 获取部门列表
**例子**：

```javascript
department.list();
```

**参数说明**：
详情参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/90204)
