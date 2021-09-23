# 企业微信 Node API

**目前只封装了基本的模块 有兴趣的同学可以一起加入并丰富其 API**

> 各个子模块相关文档 请前往 github 各个项目中[查看](src/modules)

## 目前已完成模块

[应用管理模块](https://github.com/witjs/wecom/tree/master/src/modules/agent)

[通讯录管理模块](https://github.com/witjs/wecom/tree/master/src/modules/directory)

- [部门管理模块](https://github.com/witjs/wecom/tree/master/src/modules/directory/department)

- [标签管理模块](https://github.com/witjs/wecom/tree/master/src/modules/directory/tag)

- [成员管理模块](https://github.com/witjs/wecom/tree/master/src/modules/directory/user)

[素材管理模块](https://github.com/witjs/wecom/tree/master/src/modules/media)

[消息推送模块](https://github.com/witjs/wecom/tree/master/src/modules/message)

[oa 管理模块](https://github.com/witjs/wecom/tree/master/src/modules/oa)

- [企业微信打卡应用模块](https://github.com/witjs/wecom/tree/master/src/modules/oa/checkin)

企业微信文档地址 [点击前往](https://work.weixin.qq.com/api/doc/90000/90135/90236)

## 安装模块

`import { Wecom } from "wecom"`;

## 快速开始

```javascript
// 初始化企业微信对象
const wecom = new Wecom({
  corpId: process.env.CORPID,
  corpSecret: process.env.CORP_SECRET,
});
// 发送消息
wecom.request({
  url: "/message/send",
  method: "POST",
  // 发送消息的参数参照 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90236) [（API 文档）]()
  data: {
    touser: "username",
    msgtype: "text",
    agentid: Number(process.env.TEST_AGENT_ID),
    text: {
      content: "test",
    },
  },
});
```

## 参数说明

> 下面的必要参数都是申请企业微信应用时分配给到的，需要和相关负责人说明需要

| 参数名     | 参数类型 | 必填 | 参数描述                                                       |
| :--------- | :------: | :--: | :------------------------------------------------------------- |
| corpId     |  string  |  是  | 企业微信 corpid                                                |
| corpSecret |  string  |  是  | 企业微信 corpsecret                                            |
| baseURL    |  string  |  否  | 企业微信服务器地址 (默认:https://qyapi.weixin.qq.com/cgi-bin/) |
| retryTimes |  number  |  否  | 认证失败的错误重试次数 其他错误信息不进行重试(默认:3)          |

## 静态方法

**方法名**：`setGlobal`
**说明**：添加全局配置信息

```javascript
Wecom.setGlobal((config: Partial<WecomConfig>));
```

## 实例方法

**方法名**：`getToken`
**说明**: 获取发送需要用到的 token 信息

```javascript
wecom.getToken();
```

**方法名**：`request`
**说明**：向企业微信发送相关的请求

```javascript
wecom.request((config: AxiosRequestConfig));
```

**方法名**：createApi
**说明**：创建新的调用 api

```javascript
wecom.createApi((path: string), fn);
```

## 项目构建

```shell
yarn run build
```

## 单元测试

> 请先创建`.env`文件，并将`.env.example`中的内容复制过去
>
> 相关的配置信息为作者创建的测试企业。如果有其他的需求，请通过[issue](https://github.com/witjs/wecom/issues)提出

```shell
yarn run test
```

## 目录:

- [ ] 通讯录管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90193)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory)
  - [x] 成员管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90194)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user)
    - [x] 创建成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90195)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dcreate)
    - [x] 读取成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90196)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dget)
    - [x] 更新成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90197)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dupdate)
    - [x] 删除成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90198)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Ddelete)
    - [x] 批量删除成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90199)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dbatchdelete)
    - [x] 获取部门成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90200)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dsimplelist)
    - [x] 获取部门成员详情 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90201)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dlist)
    - [x] userid 与 openid 互换 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90202)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dconverttoopenid)
    - [x] 二次验证 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90203)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dauthsucc)
    - [x] 邀请成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90975)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dinvite)
    - [x] 获取加入企业二维码 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91714)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dgetjoinqrcode)
    - [x] 获取企业活跃成员数 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92714)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/user#%E6%96%B9%E6%B3%95%E5%90%8Dgetactivestat)
  - [x] 部门管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90204)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/department)
    - [x] 创建部门 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90205)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/department#%E6%96%B9%E6%B3%95%E5%90%8Dcreate)
    - [x] 更新部门 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90206)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/department#%E6%96%B9%E6%B3%95%E5%90%8Dupdate)
    - [x] 删除部门 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90207)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/department#%E6%96%B9%E6%B3%95%E5%90%8Ddelete)
    - [x] 获取部门列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90208)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/department#%E6%96%B9%E6%B3%95%E5%90%8Dlist)
  - [x] 标签管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90209)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/tag)
    - [x] 创建标签 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90210)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/tag#%E6%96%B9%E6%B3%95%E5%90%8Dcreate)
    - [x] 更新标签名字 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90211)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/tag#%E6%96%B9%E6%B3%95%E5%90%8Dupdate)
    - [x] 删除标签 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90212)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/tag#%E6%96%B9%E6%B3%95%E5%90%8Ddelete)
    - [x] 获取标签成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90213)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/tag#%E6%96%B9%E6%B3%95%E5%90%8Dget)
    - [x] 增加标签成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90214)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/tag#%E6%96%B9%E6%B3%95%E5%90%8Daddtaguser)
    - [x] 删除标签成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90215)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/tag#%E6%96%B9%E6%B3%95%E5%90%8Ddeltaguser)
    - [x] 获取标签列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90216)[（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/directory/tag#%E6%96%B9%E6%B3%95%E5%90%8Dlist)
  - [ ] 异步批量接口 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90978)[（API 文档）]()
    - [ ] 增量更新成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90980)[（API 文档）]()
    - [ ] 全量覆盖成员 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90981)[（API 文档）]()
    - [ ] 全量覆盖部门 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90982)[（API 文档）]()
    - [ ] 获取异步任务列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90983)[（API 文档）]()
  - [ ] 通讯录回调通知 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90966)[（API 文档）]()
    - [ ] 成员变更通知 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90970)[（API 文档）]()
    - [ ] 部门变更通知 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90971)[（API 文档）]()
    - [ ] 标签变更通知 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90972)[（API 文档）]()
    - [ ] 异步任务完成通知 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90973)[（API 文档）]()
- [ ] 外部联系人管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92109)[（API 文档）]()
  - [ ] 成员对外信息 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92230) [（API 文档）]()
  - [ ] 企业服务人员管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92570) [（API 文档）]()
    - [ ] 获取配置了客户联系功能的成员列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92571) [（API 文档）]()
    - [ ] 客户联系「联系我」管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92572) [（API 文档）]()
  - [ ] 客户管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92112) [（API 文档）]()
    - [ ] 获取客户列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92113) [（API 文档）]()
    - [ ] 获取客户详情 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92114) [（API 文档）]()
    - [ ] 批量获取客户详情 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92994) [（API 文档）]()
    - [ ] 修改客户备注信息 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92115) [（API 文档）]()
  - [ ] 客户标签管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92116) [（API 文档）]()
    - [ ] 管理企业标签 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92117) [（API 文档）]()
    - [ ] 编辑客户企业标签 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92118) [（API 文档）]()
  - [ ] 客户群管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92119) [（API 文档）]()
    - [ ] 获取客户群列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92120) [（API 文档）]()
    - [ ] 获取客户群详情 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92122) [（API 文档）]()
  - [ ] 消息推送 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92134) [（API 文档）]()
    - [ ] 添加企业群发消息任务 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92135) [（API 文档）]()
    - [ ] 获取企业群发消息发送结果 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92136) [（API 文档）]()
    - [ ] 发送新客户欢迎语 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92137) [（API 文档）]()
    - [ ] 群欢迎语素材管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92366) [（API 文档）]()
  - [ ] 客户分配 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92123) [（API 文档）]()
    - [ ] 分配成员的客户 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92125) [（API 文档）]()
    - [ ] 获取离职成员的客户列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92124) [（API 文档）]()
    - [ ] 查询客户接替结果 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92973) [（API 文档）]()
    - [ ] 离职成员的群再分配 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92127) [（API 文档）]()
  - [ ] 统计管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92131) [（API 文档）]()
    - [ ] 获取联系客户统计数据 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92132) [（API 文档）]()
    - [ ] 获取客户群统计数据 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92133) [（API 文档）]()
- [ ] 应用管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90226) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/agent)
  - [x] 获取应用 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90227) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/agent#%E6%96%B9%E6%B3%95%E5%90%8Dget)
  - [x] 设置应用 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90228) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/agent#%E6%96%B9%E6%B3%95%E5%90%8Dset)
  - [x] 自定义菜单 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90230) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/agent/menu)
    - [x] 创建菜单 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90231) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/agent/menu#%E6%96%B9%E6%B3%95%E5%90%8Dcreate)
    - [x] 获取菜单 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90232) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/agent/menu#%E6%96%B9%E6%B3%95%E5%90%8Dget)
    - [x] 删除菜单 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90233) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/agent/menu#%E6%96%B9%E6%B3%95%E5%90%8Ddelete)
  - [ ] 设置工作台自定义展示 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92535) [（API 文档）]()
- [ ] 消息推送 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90235) [（API 文档）]()
  - [x] 发送应用消息 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90236) [（API 文档）]()
  - [ ] 更新任务卡片消息状态 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91579) [（API 文档）]()
  - [ ] 发送消息到群聊会话 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90243) [（API 文档）]()
    - [ ] 创建群聊会话 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90245) [（API 文档）]()
    - [ ] 修改群聊会话 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90246) [（API 文档）]()
    - [ ] 获取群聊会话 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90247) [（API 文档）]()
    - [ ] 应用推送消息 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90248) [（API 文档）]()
  - [ ] 互联企业消息推送 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90250) [（API 文档）]()
    - [ ] 发送应用消息 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90250) [（API 文档）]()
  - [ ] 查询应用消息发送统计 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92369) [（API 文档）]()
- [ ] 素材管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91054) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/media)
  - [x] 上传临时素材 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90253) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/media#%E6%96%B9%E6%B3%95%E5%90%8Dupload)
  - [ ] 上传图片 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90256) [（API 文档）]()
  - [ ] 获取临时素材 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90254) [（API 文档）]()
  - [ ] 获取高清语音素材 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90255) [（API 文档）]()
- [ ] OA 数据接口 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90261) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/oa)
  - [x] 企业微信打卡应用 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90261) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/oa/checkin)
    - [x] 获取打卡数据 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90262) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/oa/checkin#%E6%96%B9%E6%B3%95%E5%90%8Dgetcheckindata)
    - [x] 获取打卡规则 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90263) [（API 文档）](https://github.com/witjs/wecom/tree/master/src/modules/oa/checkin#%E6%96%B9%E6%B3%95%E5%90%8Dgetcheckinoption)
  - [ ] 企业微信审批应用 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90264) [（API 文档）]()
    - [ ] 获取审批模板详情 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91982) [（API 文档）]()
    - [ ] 提交审批申请 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91853) [（API 文档）]()
    - [ ] 批量获取审批单号 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91816) [（API 文档）]()
    - [ ] 获取审批申请详情 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91983) [（API 文档）]()
  - [ ] 企业微信公费电话 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90266) [（API 文档）]()
    - [ ] 获取公费电话拨打记录 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90266) [（API 文档）]()
  - [ ] 自建应用 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90268) [（API 文档）]()
    - [ ] 审批流程引擎 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90269) [（API 文档）]()
- [ ] 日程 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92554) [（API 文档）]()
  - [ ] 日历 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92616) [（API 文档）]()
    - [ ] 创建日历 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92616) [（API 文档）]()
    - [ ] 更新日历 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92619) [（API 文档）]()
    - [ ] 获取日历 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92621) [（API 文档）]()
    - [ ] 删除日历 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92620) [（API 文档）]()
  - [ ] 日程 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92617) [（API 文档）]()
    - [ ] 创建日程 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92622) [（API 文档）]()
    - [ ] 更新日程 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92623) [（API 文档）]()
    - [ ] 获取日程 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92624) [（API 文档）]()
    - [ ] 取消日程 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92625) [（API 文档）]()
    - [ ] 获取日历下的日程列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92626) [（API 文档）]()
- [ ] 微盘 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93018) [（API 文档）]()
  - [ ] 空间管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93019) [（API 文档）]()
    - [ ] 新建空间 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93023) [（API 文档）]()
    - [ ] 重命名空间 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93024) [（API 文档）]()
    - [ ] 解散空间 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93025) [（API 文档）]()
    - [ ] 获取空间信息 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93026) [（API 文档）]()
  - [ ] 空间权限 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93020) [（API 文档）]()
    - [ ] 添加成员/部门 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93027) [（API 文档）]()
    - [ ] 移除成员/部门 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93028) [（API 文档）]()
    - [ ] 权限管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93029) [（API 文档）]()
    - [ ] 获取邀请链接 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93030) [（API 文档）]()
  - [ ] 文件管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93021) [（API 文档）]()
    - [ ] 获取文件列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93031) [（API 文档）]()
    - [ ] 上传文件 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93032) [（API 文档）]()
    - [ ] 下载文件 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93033) [（API 文档）]()
    - [ ] 新建文件 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93034) [（API 文档）]()
    - [ ] 重命名文件 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93035) [（API 文档）]()
    - [ ] 移动文件 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93036) [（API 文档）]()
    - [ ] 删除文件 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93037) [（API 文档）]()
    - [ ] 文件信息 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93038) [（API 文档）]()
  - [ ] 文件权限 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93022) [（API 文档）]()
    - [ ] 新增指定人 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93039) [（API 文档）]()
    - [ ] 删除指定人 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93040) [（API 文档）]()
    - [ ] 分享设置 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93041) [（API 文档）]()
    - [ ] 获取分享链接 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/93042) [（API 文档）]()
- [ ] 会议室 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92892) [（API 文档）]()
  - [ ] 会议室管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92793) [（API 文档）]()
  - [ ] 会议室预定管理 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92794) [（API 文档）]()
- [ ] 企业支付 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90273) [（API 文档）]()
  - [ ] 企业红包 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90274) [（API 文档）]()
    - [ ] 发送企业红包 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90275) [（API 文档）]()
    - [ ] 查询红包记录 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90276) [（API 文档）]()
  - [ ] 向员工付款 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90277) [（API 文档）]()
    - [ ] 向员工付款 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90278) [（API 文档）]()
    - [ ] 查询付款记录 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90279) [（API 文档）]()
  - [ ] 向员工收款 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90280) [（API 文档）]()
- [ ] 电子发票 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90283) [（API 文档）]()
  - [ ] 查询电子发票 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90284) [（API 文档）]()
  - [ ] 更新发票状态 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90285) [（API 文档）]()
  - [ ] 批量更新发票状态 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90286) [（API 文档）]()
  - [ ] 批量查询电子发票 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/90287) [（API 文档）]()
- [ ] 会话内容存档 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91360) [（API 文档）]()
  - [ ] 获取会话内容 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91774) [（API 文档）]()
  - [ ] 获取会话内容存档开启成员列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91614) [（API 文档）]()
  - [ ] 获取会话同意情况 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/91782) [（API 文档）]()
  - [ ] 获取会话内容存档内部群消息 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92951) [（API 文档）]()
- [ ] 企业直播 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92735) [（API 文档）]()
  - [ ] 获取成员直播 ID 列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92735) [（API 文档）]()
  - [ ] 获取直播详情 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92734) [（API 文档）]()
  - [ ] 获取看直播统计 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92736) [（API 文档）]()
- [ ] 健康上报 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92747) [（API 文档）]()
  - [ ] 获取健康上报使用统计 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92747) [（API 文档）]()
  - [ ] 获取健康上报任务 ID 列表 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92749) [（API 文档）]()
  - [ ] 获取健康上报任务详情 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92751) [（API 文档）]()
  - [ ] 获取用户填写答案 [（官方文档）](https://work.weixin.qq.com/api/doc/90000/90135/92754) [（API 文档）]()
