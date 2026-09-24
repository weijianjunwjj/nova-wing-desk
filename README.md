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

要求 Node.js >=22.22.3、npm 和 PostgreSQL。可选用 `docker compose up -d db`
启动本机数据库，示例账号只用于本机开发。

```bash
npm install
export DATABASE_URL='postgres://novawing:novawing-dev@127.0.0.1:5432/novawing_desk'
npm run dev:api
# 另开一个终端
npm run dev:web
```

访问 http://127.0.0.1:3000 。API 在 http://127.0.0.1:3001 ，启动时执行
TypeORM migration。可用 `NOVAWING_DESK_API_URL` 指定 Next.js 服务端访问的 API 地址；
浏览器只请求同源 `/api/model-routing`，不直接跨域访问 NestJS。

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
