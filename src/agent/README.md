# 应用管理模块

## 模块安装

```
import {Agent} from 'wecom'
```

## 快速开始

> 该模块的 corpSecret 的查看路径 企业微信> 应用管理> [自建](https://work.weixin.qq.com/wework_admin/frame#apps)> 应用详情页

```javascript
// 应用管理模块实例化
const agent = new Agent({
  corpId: process.env.CORPID,
  corpSecret: process.env.TEST_SECRET,
  agentId: process.env.TEST_AGENT_ID,
});
// 获取应用详情
const ret = await agent.get();
```

## 实例方法

### **方法名**：`get`

**说明**：获取应用详情
**例子**：

```javascript
agent.get();
```

| 参数名  | 参数类型 | 必填 | 参数描述      |
| :------ | :------: | :--: | :------------ |
| agentid |  number  |  是  | 企业应用的 id |

### **方法名**：`set`

**说明**：设置应用详情
**例子**：

```javascript
agent.set({
  name: "新应用名称",
});
```

**参数说明**

| 参数名               | 参数类型 | 必填 | 参数描述                                                                                           |
| :------------------- | :------: | :--: | :------------------------------------------------------------------------------------------------- |
| report_location_flag |  number  |  否  | 企业应用是否打开地理位置上报 0：不上报；1：进入会话上报；                                          |
| logo_mediaid         |  string  |  否  | 企业应用头像的 mediaid，通过素材管理接口上传图片获得 mediaid，上传后会自动裁剪成方形和圆形两个头像 |
| name                 |  string  |  否  | 企业应用名称，长度不超过 32 个 utf8 字符                                                           |
| description          |  string  |  否  | 企业应用详情，长度为 4 至 120 个 utf8 字符                                                         |
| redirect_domain      |  string  |  否  | 企业应用可信域名。注意：域名需通过所有权校验，否则 jssdk 功能将受限，此时返回错误码 85005          |
| isreportenter        |  number  |  否  | 是否上报用户进入应用事件。0：不接收；1：接收。                                                     |
| home_url             |  string  |  否  | 应用主页 url。url 必须以 http 或者 https 开头（为了提高安全性，建议使用 https）。                  |

**官方地址**：
详情参考[官方文档](https://work.weixin.qq.com/api/doc/90000/90135/90227)
