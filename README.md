# Notchs Web

Frontend of the Notchs web application, built with Next.js (App Router), React, TypeScript and Tailwind CSS.

## Requirements

- Node.js 20.9 or newer
- npm

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the development server      |
| `npm run build`        | Create a production build         |
| `npm run start`        | Serve the production build        |
| `npm run lint`         | Lint the codebase                 |
| `npm run lint:fix`     | Lint and apply automatic fixes    |
| `npm run typecheck`    | Type-check without emitting files |
| `npm run format`       | Format the codebase with Prettier |
| `npm run format:check` | Verify formatting                 |

## Project structure

```
src/
├── app/        Routing only: layouts, pages and route-level files
├── config/     App-wide configuration (site metadata, routes, environment)
├── modules/    Feature modules, one folder per module
│   └── <name>/
│       ├── components/
│       └── index.ts    Public API of the module
└── shared/     Code reused across modules
    ├── components/
    └── lib/
```

Rules that keep the structure modular:

- Route files in `app/` stay thin and render what modules export.
- A module is imported only through its `index.ts` (`@/modules/<name>`), never through its internal files.
- `shared/` and `config/` never import from `modules/`.
- Anything needed by more than one module moves to `shared/` instead of being duplicated.

These boundaries are enforced by ESLint.

## Branching

- `main` — default branch
- `development` — integration branch, created from `main`
- `feature/<module>-module` — feature work, created from `development`
- `fix/<name>` — fixes, created from `development`

## Test links and the team login

Only the live site (Netlify production) is public. Every other Netlify build, meaning deploy previews and branch deploys, asks for the team login on every page and tells search engines not to index anything.

- The choice is made at build time in `next.config.ts` (`SITE_ACCESS`), so the live site can't be locked by mistake at runtime, and a test link can't be opened by mistake.
- Set `TEAM_USERNAME` and `TEAM_PASSWORD` in Netlify for the **Deploy Previews** and **Branch deploys** contexts only. Until they are set, test links stay locked.
- Locally the site is public. Run with `SITE_ACCESS=team` plus the two variables to try the login.
- `src/proxy.ts` runs `guardTeamAccess` first. Keep it first when adding more proxy logic.
