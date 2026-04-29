# SushiMate Monorepo

Curated developer-friendly workspace that bundles the SushiMate frontend (Vite + React + Tailwind) and the companion Express mock API. Everything lives under `apps/` with npm workspaces so engineers can install once and run both stacks with a single command.

## Quick Start

```bash
cd site3
npm install        # installs root + all workspaces
npm run dev        # runs frontend (5173) + backend (5001) in parallel
```

### Useful Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Spins up Vite + Express together via npm-run-all |
| `npm run build` | Type-checks and builds the frontend into `apps/frontend/dist` |
| `npm run start` | Launches the Express API only (after `npm install`) |
| `npm run lint` | ESLint pass for the React app |

> All scripts can be executed from repo root. Under the hood they proxy to the corresponding workspace.

## Project Layout

```
site3/
├─ apps/
│  ├─ frontend/   Vite + React SPA (Tailwind, React Router, Context API)
│  └─ backend/    Express mock API + Mongo-ready models
├─ .github/       Issue templates + future workflows
├─ .vscode/       Recommended tasks/settings for the team
├─ package.json   npm workspaces config + orchestration scripts
└─ README.md      You're here
```

## Environment & Secrets

- Frontend has no env requirements; API base URL is set in `src/services/api.ts`.
- Backend reads `apps/backend/.env`. Start from `.env.example` and never commit secrets.
- `.gitignore` already excludes env files + build artifacts.

## Dev Notes

- The repo installs cleanly with **Node 20+**.
- MongoDB is optional; without `MONGODB_URI` the API reverts to the included mock data.
- Pending follow-ups: `/order/success` + `/order/failed` routes on the frontend, plus photo swaps if we get studio assets.

Have fun — everything is wired so another developer can open the repo and ship within minutes.
