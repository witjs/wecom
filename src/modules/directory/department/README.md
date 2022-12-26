# 部门管理模块

## 模块安装

```
import {Department} from 'wecom'
```

## 快速开始

> 该模块的 corpSecret 的查看路径 企业微信> 管理工具> [通讯录同步](https://work.weixin.qq.com/wework_admin/frame#apps/contactsApi)
> 同时需要开启 API 编辑通讯录权限

```javascript
// 部门管理模块实例化
const department = new Department({
  corpId: process.env.CORPID,
  corpSecret: process.env.DIRECTORY_SECRET,
});
// 获取部门列表 不传参数的话表示获取全部部门信息
const ret = await department.list();
```

## 实例方法

### **方法名**：`create`

**说明**：创建部门

**例子**：

```javascript
department.create({
  name: "行政部",
  parentid: 1,
});
```

**参数说明**

| 参数名   | 参数类型 | 必填 | 参数描述                                                                                                                   |
| :------- | :------: | :--: | :------------------------------------------------------------------------------------------------------------------------- |
| name     |  string  |  是  | 部门名称。长度限制为 1~32 个字符，字符不能包括\:?”<>｜                                                                     |
| parentid |  number  |  是  | 父部门 id，32 位整型                                                                                                       |
| name_en  |  string  |  否  | 英文名称。同一个层级的部门名称不能重复。需要在管理后台开启多语言支持才能生效。长度限制为 1~32 个字符，字符不能包括\:?”<>｜ |
| order    |  number  |  否  | 在父部门中的次序值。order 值大的排序靠前。有效的值范围是[0, 2^32)                                                          |
| id       |  number  |  否  | 位整型，指定时必须大于 1。若不填该参数，将自动生成 id                                                                      |

### **方法名**：`update`

**说明**：修改部门

**例子**：

```javascript
department.update({
  id: 123456
  name: "行政部",
  parentid: 1,
});
```

**参数说明**

| 参数名   | 参数类型 | 必填 | 参数描述                                                                                                                   |
| :------- | :------: | :--: | :------------------------------------------------------------------------------------------------------------------------- |
| id       |  number  |  是  | 部门 id                                                                                                                    |
| name     |  string  |  否  | 部门名称。长度限制为 1~32 个字符，字符不能包括\:?”<>｜                                                                     |
| parentid |  number  |  否  | 父部门 id                                                                                                                  |
| name_en  |  string  |  否  | 英文名称。同一个层级的部门名称不能重复。需要在管理后台开启多语言支持才能生效。长度限制为 1~32 个字符，字符不能包括\:?”<>｜ |
| order    |  number  |  否  | 在父部门中的次序值。order 值大的排序靠前。有效的值范围是[0, 2^32)                                                          |

### **方法名**：`delete`

**说明**：删除部门

**例子**：

```javascript
department.delete(<number>id);
```

**参数说明**

| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| id     |  number  |  是  | 部门 id  |

### **方法名**：`list`

**说明**：获取部门列表

**例子**：

```javascript
department.list(<number>id);
```

**参数说明**

| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| id     |  number  |  否  | 部门 id  |

**官方地址**：

详情参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/90204)
