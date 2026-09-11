# NovaWing Desk

NovaWing Desk is the post-run operations layer for NovaWing.

It receives runtime events from NovaWing and turns them into an observable, traceable workflow for runs, issues, feedback, and human intervention.

## MVP

- Dashboard: run status and failure overview
- Runs: inspect NovaWing task/run history
- Issues: track failures and follow-up handling

## Architecture

- Web: React + Next.js + TypeScript
- API: NestJS + TypeScript
- Data: PostgreSQL + TypeORM
- Async (later): Redis + BullMQ
- Realtime (later): SSE
- Delivery (later): Docker + CI/CD

## Repository layout

```text
apps/
  web/   # Next.js UI
  api/   # NestJS API
docs/    # product and architecture notes
```

## Principle

Start with the smallest working loop between NovaWing runtime events and an operations UI. Add infrastructure only when the business flow requires it.
