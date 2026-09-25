# Agent instructions

Before changing this repository, read and follow
[`docs/engineering/cross-platform.md`](docs/engineering/cross-platform.md). It is the
canonical source for local-development and cross-platform rules.

The following are permanent project invariants for Codex and every other coding agent:

- Preserve Windows and macOS support in all committed workflows.
- Do not make the standard path depend on Bash-only or PowerShell-only behavior, WSL,
  fixed drive letters, fixed Unix paths, or hand-written OS path separators.
- Use Node.js/npm, a repository-root `.env`, and Docker Compose as the default local
  development baseline.
- Keep real `.env` files untracked; commit only safe templates such as `.env.example`.
- Treat Windows real-host and macOS real-host cold starts as the formal acceptance rule.
- Keep detailed guidance in the canonical document instead of duplicating it here.

When instructions conflict, follow the user's latest explicit request, then repository
source/tests and the canonical cross-platform document. Make the smallest scoped change
that satisfies the task, and do not overwrite unrelated working-tree changes.
