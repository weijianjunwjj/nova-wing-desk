# Claude Code instructions

Read and follow docs/engineering/cross-platform.md before changing this repository.

NovaWing Desk is intentionally a small Evaluation & Evidence Console.

Session invariants:

- Keep /eval static and locally runnable with Node.js/npm only.
- Preserve Windows and macOS compatibility.
- Do not introduce Bash-only, PowerShell-only, WSL, Docker, database, API, secret, or fixed-path requirements into the standard development path.
- Career Eval data is engineering evidence. Preserve provenance, timing basis, review status, comparability caveats, and commit identity.
- Do not rebuild the removed Model Registry / Presets backend unless the user explicitly establishes a real Runtime consumer or ingestion contract.
- Make the smallest change that improves the evidence product, and preserve unrelated local edits.
