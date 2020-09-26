# 标签管理模块

[官网文档地址](https://work.weixin.qq.com/api/doc/90000/90135/90209)

## 模块安装

```
import {Tag} from 'wecom'
```

## 快速开始

```javascript
// 成员管理模块实例化
const tag = new Tag({
  corpId: process.env.CORPID,
  corpSecret: process.env.CORP_SECRET,
});
```

## 实例方法

### **方法名**：`create`

**说明**： 创建标签

**例子**：

```javascript
tag.create({
  tagid: 12346,
  tagname: "测试专属",
});
```

**参数说明**

| 参数名  | 参数类型 | 必填 | 参数描述                                                                                       |
| :------ | :------: | :--: | :--------------------------------------------------------------------------------------------- |
| tagid   |  number  |  否  | 标签 id，非负整型，指定此参数时新增的标签会生成对应的标签 id，不指定时则以目前最大的 id 自增。 |
| tagname |  string  |  是  | 标签名称，长度限制为 32 个字以内（汉字或英文字母），标签名不可与其他标签重名。                 |

### **方法名**：`update`

**说明**：更新标签名字

**例子**：

```javascript
user.update({
  tagid: 12346,
  tagname: "修改后的名称",
});
```

**参数说明**：

**参数说明**

| 参数名  | 参数类型 | 必填 | 参数描述                                                                       |
| :------ | :------: | :--: | :----------------------------------------------------------------------------- |
| tagid   |  number  |  是  | 标签 ID                                                                        |
| tagname |  string  |  是  | 标签名称，长度限制为 32 个字以内（汉字或英文字母），标签名不可与其他标签重名。 |

### **方法名**：`delete`

**说明**：删除标签

**例子**：

```javascript
user.delete(12346);
```

**参数说明**：
| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| tagid | number | 是 | 标签 ID |

### **方法名**：`get`

**说明**：获取标签成员

**例子**：

```javascript
user.get(12346);
```

**参数说明**：
| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| tagid | number | 是 | 标签 ID |

### **方法名**：`addTagUser`

**说明**：加标签成员

**例子**：

```javascript
user.addTagUser({
  tagid: 12346,
  userlist: ["userid", "userid2"],
});
```

**参数说明**：
| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| tagid | number | 是 | 标签 ID |
| userlist | string[] | 否 | 企业成员 ID 列表，注意：userlist、partylist 不能同时为空，单次请求个数不超过 1000 |
| partylist | number[] | 否 | 企业部门 ID 列表，注意：userlist、partylist 不能同时为空，单次请求个数不超过 100 |

### **方法名**：`delTagUser`

**说明**：删除标签成员

**例子**：

```javascript
user.delTagUser({
  tagid: 12346,
  userlist: ["userid", "userid2"],
});
```

**参数说明**：
| 参数名 | 参数类型 | 必填 | 参数描述 |
| :----- | :------: | :--: | :------- |
| tagid | number | 是 | 标签 ID |
| userlist | string[] | 否 | 企业成员 ID 列表，注意：userlist、partylist 不能同时为空，单次请求个数不超过 1000 |
| partylist | number[] | 否 | 企业部门 ID 列表，注意：userlist、partylist 不能同时为空，单次请求个数不超过 100 |

### **方法名**：`list`

**说明**：获取标签列表

**例子**：

```javascript
user.list();
```
