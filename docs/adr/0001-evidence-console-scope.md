# ADR 0001 — Desk 收缩为 Evaluation & Evidence Console

- Status: Accepted
- Date: 2026-10-08

## Context

NovaWing Desk 最初作为配置管理平面实现了 Model Registry、任务预设、NestJS API、TypeORM、PostgreSQL、migration 与 seed。

Career Release 阶段的核心目标已经变成：把真实 AI 工程任务的质量、耗时、Review 与证据组织成可复核、可展示的工程资产。

原配置后端没有真实 Runtime consumer；保留它会增加启动与维护成本，并让用户进入页面时依赖一个与当前目标无关的 API / database stack。

## Decision

Desk 收缩为纯 Next.js 的 Evaluation & Evidence Console。

保留：

- /eval
- TTAR / First-pass / Review / commit evidence
- Low / Medium / High 真实任务重放
- 冻结评测快照与方法说明

移除：

- /models
- /presets
- NestJS API
- PostgreSQL / TypeORM
- migration / seed
- Docker Compose
- runtime-config API
- 本地环境变量模板

根路由 / 直接进入 /eval。

## Consequences

正向：

- clone 后只需 Node.js/npm 即可启动；
- 不再出现因 API 未启动导致的无意义 Failed to fetch；
- Desk 的职责与 Career Release 证据目标一致；
- 依赖面、维护面和面试解释成本显著下降。

代价：

- Desk 暂时不提供动态配置管理；
- Career Eval 数据仍是冻结快照，尚未自动从 Runtime ingestion。

## Reintroduction trigger

只有满足至少一项真实需求时，才重新引入后端：

1. NovaWing Runtime 有持续、明确的配置读取 contract；
2. Desk 需要接收真实运行产生的 evaluation events；
3. 静态快照已无法支持实际决策或展示。

届时从 consumer contract / event schema 开始设计，不恢复旧 CRUD 仅仅因为“以前做过”。
