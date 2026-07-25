# CLAUDE.md

Notes for agents working in this repo. Read this before you change code.

## What wristkit is

wristkit is an open source set of React components that show Apple Health data
on a website. It is not an npm package and not a CLI. People copy the files from
the docs site into their own Next.js project, run a SQL migration in their own
Supabase, and import an iOS Shortcut on their iPhone.

Data flow: iPhone Shortcut posts JSON to the user's own `/api/wristkit-sync`
route, that route writes rows to the user's own Supabase, and a Server Component
reads those rows and renders the card. We never receive user data. No telemetry.

## Commands

Always run these before you commit anything:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

Other useful ones:

```bash
pnpm dev                      # runs the site (apps/web) through Turbo
pnpm format                   # biome format --write
pnpm --filter @wristkit/web test:e2e     # Playwright only
pnpm --filter @wristkit/registry test    # Vitest only
```

`pnpm lint` is Biome at the repo root. `pnpm test`, `pnpm typecheck` and
`pnpm build` go through Turbo, so they run in every workspace.

## Repo layout

```
apps/web/                 the public site (Next.js 15, App Router, Tailwind v4)
  app/                    marketing page, docs routes, /shortcut route
  content/docs/           MDX docs, compiled by Velite
  components/             site UI only, not shipped to users
  lib/registry-files.ts   reads real registry files so docs show real code
  tests/e2e/              Playwright
packages/registry/        the source of truth for everything users copy
  components/today-activity-card/
  handlers/wristkit-sync-handler/
  lib/                    db, schema, queries, validation
  schemas/                SQL migrations
  shortcuts/              the .shortcut binary
  tests/                  Vitest (component states and handler)
packages/tokens/          design tokens (mostly a placeholder today)
agents/                   old design notes, gitignored, see below
```

## Rules that matter

**`packages/registry` is the source of truth.** The docs site does not keep its
own copy of the component or handler code. `apps/web/lib/registry-files.ts`
reads the real files from disk at build time and renders them in code blocks. So
when you change a registry file, the docs update by themselves. Never paste
registry code into an MDX file by hand.

**The component never fetches.** `index.tsx` is a pure renderer that takes a
`state` prop. `load.ts` does the database work on the server and returns the
state. Keep that split.

**Five states, always.** `TodayState` is `loading`, `empty`, `error`, `stale`
and `ok`. Every state has a real design and a test. If you add a component, it
has to cover all five.

**Storage is time series, not daily snapshots.** One row per metric per sample
in `wristkit_samples`. `user_id` exists but is nullable and unused in v1, so
multi user can land later without a schema break.

**Metrics in v1** are `kcal`, `exercise_minutes` and `steps`.

**Ingest payload.** The Shortcut posts a flat object and the handler expands it
into one row per metric:

```json
{ "steps": 12340, "moveKcal": 544, "exerciseMin": 80 }
```

The handler checks `x-api-key` with a timing safe compare, limits body size,
and rate limits by IP. Do not weaken those checks.

**Env vars** live only in the user's project, never in ours:

| Variable | Purpose |
| --- | --- |
| `WRISTKIT_DATABASE_URL` | Supabase transaction pooler connection string |
| `WRISTKIT_API_KEY` | secret the Shortcut sends in `x-api-key` |

The site itself needs no env vars.

## Naming

| Thing | Convention | Example |
| --- | --- | --- |
| registry items | kebab-case | `today-activity-card` |
| files | kebab-case | `today-activity-card.tsx` |
| React components | PascalCase | `TodayActivityCard` |
| env vars | `WRISTKIT_` prefix, upper snake | `WRISTKIT_API_KEY` |
| database tables | `wristkit_` prefix, snake_case | `wristkit_samples` |
| database columns | snake_case | `recorded_at` |
| TypeScript identifiers | camelCase | `recordedAt` |
| commits | Conventional Commits | `feat(web): add theme switcher` |
| branches | `type/short-desc` | `feat/today-card` |

Husky runs lint-staged on commit and commitlint on the message, so a commit
that is not a Conventional Commit gets rejected.