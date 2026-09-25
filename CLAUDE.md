# Claude Code instructions

At the start of every Claude Code session in this repository, read and follow
[`docs/engineering/cross-platform.md`](docs/engineering/cross-platform.md). That document
is the single detailed source of truth for cross-platform development.

Permanent session invariants:

- All standard development paths must work on Windows and macOS.
- Do not introduce Bash-only or PowerShell-only requirements, WSL dependencies, fixed
  drive letters, fixed Unix paths, or hand-written OS path separators.
- Keep Node.js/npm, repository-root `.env`, and Docker Compose as the default baseline.
- Never commit a real `.env`; maintain a safe `.env.example` for required configuration.
- Require Windows real-host plus macOS real-host cold-start acceptance for setup changes,
  and report any host that has not actually been verified.

Do not duplicate the detailed rules here. Update the canonical document when the shared
cross-platform policy changes, then keep this file as a short mandatory entry point.
