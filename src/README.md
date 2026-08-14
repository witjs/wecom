# 源码说明

```
src
├── index.ts           包根导出
├── wecom.ts           基类：Token、request、重试
├── common/            公共类型
├── core/              错误、传输、Token 存储
└── modules/           业务客户端，一客户端一目录
```

每个业务模块都是独立客户端，从包根导入。目录约定见 [modules/README.md](./modules/README.md)。
