# User

通讯录成员。

```ts
import { User } from 'wecom';

const user = new User({
  corpId: process.env.CORPID!,
  corpSecret: process.env.DIRECTORY_SECRET!,
});
```

## 使用说明

| 项     | 说明                                                                      |
| ------ | ------------------------------------------------------------------------- |
| Secret | 通讯录同步 Secret，或具备成员权限的应用 Secret                            |
| 权限   | 自建应用、代开发、第三方仅能读取可见范围内的成员；写入需通讯录同步 Secret |
| 官方   | [成员管理](https://developer.work.weixin.qq.com/document/path/90193)      |

## 方法

| 方法                                       | 说明                                   |
| ------------------------------------------ | -------------------------------------- |
| `create(user)`                             | 创建成员                               |
| `get(userid)`                              | 读取成员                               |
| `update(user)`                             | 更新成员                               |
| `delete(userid)`                           | 删除成员                               |
| `batchDelete(useridlist)`                  | 批量删除                               |
| `simpleList(departmentId, fetchChild?)`    | 部门成员简要列表                       |
| `list(departmentId, fetchChild?, simple?)` | 部门成员详情；`simple=1` 走 simplelist |
| `convertToOpenid(userid)`                  | userid 换 openid                       |
| `authSucc(userid)`                         | 二次验证                               |
| `invite(data)`                             | 邀请成员关注                           |
| `getJoinQrCode(sizeType)`                  | 加入企业二维码                         |
| `getActiveStat(date)`                      | 企业活跃成员数，`date` 为 `YYYY-MM-DD` |
| `getUseridByMobile(mobile)`                | 手机号换 userid                        |
| `getUseridByEmail(data)`                   | 邮箱换 userid                          |
| `listId(data?)`                            | 分页获取成员 ID                        |

`fetchChild` / `simple` 为 `0 | 1`，默认 `0`。

## 示例

```ts
const created = await user.create({
  userid: 'zhangsan',
  name: '张三',
  mobile: '13800000000',
  department: [1],
});

const info = await user.get('zhangsan');
const deptUsers = await user.simpleList(1, 1);
const { userid } = await user.getUseridByMobile('13800000000');
```

相关类型：`IUserCreateDto`、`IUserUpdateDto`、`UserRet`、`ListUserIdDto`。
