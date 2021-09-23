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

### **方法名**：`create`

**说明**： 创建成员

**例子**：

```javascript
user.create({
  name: "测试专属",
  userid: "userid",
  mobile: "17688716790",
  department: [2],
});
```

**参数说明**

参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/90195)

### **方法名**：`get`

**说明**： 读取成员

**例子**：

```javascript
user.get("userid");
```

**参数说明**：
| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| userid | string | 是 | 成员 id |

### **方法名**：`update`

**说明**：更新成员

**例子**：

```javascript
user.update({
  name: "修改后的名称",
  userid: TestUserId,
  mobile: "17688716790",
  department: [2],
});
```

**参数说明**：

参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/90197)

### **方法名**：`delete`

**说明**：删除成员

**例子**：

```javascript
user.delete("userid");
```

**参数说明**：
| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| userid | string | 是 | 成员 id |

### **方法名**：`batchDelete`

**说明**：批量删除成员

**例子**：

```javascript
user.batchDelete(["userid", "userid2"]);
```

**参数说明**：
| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| userids | string[] | 是 | 成员 id |

### **方法名**：`simpleList`

**说明**：获取部门成员

**例子**：

```javascript
user.simpleList(1, 0);
```

**参数说明**：

| 参数名        | 参数类型 | 必填 | 参数描述                                                 |
| :------------ | :------: | :--: | :------------------------------------------------------- |
| department_id |  number  |  是  | 部门 id                                                  |
| fetch_child   |  number  |  否  | 是否递归获取子部门下面的成员：1-递归获取，0-只获取本部门 |

### **方法名**：`list`

**说明**：获取部门成员详情？

**例子**：

```javascript
user.list(1, 0, 1);
```

**参数说明**：

| 参数名        | 参数类型 | 必填 | 参数描述                                                              |
| :------------ | :------: | :--: | :-------------------------------------------------------------------- |
| department_id |  number  |  是  | 部门 id                                                               |
| fetch_child   |  number  |  否  | 是否递归获取子部门下面的成员：1-递归获取，0-只获取本部门              |
| simple        |  number  |  否  | 是否只是要获取详情 1-不需要获取详情 0-获取详情 和 simpleList 方法一致 |

### **方法名**：`convertToOpenid`

**说明**：userid 与 openid 互换

**例子**：

```javascript
user.list("userid");
```

**参数说明**：

| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| userid |  string  |  是  | 成员 id  |

### **方法名**：`authSucc`

**说明**：二次验证

**例子**：

```javascript
user.authSucc("userid");
```

**参数说明**：

| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| userid |  string  |  是  | 成员 id  |

### **方法名**：`invite`

**说明**：邀请成员

**例子**：

```javascript
user.invite({
  user: ["userid", "userid2"],
});
```

**参数说明**：

| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| user   | string[] |  否  | 成员 id  |
| party  | number[] |  否  | 部门 id  |
| tag    | number[] |  否  | 标签 id  |

### **方法名**：`getJoinQrCode`

**说明**：获取加入企业二维码

**例子**：

```javascript
user.getJoinQrCode(1);
```

**参数说明**：

| 参数名    | 参数类型 | 必填 | 参数描述                                                                  |
| :-------- | :------: | :--: | :------------------------------------------------------------------------ |
| size_type |  string  |  否  | qrcode 尺寸类型，1: 171 x 171; 2: 399 x 399; 3: 741 x 741; 4: 2052 x 2052 |

### **方法名**：`getActiveStat`

**说明**：获取加入企业二维码

**例子**：

```javascript
user.getActiveStat("2020-09-25");
```

**参数说明**：

| 参数名 | 参数类型 | 必填 | 参数描述                                     |
| :----- | :------: | :--: | :------------------------------------------- |
| date   |  string  |  是  | 具体某天的活跃人数，最长支持获取 30 天前数据 |
