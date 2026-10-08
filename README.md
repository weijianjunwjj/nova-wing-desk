# NovaWing Desk

NovaWing Desk 是 NovaWing 的 Evaluation & Evidence Console（工程评测与证据控制台）。

当前版本只做一件事：把真实 AI 工程任务的执行结果、独立 Review 结论和可复核证据整理成清晰的展示面，用于工程决策与 Career Release。

## 当前能力

- TTAR（Time to Accepted Result）：从任务提交到独立 Review 通过的实际耗时。
- First-pass Acceptance：第一次实现是否无需纠偏即可通过。
- Low / Medium / High 真实任务重放：基于 NovaWing 历史任务的 fresh-baseline replay。
- Harness / Model 对照：记录执行 Harness、模型路由、推理档位、耗时、Review 结果与 commit SHA。
- 工程结论：强调 accepted-result latency，而不是只比较首个结果速度或公开 benchmark。

路由：

    /      -> /eval
    /eval  -> 工程评测

## 架构

Desk 现在是一个纯前端 Next.js 应用：

    NovaWing real task replay
            ↓
    frozen evaluation dataset
            ↓
    NovaWing Desk /eval
            ↓
    TTAR / First-pass / Review / Commit evidence

技术栈：Next.js 16、React 19、TypeScript 6。

运行时评测数据的 source of truth 位于 NovaWing 仓库的 benchmark/career-eval-v1.json。Desk 当前保存一份冻结展示快照，不连接 Runtime，也不做实时事件采集。

## 为什么删除 Model Registry / Presets / API / PostgreSQL

早期 Desk 被设计成配置管理平面，包含模型 CRUD、任务预设、NestJS API、TypeORM、PostgreSQL、migration 与 seed。

这些能力在当前阶段没有真实 Runtime consumer，也不直接提高 Career Release 的工程证据价值。继续保留只会带来：

- 本地启动依赖 API + 数据库；
- 页面容易出现无意义的 Failed to fetch；
- 配置、迁移、seed、Compose 和后端依赖的维护成本；
- 对 Desk 当前职责的干扰。

因此本轮将它们完整移除，而不是隐藏入口。

重新引入后端的条件：只有当 NovaWing Runtime 出现真实、持续的配置消费需求或评测事件 ingestion 需求时，再基于明确 contract 恢复服务端能力。

该决策见 docs/adr/0001-evidence-console-scope.md。

## 本地开发

要求 Node.js 22.22.3 或更高版本。

    npm install
    npm run check
    npm run dev:web

浏览器打开 http://127.0.0.1:3000/eval。

不需要 PostgreSQL、Docker Compose、.env 或 API 服务。

## 验证

    npm run check

当前 check 包含：

- Next.js route type generation + TypeScript typecheck
- production build

跨平台约束见 docs/engineering/cross-platform.md。

## 当前边界

当前明确不做：

- 模型配置 CRUD
- 任务预设 CRUD
- PostgreSQL / TypeORM
- NestJS API
- Runtime 配置下发
- Runtime 实时事件 ingestion
- 用户 / RBAC
- 队列 / Redis / realtime
- 云部署

新增能力必须直接提高可解释、可验证、可展示的工程证据价值。
