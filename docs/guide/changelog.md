---
description: wecom 版本更新记录
---

# 更新日志

下文摘自仓库 [CHANGELOG.md](https://github.com/witjs/wecom/blob/feat/v1-modern-sdk/CHANGELOG.md)。

## 1.0.0-rc.3

### Minor Changes

- 按身份补齐 Callback、Suite、Provider、Webhook、AiBot 和 Hardware，自建应用用法保持不变。

## 1.0.0-rc.2

### Breaking Changes

- 仅发布 ESM，移除 CommonJS 构建产物

### Bug Fixes

- 区分用户主动取消和请求超时错误
- 避免 token 失效后旧刷新结果写回缓存
- 校验 query 参数和消息 agentid，避免静默发送错误请求
- gettoken 响应缺少 access_token 时不再误判为可重试错误

### Performance

- 文件路径媒体上传使用文件 Blob，减少预读内存
- Readable 上传增加缓冲上限，避免超大流导致内存失控

## 1.0.0-rc.1

### Breaking Changes

- 最低运行环境提升为 Node.js 22.18+
- 模块方法和 `request()` 直接返回业务数据，不再包装 AxiosResponse
- 企业微信 `errcode !== 0`、HTTP 错误和超时会抛出 WecomError
- 移除 axios、form-data、`createApi` 和公开 `client`
- 修正文件消息、agentid、toparty 等错误类型

### Features

- 使用原生 fetch、共享 TokenManager 和可替换 TokenStore
- 输出 ESM / CommonJS 双格式，并导出稳定公共类型
- 增加 timeout、AbortSignal、自定义 fetch 和 logger 钩子
- 使用 Vitest 契约测试替代依赖真实凭据的默认测试
- 构建升级到 tsdown 0.22，集成测试改用 `process.loadEnvFile`
- lint / format 切换到 oxlint + oxfmt
