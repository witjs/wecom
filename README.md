# 企业微信 Node API

**目前只封装了基本的模块 有兴趣的同学可以一起加入并丰富其 API**

> 各个子模块相关文档 请前往 github 各个项目中[查看](src)

## 目前已完成模块

[应用管理模块](src/agent)

[通讯录管理模块](src/directory)

- [部门管理模块](src/directory/department)

- [成员管理模块](src/directory/user)

[素材管理模块](src/media)

[消息推送模块](src/message)

[oa 管理模块](src/oa)

- [企业微信打卡应用模块](src/oa/checkin)

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
  // 发送消息的参数参照 https://work.weixin.qq.com/api/doc/90000/90135/90236
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

> 单元测试之前 请按照`.env.example`的格式 完善相关的内容配置

```shell
yarn run test
```
