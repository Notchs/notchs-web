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
