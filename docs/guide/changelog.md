---
description: wecom 版本更新记录
---

# 更新日志

下文摘自仓库 [CHANGELOG.md](https://github.com/witjs/wecom/blob/feat/v1-modern-sdk/CHANGELOG.md)。

## 1.0.0

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
