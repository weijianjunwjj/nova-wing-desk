# Model Configuration Registry MVP

NovaWing Desk v0.1 proves one durable configuration loop:

1. A developer manages models and presets in the Desk web UI.
2. The NestJS API validates changes and persists them to PostgreSQL.
3. `GET /api/v1/runtime-config` aggregates only enabled models and valid enabled presets.
4. A future NovaWing Runtime client can select policy by preset key without hard-coding model names.

## Runtime contract

```json
{
  "version": 1,
  "models": [
    {
      "provider": "openai",
      "model": "gpt-6-luna",
      "displayName": "GPT-6 Luna",
      "supportsReasoning": true,
      "reasoningLevels": ["low", "medium", "high"],
      "defaultReasoningLevel": "low"
    }
  ],
  "presets": {
    "implementation": {
      "model": "gpt-6-luna",
      "reasoningLevel": "low"
    }
  }
}
```

`version` identifies this contract shape. Disabled models are omitted. Presets that are disabled or whose model is disabled are also omitted.

## Boundaries

This MVP does not implement authentication, runtime event collection, runs or issues dashboards, background queues, realtime updates, infrastructure deployment, a generic CMS, or Runtime repository integration.
