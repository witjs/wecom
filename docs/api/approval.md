# Approval

审批模板、提单和单据查询。

```ts
import { Approval } from 'wecom';

const approval = new Approval({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 使用说明

| 项     | 说明                                                             |
| ------ | ---------------------------------------------------------------- |
| Secret | 具备审批权限的应用 Secret                                        |
| 权限   | 应用需开启「审批」；模板和单据受可见范围限制                     |
| 官方   | [审批](https://developer.work.weixin.qq.com/document/path/91853) |

## 方法

| 方法                      | 说明             |
| ------------------------- | ---------------- |
| `getTemplateDetail(data)` | 审批模板详情     |
| `applyEvent(data)`        | 提交审批         |
| `getApprovalInfo(data)`   | 批量获取审批单号 |
| `getApprovalDetail(data)` | 审批申请详情     |

```ts
const template = await approval.getTemplateDetail({
  template_id: '3TmALk1zwPv5MBJqiYNUPgc',
});

const { sp_no } = await approval.applyEvent({
  creator_userid: 'zhangsan',
  template_id: '3TmALk1zwPv5MBJqiYNUPgc',
  use_template_approver: 1,
  apply_data: { contents: [] },
});
```

模板控件和申请内容类型为 `ApprovalTemplateControl`、`ApprovalApplyContent`。
