# 模块说明

每个子目录是一个可独立构造的客户端。包根统一扁平导出，使用者始终从 `wecom` 导入类名，不必关心源码路径。

```
src/modules
├── user               User 成员
├── department         Department 部门
├── tag                Tag 标签
├── batch              Batch 异步导入
├── agent              Agent 应用
├── agent-menu         AgentMenu 自定义菜单
├── media              Media 素材
├── message            Message 应用消息
├── app-chat           AppChat 群聊会话
├── external-contact   ExternalContact 客户联系
├── calendar           Calendar 日历
├── schedule           Schedule 日程
├── meeting-room       MeetingRoom 会议室
├── checkin            Checkin 打卡
├── approval           Approval 审批
├── dial               Dial 公费电话
└── invoice            Invoice 电子发票
```

文档按业务场景分组，不按官方侧栏或源码目录：

- 通讯录：`User`、`Department`、`Tag`、`Batch`
- 应用与消息：`Agent`、`AgentMenu`、`Media`、`Message`、`AppChat`
- 客户联系：`ExternalContact`
- 协作工具：`Calendar`、`Schedule`、`MeetingRoom`
- OA：`Checkin`、`Approval`、`Dial`
- 财务：`Invoice`
