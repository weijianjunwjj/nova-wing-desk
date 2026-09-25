# Cross-platform development

This document is the canonical source for NovaWing Desk local-development portability.
Repository instructions and automation must support both Windows and macOS without
requiring contributors to translate commands or edit tracked files for their host OS.

## Supported hosts and baseline

- Windows development runs on a real Windows host in PowerShell 7 or another terminal
  capable of invoking the same portable commands.
- macOS development runs on a real macOS host in its normal terminal.
- Node.js, npm, a root `.env` file, and Docker Compose are the default local-development
  baseline.
- Use the Node.js version declared by `package.json` and the repository's npm lockfile.
- Docker Desktop, or another implementation providing `docker compose`, supplies the
  local PostgreSQL service.

## Permanent portability invariants

All committed development workflows, documentation, npm scripts, and application code
must obey these rules:

1. Do not require Bash-only syntax or utilities, including `export`, shell pipelines,
   command substitution, or `.sh` wrappers, for the standard development path.
2. Do not require PowerShell-only syntax, cmdlets, `.ps1` wrappers, or Windows batch
   files for the standard development path.
3. Do not require WSL. WSL may be used by an individual contributor, but it is not a
   supported dependency or substitute for Windows real-host acceptance.
4. Do not embed fixed drive letters, user-home locations, or fixed Unix paths such as
   `C:\...`, `D:\...`, `/Users/...`, `/home/...`, or `/tmp/...` in repository behavior.
5. Do not hand-write OS path separators in application or tooling code. Resolve paths
   from module or working-directory locations with Node.js URL/path APIs such as
   `fileURLToPath`, `path.resolve`, and `path.join`.
6. Prefer cross-platform Node.js programs behind npm scripts when a workflow needs
   logic beyond a direct executable invocation.
7. Invoke local services through `docker compose`; do not make a platform-specific
   package-manager installation of PostgreSQL part of the default path.

OS-specific commands may appear only in explicitly labelled optional diagnostics or
host-specific troubleshooting. They must not be required by build, test, migration,
seed, or first-start instructions.

## Environment configuration

- Local configuration lives in the repository-root `.env` file.
- `.env` is developer-local, must remain ignored by Git, and must never contain values
  intended for source control.
- `.env.example` is the committed, non-secret template and documents every variable
  required for the default local path.
- Application startup and database scripts load the root `.env` themselves. They must
  not depend on variables exported by a previous terminal session.
- Existing process environment values may override `.env` for CI and intentional
  one-off operation, but the documented cold start uses only the persisted `.env`.

## Portable local commands

Documentation must express the normal workflow using commands that have the same form
on Windows and macOS:

```text
npm install
docker compose up -d db
npm run db:migrate
npm run db:seed
npm run dev:api
npm run dev:web
```

If additional orchestration becomes necessary, add a cross-platform npm script backed
by Node.js rather than documenting separate shell implementations.

## Cold-start acceptance

A change to local setup, environment loading, database bootstrap, migrations, seed
behavior, or development commands is not complete until both host paths are verified.

### Windows real-host acceptance

On a real Windows host, from a fresh clone or an equivalent clean checkout with no
relevant pre-exported environment variables:

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` using the host UI or any local file operation.
3. Start PostgreSQL with `docker compose up -d db`.
4. Run `npm run db:migrate`, then `npm run db:seed`.
5. Start `npm run dev:api` in one terminal and `npm run dev:web` in another.
6. Verify the API health endpoint, the web page, and the web-to-API request path.

### macOS real-host acceptance

Repeat the same six steps on a real macOS host. A container, WSL session, CI runner,
or syntax review does not count as either real-host result.

Record the tested OS, result, and any host-specific defect in the change handoff. If
only one real host is available, report the other host as not yet verified; do not imply
cross-platform acceptance from one-host success.
