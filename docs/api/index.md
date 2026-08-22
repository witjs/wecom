# 模块总览

每个模块都是独立客户端，从 `wecom` 包根导入。构造时传入 [配置](/guide/config)，方法直接返回业务数据。

先看 [选择接入方式](/guide/identities)，对上凭证再选客户端。

<div class="module-grid">
  <a class="module-card" href="./wecom">
    <span class="tag">身份</span>
    <h3>Wecom</h3>
    <p>自建应用 Token、request 逃生口、重试与共享配置。</p>
  </a>
  <a class="module-card" href="./callback">
    <span class="tag">身份</span>
    <h3>Callback</h3>
    <p>回调 URL 验证、签名和 AES 加解密。</p>
  </a>
  <a class="module-card" href="./suite">
    <span class="tag">身份</span>
    <h3>Suite</h3>
    <p>第三方应用和代开发模板，corp() 复用业务模块。</p>
  </a>
  <a class="module-card" href="./provider">
    <span class="tag">身份</span>
    <h3>Provider</h3>
    <p>服务商后台凭证和登录身份。</p>
  </a>
  <a class="module-card" href="./webhook">
    <span class="tag">身份</span>
    <h3>Webhook</h3>
    <p>群机器人消息推送，不走 access_token。</p>
  </a>
  <a class="module-card" href="./aibot">
    <span class="tag">身份</span>
    <h3>AiBot</h3>
    <p>智能机器人 WebSocket 长连接和流式回复。</p>
  </a>
  <a class="module-card" href="./hardware">
    <span class="tag">身份</span>
    <h3>Hardware</h3>
    <p>硬件云对云型号凭证和设备 token。</p>
  </a>
  <a class="module-card" href="./user">
    <span class="tag">通讯录</span>
    <h3>User</h3>
    <p>成员增删改查、邀请、手机号/邮箱换 userid。</p>
  </a>
  <a class="module-card" href="./department">
    <span class="tag">通讯录</span>
    <h3>Department</h3>
    <p>部门树、子部门 ID 和单个部门详情。</p>
  </a>
  <a class="module-card" href="./tag">
    <span class="tag">通讯录</span>
    <h3>Tag</h3>
    <p>标签及标签成员管理。</p>
  </a>
  <a class="module-card" href="./batch">
    <span class="tag">通讯录</span>
    <h3>Batch</h3>
    <p>异步增量/全量覆盖成员与部门。</p>
  </a>
  <a class="module-card" href="./agent">
    <span class="tag">应用与消息</span>
    <h3>Agent</h3>
    <p>应用详情和工作台模版。</p>
  </a>
  <a class="module-card" href="./agent-menu">
    <span class="tag">应用与消息</span>
    <h3>AgentMenu</h3>
    <p>自定义菜单创建、查询和删除。</p>
  </a>
  <a class="module-card" href="./media">
    <span class="tag">应用与消息</span>
    <h3>Media</h3>
    <p>临时素材、永久图片和高清语音下载。</p>
  </a>
  <a class="module-card" href="./message">
    <span class="tag">应用与消息</span>
    <h3>Message</h3>
    <p>应用消息、撤回、模版卡片和发送统计。</p>
  </a>
  <a class="module-card" href="./appchat">
    <span class="tag">应用与消息</span>
    <h3>AppChat</h3>
    <p>群聊会话创建、修改和推送。</p>
  </a>
  <a class="module-card" href="./external-contact">
    <span class="tag">客户联系</span>
    <h3>ExternalContact</h3>
    <p>客户、联系我、企业标签、群聊和分配。</p>
  </a>
  <a class="module-card" href="./calendar">
    <span class="tag">协作工具</span>
    <h3>Calendar</h3>
    <p>日历的增删改查。</p>
  </a>
  <a class="module-card" href="./schedule">
    <span class="tag">协作工具</span>
    <h3>Schedule</h3>
    <p>日程的增删改查，以及按日历拉取。</p>
  </a>
  <a class="module-card" href="./meeting-room">
    <span class="tag">协作工具</span>
    <h3>MeetingRoom</h3>
    <p>会议室管理、预订和取消。</p>
  </a>
  <a class="module-card" href="./checkin">
    <span class="tag">OA</span>
    <h3>Checkin</h3>
    <p>打卡数据与打卡规则。</p>
  </a>
  <a class="module-card" href="./approval">
    <span class="tag">OA</span>
    <h3>Approval</h3>
    <p>审批模板、提交申请和单据详情。</p>
  </a>
  <a class="module-card" href="./dial">
    <span class="tag">OA</span>
    <h3>Dial</h3>
    <p>公费电话拨打记录。</p>
  </a>
  <a class="module-card" href="./invoice">
    <span class="tag">财务</span>
    <h3>Invoice</h3>
    <p>电子发票查询与报销状态更新。</p>
  </a>
</div>

字段定义以官方文档为准，类型均可从包根导入：

```ts
import type { IUserCreateDto, SendableMessage, WecomConfig } from 'wecom';
```

官方入口：[企业微信开发文档](https://developer.work.weixin.qq.com/document/path/90664)
