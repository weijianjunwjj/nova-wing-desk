# NovaWing Desk

NovaWing 的本机后台配置中心。当前第一项配置是 **Codex 模型策略**：三份可编辑的
profile，分别为 executor、retry、reviewer、escalation 指定模型 ID 和推理档位。
可以切换选中的 profile，保存后由 PostgreSQL 持久化，并通过 revision 防止并发覆盖。

本仓库不再承担学习协议或运行记录/Issue 面板的产品目标。

## 技术栈

- Web：React + Next.js + TypeScript
- API：NestJS + TypeScript
- 持久化：PostgreSQL + TypeORM（显式 migration，不启用 schema synchronize）
- Redis / BullMQ / SSE / Docker 发布流水线仅在真实配置需求出现时再引入

## 本机启动

要求 Node.js >=22.22.3、npm 和提供 `docker compose` 的 Docker 环境。标准本地链路在
Windows 与 macOS 使用相同命令；完整约束见
[跨平台开发规范](docs/engineering/cross-platform.md)。

首次启动：

1. 安装依赖：`npm install`。
2. 将仓库根目录的 `.env.example` 复制为 `.env`。默认值与 Compose 的本机开发账号匹配；
   `.env` 已被 Git 忽略，不要提交真实配置。如果 5432 已被占用，请同时修改
   `POSTGRES_PORT` 和 `DATABASE_URL` 中的宿主端口。
3. 启动 PostgreSQL：`docker compose up -d db`。
4. 执行 migration：`npm run db:migrate`。
5. 写入幂等的初始配置：`npm run db:seed`。
6. 在一个终端启动 API：`npm run dev:api`。
7. 在另一个终端启动 Web：`npm run dev:web`。

以后启动通常只需确认 Docker 正在运行，然后执行 `docker compose up -d db`、
`npm run dev:api` 和 `npm run dev:web`。API 会从仓库根目录 `.env` 加载
`DATABASE_URL`，并在启动时补跑尚未执行的 TypeORM migration，不依赖终端之前导出的变量。

访问 http://127.0.0.1:3000 。API 健康检查位于 http://127.0.0.1:3001/health 。
可用 `NOVAWING_DESK_API_URL` 指定 Next.js 服务端访问的 API 地址；浏览器只请求同源
`/api/model-routing`，不直接跨域访问 NestJS。

```bash
npm run build
npm test
```

## 当前边界

**保存到 Desk 不会改变 NovaWing 的执行模型。** NovaWing 目前按自己的 Work Session
配置运行，且当前源码的 Codex 模型选项尚未包含模板中的 GPT-6 Luna/Sol。
因此这些模板是待接入的策略草案。接入必须由 NovaWing 侧显式读取、验证支持情况，
并在新任务的安全边界应用指定 revision；不能由 Desk 直接写它的本地状态。

界面和 API 默认仅监听本机，不提供登录与远程访问。不要把此版本直接公开部署。
后续范围与 API 合约见 [docs/mvp.md](docs/mvp.md)。
