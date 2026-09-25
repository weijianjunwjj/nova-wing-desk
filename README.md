# NovaWing Desk

NovaWing Desk is NovaWing's independent configuration and management plane. NovaWing Runtime executes work; Desk owns durable configuration and exposes a stable API that Runtime can consume.

Phase 1 implements the **Model Configuration Registry**:

- manage available models and their reasoning capabilities;
- map work presets such as `implementation` and `review` to a model policy;
- persist configuration in PostgreSQL;
- publish only enabled, valid configuration through `GET /api/v1/runtime-config`.

## Architecture

- Web: Next.js + React + TypeScript (`apps/web`)
- API: NestJS + TypeScript + validation (`apps/api`)
- Database: PostgreSQL + TypeORM migrations

Desk and NovaWing Runtime remain separate repositories. Runtime integration is intentionally not part of this phase.

## Local development

Requires Node.js 22.22.3 or newer, npm, and a Docker environment that provides `docker compose`. Windows and macOS use the same standard commands; see the [cross-platform development standard](docs/engineering/cross-platform.md) for the permanent portability rules.

For the first start:

1. Install dependencies with `npm install`.
2. Copy the repository-root `.env.example` to `.env`. The real `.env` is ignored by Git and must not be committed. If port 5432 is already in use, change both `POSTGRES_PORT` and the host port in `DATABASE_URL`.
3. Start PostgreSQL with `docker compose up -d postgres`.
4. Apply migrations with `npm run db:migrate`.
5. Ensure the editable Phase 1 starter data exists with `npm run db:seed`.
6. Start the API with `npm run dev:api`.
7. In another terminal, start the web app with `npm run dev:web`.

The API and database commands load `DATABASE_URL` from the repository-root `.env`; they do not depend on values exported by a previous shell session. Existing process environment values may override `.env` for CI or intentional one-off operation.

The web app is available at <http://127.0.0.1:3000> and the API at <http://127.0.0.1:3001/api/v1>.

Database migrations are also applied automatically when the API starts. Both `db:migrate` and `db:seed` are safe to repeat. PostgreSQL data is stored in the `novawing-desk-postgres` volume and survives service restarts.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/models` | List configured models |
| `POST` | `/api/v1/models` | Create a model |
| `PATCH` | `/api/v1/models/:id` | Edit, enable, or disable a model |
| `GET` | `/api/v1/presets` | List presets |
| `PATCH` | `/api/v1/presets/:key` | Change a preset policy |
| `GET` | `/api/v1/runtime-config` | Stable Runtime-facing effective configuration |

The Runtime contract uses public DTOs rather than database entities. Its top-level `version` is the contract version, not a change counter.

## Verification

```bash
npm run check
```

This runs TypeScript checks, unit tests, and production builds for all workspaces.

## Current scope

This phase deliberately excludes users and RBAC, runtime event ingestion, dashboards, Redis, queues, realtime transport, cloud deployment, and changes to the NovaWing Runtime repository.
