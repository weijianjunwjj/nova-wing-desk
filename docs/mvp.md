# MVP scope

NovaWing Desk v0.1 proves one real loop:

1. NovaWing emits a task/run event.
2. Desk receives and persists it.
3. The dashboard and run list reflect the current state.
4. A failed run can open an issue.
5. A human can record a resolution.

Out of scope for v0.1: multi-agent orchestration, Kubernetes, Kafka, complex RBAC, billing, and generic ticketing features.
