# NovaWing Desk v0.1 — 配置中心

## 目标

Desk 是 NovaWing 的独立后台配置界面。第一条可运行的闭环是维护 Codex 模型策略：

1. 在本机打开 Web 界面，查看 economy / balanced / quality 三份配置。
2. 调整 executor / retry / reviewer / escalation 的模型 ID 与推理档位。
3. 选择一份配置并保存到 PostgreSQL；重启 API 后仍能读取。
4. 并发编辑使用 revision 检测冲突，旧页面不能静默覆盖新配置。

`GET /config/model-routing` 返回配置、revision 和更新时间。`PUT /config/model-routing`
接受 `{ "expectedRevision": number, "selectedProfile": string, "profiles": object }`；
revision 冲突返回 HTTP 409，非法输入返回 400。配置中不存凭据。

## 与 NovaWing 的边界

此版本只负责**保存与展示配置**。NovaWing 的 Work Session 仍使用自身可信配置、
任务创建时的模型选择和已有的校验逻辑。Desk 保存操作不会修改运行中的任务，也不会
推送配置到 NovaWing。未来接入需在 NovaWing 内增加显式读取/版本校验/兼容性验证，
并定义新任务何时采用新 revision；Desk 不直接写 NovaWing 的 SQLite、配置目录或进程。

初始模板包含 GPT-6 Luna/Sol，是建议组合，不表示当前 NovaWing 的
`CODEX_MODEL_OPTIONS` 已支持这两个模型。接入前需更新和验证运行端模型列表。

## 安全边界

v0.1 只面向个人本机运行：Next.js 和 NestJS 绑定 `127.0.0.1`，PostgreSQL 的示例
compose 也只映射本机。没有登录、远程发布和跨设备同步；如需公网或局域网访问，
须先补身份验证、授权、CSRF 防护、TLS 与审计，再改变监听地址。

## 不在 v0.1 中

运行时热更新、任务自动升级模型、多 provider 路由、价格/额度计量、通用配置编辑器、
运行记录和 Issue 面板。
