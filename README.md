# AI Guide — Workspace Documentation

This repository is a **pnpm monorepo** written in **TypeScript**. It contains a location-aware fort guide app (**Karunada Kote Guide**), a **Vite + React** mockup sandbox, an **Express** API backed by **PostgreSQL**, and shared libraries for schemas, API contracts, and clients.

For Replit-oriented notes (Node version pin, workspace habits), see [`replit.md`](./replit.md).

---

## What lives here

| Package | Path | Role |
|--------|------|------|
| **Karunada Kote Guide** | `artifacts/karunada-kote` | **Expo (React Native)** app: fort exploration, location-based narration, maps, media, and related UX. Ships web via Expo. |
| **API server** | `artifacts/api-server` | **Express 5** HTTP API (`/api`, static `/uploads`), **Pino** logging, **JWT** / cookies / uploads as implemented in routes. |
| **Mockup sandbox** | `artifacts/mockup-sandbox` | **Vite + React** web UI using **Tailwind CSS 4**, **Radix UI**, charts, forms — useful for design and component experiments. |
| **Database** | `lib/db` | **Drizzle ORM** schema and migrations workflow; **PostgreSQL** via `pg`. |
| **API spec** | `lib/api-spec` | **OpenAPI** spec (`openapi.yaml`) and **Orval** codegen for typed clients and alignment with Zod. |
| **API Zod** | `lib/api-zod` | Shared **Zod** schemas/types consumed by the API and tooling. |
| **API client (React)** | `lib/api-client-react` | **TanStack React Query**-oriented client helpers for React consumers. |
| **Scripts** | `scripts` | Small **tsx** utilities (e.g. `hello`). |

Workspace layout and dependency versions are governed by [`pnpm-workspace.yaml`](./pnpm-workspace.yaml) (including catalog pins and supply-chain–related settings).

---

## Prerequisites

- **Node.js** (the team documents **Node 24** in `replit.md`; use an LTS or the version your environment standardizes on).
- **pnpm** (lockfile and scripts assume pnpm).
- **PostgreSQL** when running database pushes or the API against a real DB (`DATABASE_URL`).

---

## Install

From the repository root:

```bash
pnpm install
```

---

## Common commands

| Goal | Command |
|------|---------|
| Typecheck everything | `pnpm run typecheck` |
| Typecheck + build all packages that define `build` | `pnpm run build` |
| Regenerate API client / Zod from OpenAPI | `pnpm --filter @workspace/api-spec run codegen` |
| Apply Drizzle schema to DB (dev; needs `DATABASE_URL`) | `pnpm --filter @workspace/db run push` |

---

## Run the apps

### Karunada Kote Guide (Expo)

```bash
cd artifacts/karunada-kote
pnpm dev
```

This starts **Expo / Metro** (default bundler port is chosen from `PORT` or **8081**). Open the printed **localhost** URL in a browser for the dev UI, or use Expo Go / simulators from there.

Static web export (if you need a build):

```bash
pnpm run build
# or
pnpm run build:web
```

Optional local static serve (see that package’s `serve` script).

### Mockup sandbox (Vite web)

```bash
cd artifacts/mockup-sandbox
pnpm dev
```

Uses **Vite** dev server per that package’s configuration.

### API server

The server **requires** a `PORT` environment variable. For local development it also expects a valid **build** step (see `artifacts/api-server/package.json`: `dev` runs `build` then `start`).

Set at least:

- `PORT` — listen port (e.g. `3000`).
- `DATABASE_URL` — PostgreSQL URL for Drizzle when using the database stack.

Example (Unix-style env):

```bash
export PORT=3000
export DATABASE_URL="postgres://user:pass@localhost:5432/dbname"
pnpm --filter @workspace/api-server run dev
```

On **Windows**, set variables in PowerShell (`$env:PORT=3000`) or use your hosting provider’s secret manager. The API serves routes under **`/api`** and static uploads under **`/uploads`**.

---

## Tech stack (summary)

- **Monorepo**: pnpm workspaces, shared catalog versions, TypeScript ~5.9, Prettier.
- **Mobile / cross-platform**: Expo ~54, React 19, React Native, Expo Router, TanStack Query, Zod, React Compiler (enabled in app config), maps and native modules as declared in `artifacts/karunada-kote/package.json`.
- **Web sandbox**: Vite 7, React, Tailwind CSS 4, Radix UI, react-hook-form, Zod, Framer Motion, Recharts, and related UI libraries.
- **Backend**: Express 5, Drizzle ORM, Pino, esbuild-bundled Node output, JWT and standard middleware (CORS, cookies, multipart).
- **Data & contracts**: PostgreSQL, Drizzle Kit, Zod / drizzle-zod, OpenAPI + Orval codegen.

---

## Configuration highlights

- **Expo app** metadata and permissions: `artifacts/karunada-kote/app.json` (app name **Karunada Kote Guide**, scheme `karunada-kote`, location and camera usage copy for iOS/Android).
- **OpenAPI**: `lib/api-spec/openapi.yaml`.
- **Drizzle**: `lib/db/drizzle.config.ts` (requires `DATABASE_URL`).

---

## License

Root `package.json` declares **MIT** for the workspace package metadata; confirm per-package `license` fields if you redistribute individual packages.
