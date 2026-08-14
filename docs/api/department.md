# Department

通讯录部门。

```ts
import { Department } from 'wecom';

const department = new Department({
  corpId: process.env.CORPID!,
  corpSecret: process.env.DIRECTORY_SECRET!,
});
```

## 使用说明

| 项     | 说明                                                                      |
| ------ | ------------------------------------------------------------------------- |
| Secret | 通讯录同步 Secret，或具备部门权限的应用 Secret                            |
| 权限   | 自建应用、代开发、第三方仅能读取可见范围内的部门；写入需通讯录同步 Secret |
| 官方   | [部门管理](https://developer.work.weixin.qq.com/document/path/90204)      |

## 方法

| 方法              | 说明                                   |
| ----------------- | -------------------------------------- |
| `create(data)`    | 创建部门                               |
| `update(data)`    | 修改部门                               |
| `delete(id)`      | 删除部门                               |
| `list(id?)`       | 部门列表；传入 `id` 时返回该部门及子孙 |
| `simpleList(id?)` | 子部门 ID 列表                         |
| `get(id)`         | 单个部门详情                           |

## 示例

```ts
const { id } = await department.create({
  name: '产品部',
  parentid: 1,
});

const tree = await department.list(1);
const detail = await department.get(id);
await department.update({ id, name: '产品中心' });
```

相关类型：`ICreateDepartment`、`IUpdateDepartment`、`IDepartment`。
