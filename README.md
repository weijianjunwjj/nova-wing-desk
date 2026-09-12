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

## Learning workflow

NovaWing Desk is also the first dogfood environment for NovaWing's reusable **Curiosity Mode** learning protocol.

The protocol turns real implementation problems into short learning loops: predict, identify the knowledge gap, run a minimal experiment, let the human own the highest-learning-value change, then let AI finish the mechanical work.

See [`docs/curiosity-learning.md`](docs/curiosity-learning.md).

The current repository policy remains `strict` until Curiosity Mode is implemented in the NovaWing runtime; the document defines the target behavior without introducing an unsupported runtime mode.

## Repository layout

```text
apps/
  web/   # Next.js UI
  api/   # NestJS API
docs/    # product and architecture notes
```

## Principle

Start with the smallest working loop between NovaWing runtime events and an operations UI. Add infrastructure only when the business flow requires it.
