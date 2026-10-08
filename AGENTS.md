# Agent instructions

Before changing this repository, read and follow docs/engineering/cross-platform.md.

NovaWing Desk is an Evaluation & Evidence Console, not a generic admin platform.

Permanent project invariants:

- Preserve Windows and macOS support in committed workflows.
- Keep the standard path on Node.js/npm; do not require Bash-only, PowerShell-only, WSL, fixed drive letters, fixed Unix paths, or hand-written OS path separators.
- Keep /eval usable without an API, database, Docker, secrets, or local environment file.
- Treat the frozen Career Eval dataset as evidence: do not silently rewrite timings, review outcomes, commit SHAs, comparability notes, or methodology to make results look better.
- Do not reintroduce Model Registry, Presets, API, database, or realtime ingestion without a real consumer and an explicit contract.
- Prefer the smallest scoped change that increases explainability, verifiability, or presentation value. Do not overwrite unrelated working-tree changes.

When instructions conflict, follow the user's latest explicit request, then repository source and verification.
