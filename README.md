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

Requires Node.js 22.22.3 or newer and Docker.

```bash
npm install
docker compose up -d postgres
npm run dev:api
npm run dev:web
```

The web app is available at <http://localhost:3000> and the API at <http://localhost:3001/api/v1>. Environment defaults work with the included Compose service; copy `.env.example` when overrides are needed.

Database migrations and small, editable starter data are applied automatically when the API starts. PostgreSQL data is stored in the `novawing-desk-postgres` volume and survives service restarts.

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
