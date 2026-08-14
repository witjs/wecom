---
layout: home
hero:
  name: wecom
  text: 企业微信 Node SDK
  tagline: 面向 Node.js 22.18+。原生 fetch、共享 Token、结构化错误，方法直接返回业务数据。
  image:
    src: /logo.svg
    alt: wecom
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 浏览模块
      link: /api/
    - theme: alt
      text: GitHub
      link: https://github.com/witjs/wecom
features:
  - title: 原生运行时
    details: 零运行时依赖。使用 Node 内置 fetch、FormData 和 AbortSignal，不再捆绑 axios。
  - title: 共享 Token
    details: 相同 corpId + corpSecret + baseURL 共用缓存，并发刷新只打一次 gettoken。
  - title: 结构化错误
    details: errcode、HTTP、超时和配置错误分别抛出 WecomApiError / Http / Timeout / Config。
  - title: TypeScript 优先
    details: 全部 DTO 与响应类型从包根导出，ESM / CJS 双格式，声明文件按格式拆分。
  - title: 官方模块覆盖
    details: 通讯录、应用、素材、消息、客户联系、OA、日程、会议室和发票。
  - title: 可测试
    details: 可注入 fetch、TokenStore 和 logger，契约测试不依赖真实凭据。
---
