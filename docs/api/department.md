# Department

通讯录部门。

```ts
import { Department } from 'wecom';

const department = new Department({
  corpId: process.env.CORPID!,
  corpSecret: process.env.DIRECTORY_SECRET!,
});
```

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
