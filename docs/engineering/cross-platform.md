# Cross-platform development

NovaWing Desk must stay easy to run on real Windows and macOS hosts.

## Supported baseline

- Use the Node.js engines range in the root package.json.
- Use npm with the committed lockfile.
- The application is the Next.js web workspace only.
- No database, Docker, API service, secret file, or host-specific shell is required.

## Permanent portability invariants

1. Standard commands must have the same form on Windows and macOS.
2. Do not require Bash-only syntax, PowerShell-only cmdlets, WSL, fixed drive letters, fixed Unix home paths, or hand-written path separators.
3. Prefer Node.js/npm and framework-native tooling.
4. Do not make local success depend on developer-specific proxy, shell, editor, or globally installed package configuration.
5. Keep generated output and local caches untracked.

## Standard commands

    npm install
    npm run check
    npm run dev:web

Expected page:

    http://127.0.0.1:3000/eval

## Acceptance

For setup/tooling changes, verify npm run check on every real host actually available and report untested hosts explicitly. Do not infer Windows success from macOS, or vice versa.

For ordinary UI/content changes, the minimum acceptance is:

- npm run check
- production route generation includes /eval
- /eval renders without API/database dependencies
