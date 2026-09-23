# 模块说明

每个子目录是一个可独立构造的客户端（组合共享 `Wecom`，不再继承）。包根扁平导出，并提供 `wecom/<module>` 子路径导出；也可用 `createClient()` 一次构造共享客户端。

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
├── invoice            Invoice 电子发票
├── callback           Callback 回调加解密
├── suite              Suite 第三方 / 代开发
├── provider           Provider 服务商
├── webhook            Webhook 群机器人
├── aibot              AiBot 智能机器人
└── hardware           Hardware 硬件云对云
```

文档按身份和业务分组，不按官方侧栏或源码目录：

- 身份：`Wecom`、`Callback`、`Suite`、`Provider`、`Webhook`、`AiBot`、`Hardware`
- 通讯录：`User`、`Department`、`Tag`、`Batch`
- 应用与消息：`Agent`、`AgentMenu`、`Media`、`Message`、`AppChat`
- 客户联系：`ExternalContact`
- 协作工具：`Calendar`、`Schedule`、`MeetingRoom`
- OA：`Checkin`、`Approval`、`Dial`
- 财务：`Invoice`
