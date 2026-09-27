# wristkit

An open source Activity Card that puts Apple Health data on a Next.js site.
Copy-paste files, the user's own Supabase, an iOS Shortcut. No npm package, no hosted service, no telemetry.
The site runs on Next.js 15 and entrepta 2.0. Dark first.

For what wristkit does, how to install it and how to run the repo, see [README.md](README.md). This
file covers the conventions to follow when writing code here.

Keep `AGENTS.md` and `CLAUDE.md` identical when updating these instructions.

---

## What wristkit is

People copy the files from the docs site into their own Next.js project, run two SQL migrations in
their own Supabase, and import an iOS Shortcut on their iPhone.

Data flow: the Shortcut posts JSON to the user's own `/api/wristkit-sync` route, that route writes
rows to the user's own Supabase, and a Server Component reads those rows and renders the card. We
never receive user data. The site has no analytics either, on purpose: it promises no telemetry,
so don't add any.

`docs/v2/` holds local planning notes and is gitignored. If it exists on your machine, read its
README before a large change, and don't start work it describes as future unless asked. The README,
the docs and this file describe the kit as it ships today.

---

## Commands

Run all four before every commit:

```bash
pnpm lint        # Biome, at the repo root
pnpm typecheck
pnpm test        # Vitest (registry) + Playwright (site)
pnpm build
```

`typecheck`, `test` and `build` go through Turbo and run in every workspace. Others:

```bash
pnpm dev                                  # the site, through Turbo
pnpm format                               # biome format --write
pnpm --filter @wristkit/web test:e2e      # Playwright only
pnpm --filter @wristkit/registry test     # Vitest only
```

Husky runs `pnpm test` before a commit and commitlint on the message.

**Playwright tests whatever answers on port 3000.** `playwright.config.ts` reuses an existing
server outside CI, so if another local app holds 3000, the suite runs against the wrong site and
fails in ways that point nowhere near the change.
Start wristkit on a free port and export `PLAYWRIGHT_BASE_URL=http://localhost:3001` for tests and
for commits, since the pre-commit hook runs the same suite.

---

## Stack

| Layer            | Tech                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| Monorepo         | pnpm 9 workspaces + Turborepo, Node 20                                |
| Framework        | Next.js 15 (App Router), React 19                                     |
| Language         | TypeScript, strict                                                    |
| Styling          | Tailwind CSS v4 + entrepta tokens                                     |
| Design system    | entrepta 2.0, copied in by its CLI, no SDK, dark first                |
| Content          | MDX via Velite                                                        |
| Syntax highlight | Shiki + rehype-pretty-code                                            |
| Animation        | Motion, site only, never in the registry                              |
| Icons            | Phosphor (`@phosphor-icons/react`)                                    |
| Themes           | entrepta `ThemeSwitcher` + `ThemeScript`, six presets, dark and light |
| Fonts            | Newsreader, JetBrains Mono, Inter, self hosted through `next/font`    |
| OG image         | a static PNG, `apps/web/app/opengraph-image.png`                      |
| Registry data    | Drizzle ORM + postgres.js + zod, against the user's Supabase          |
| Lint and format  | Biome                                                                 |
| Tests            | Vitest + Testing Library (registry), Playwright (site)                |
| Commits          | Husky, commitlint, Conventional Commits                               |
| Deploy           | Vercel                                                                |

---

## Repo layout

```
apps/web/                    the public site
  app/
    (marketing)/page.tsx     home: hero, feature strip, the card, how it works
    docs/                    docs layout and the [[...slug]] route
    shortcut/route.ts        serves the .shortcut file, force-static
    globals.css              entrepta's part on top, the site's CSS below
    layout.tsx               fonts, metadata, ThemeScript, the <noscript> fallback
    not-found.tsx            the 404, built on entrepta's ChromeMessage
    opengraph-image.png      the share image, also the README's hero
  content/docs/              MDX docs, compiled by Velite
  components/
    entrepta/                entrepta's components, written by its CLI
    home/                    hero preview, activity preview
    docs/                    sidebar, next steps, file bundles, screenshots
    cards/                   demo wrappers around the registry's states
    mdx-content.tsx          the MDX component map
  hooks/                     entrepta's: use-theme, use-mode
  lib/
    registry-files.ts        reads registry files so the docs show real code
    themes.ts                the six swatches for the ThemeSwitcher
    utils.ts motion.ts icon.tsx overlay.ts    entrepta's
  tests/e2e/                 Playwright

packages/registry/           the source of truth for everything users copy
  components/today-activity-card/
  handlers/wristkit-sync-handler/
  lib/                       db, schema, queries, validation
  schemas/                   SQL migrations
  shortcuts/                 the .shortcut binary
  tests/                     Vitest: every card state and the handler

packages/tokens/             a placeholder, nothing reads it yet
```

---

## The registry

**`packages/registry` is the source of truth.** The docs site keeps no copy of the component or
handler code. `apps/web/lib/registry-files.ts` reads the real files from disk at build time, and
`app/docs/[[...slug]]/page.tsx` renders them as file bundles under the installation and card pages.
Change a registry file and the docs update by themselves. Never paste registry code into MDX by
hand: a copy drifts from the file it describes.

Adding a file the user must copy means three edits: the file itself, its entry in
`registry-files.ts` (source, destination, language, and a `transform` if its imports change), and
its entry in the item's `meta.json`. The destinations in the last two must agree.

**The component never fetches.** `index.tsx` is a pure renderer that takes a `state` prop.
`load.ts` does the database work on the server and returns the state. Keep that split.

**Five states, always.** `TodayState` is `loading`, `empty`, `error`, `stale` and `ok`. Every state
has a real design and a test, and the layout doesn't jump between them. A new component covers all
five. `stale` means the freshest sample is more than 24 hours old; `empty` means there is none.

**The error state never echoes the error.** The loader keeps the message, the card shows generic
copy. A database message on a public page tells a stranger about the user's auth and schema. The
component test asserts it.

**The card is portable.** `states.tsx` imports React types, `./load` and `./styles.css`, nothing
else. No entrepta, no Motion, no Tailwind classes, no `@/` alias: users paste it into projects that
have none of those. Its styles are the `wk-*` classes in `styles.css`, and every token it reads
carries a fallback, `var(--fg-brand, #7c6bff)`, so it follows entrepta's theme when present and
still looks right without it. That is why the card's numbers don't animate with Motion.

**Storage is time series, not daily snapshots.** One row per metric per sample in
`wristkit_samples`. `user_id` exists but is nullable and unused in v1, so multi user can land later
without a schema break. **Metrics in v1** are `kcal`, `exercise_minutes` and `steps`.

**Ingest payload.** The Shortcut posts a flat object and the handler expands it into one row per
metric:

```json
{ "steps": 12340, "moveKcal": 544, "exerciseMin": 80 }
```

The handler checks `x-api-key` with `timingSafeEqual`, rejects bodies over 256 KB, rejects unknown
keys and non-JSON bodies, and allows 30 requests per IP per 5 minutes. Do not weaken those checks.

**Env vars** live only in the user's project, never in ours:

| Variable                | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `WRISTKIT_DATABASE_URL` | Supabase transaction pooler connection string |
| `WRISTKIT_API_KEY`      | secret the Shortcut sends in `x-api-key`      |

The site itself needs no env vars. Its previews use sample data from
`components/cards/today-activity-card-demo.tsx`.

---

## Design system: entrepta

The site runs on [entrepta](https://entrepta.vercel.app) 2.0, installed with `@entrepta/cli@2.0.0`
with `apps/web/entrepta.json` (all themes, entrepta as the default). It is not a runtime
dependency: the CLI copies source in, and these places are entrepta's rather than the site's:

- `apps/web/components/entrepta/`
- `apps/web/app/globals.css`, from the top down to the `/* Wristkit: application layout and theme
  swatches. */` comment: the type scale, primitives, semantic tokens, the reset, the animations and
  the six themes
- `apps/web/lib/utils.ts` (`cn()`), `lib/motion.ts`, `lib/icon.tsx`, `lib/overlay.ts` and the hooks
  in `apps/web/hooks/`

A change to any of them belongs in entrepta, then comes back with
`npx @entrepta/cli@latest add <name> --overwrite`, run from `apps/web`. Commit before it and read
the diff after. A local edit is lost on the next overwrite. What only wristkit knows stays out of
those files: its CSS lives below the comment in `globals.css`, its swatches in `lib/themes.ts`.

Some entrepta files carry local edits today: `reveal.tsx` (the `data-reveal` attribute),
`theme-switcher.tsx` (focus moves into the panel and back to the trigger) and `tabs.tsx`
(`overflow-hidden` on the row). Before overwriting any of them, check whether entrepta has the
change. If it doesn't, send it upstream first or reapply it after.

Only the components the site uses are installed. Add one with
`npx @entrepta/cli@latest add <name>` when a page needs it, and delete it when nothing imports it
anymore.

**Never run `entrepta init --overwrite` here.** It rewrites `globals.css` whole, which also holds
the site's ~640 lines of CSS, and brings a Google Fonts `@import` that fights `next/font`. The
fonts are loaded once, in `app/layout.tsx`.

The upstream docs are written for agents: [llms.txt](https://entrepta.vercel.app/llms.txt),
[llms-full.txt](https://entrepta.vercel.app/llms-full.txt) and the
[v2 migration guide](https://entrepta.vercel.app/docs/migrating-to-v2.md). This repo's paths win
over their generic examples.

### Tokens

Primitives (zinc, violet, emerald, amber and friends) feed semantic tokens on `:root`:

```css
--bg-canvas: var(--zinc-950); /* the page */
--bg-card: #0b0b0e; /* cards: a hair above the canvas, defined by the border */
--bg-overlay: #0e0e10; /* menus, tooltips, code, dialogs */
--bg-surface: var(--zinc-900); /* small fills only, never an area */
--fg-primary: var(--zinc-50);
--fg-secondary: var(--zinc-400);
--fg-muted: #8a8a92; /* zinc-500 is ~4.1:1 on the canvas, below AA */
--fg-brand: var(--violet-500); /* overridden per theme */
--border-subtle: var(--zinc-800);
--border-strong: var(--zinc-700);
```

Brand accents (`--border-brand`, `--shadow-brand`, `--fg-brand-glow`, `--bg-spotlight`) are
`color-mix()` against `--fg-brand`, so they follow the active theme. Never hardcode a brand hex;
derive it from `--fg-brand`. No fixed purple.

Two inks come with every theme, because neither can be derived from the brand:

- `--fg-on-brand` for text on a `--fg-brand` fill (the primary button, a solid badge)
- `--fg-brand-text` for brand-colored text below 24px on the canvas, a card or the brand tint

`--fg-brand` as small text fails AA in some theme and mode pairs. It stays for fills, borders,
glyphs and text 24px and up, like the italic word in a serif headline. This is why the MDX links,
`em` and inline code moved from `--fg-brand` to `--fg-brand-text`.

The card's rings map to tokens in the site's part of `globals.css`: `--ring-move` is the brand,
`--ring-exercise` is `--status-success`, `--ring-steps` is `--status-warning`. So the move ring
changes with the theme and the other two don't.

### Themes

Only the brand changes between themes: `--fg-brand`, `--fg-brand-hover`, the two inks, the tint
and the focus ring. `data-theme` on `<html>` picks the theme and `data-mode="light"` the mode.
`ThemeScript` in `<head>` sets both before paint from the `wristkit` storage key, so there is no
flash. That is also why `<html>` has `suppressHydrationWarning`.

| Theme              | Dark      | Light     |
| ------------------ | --------- | --------- |
| entrepta (default) | `#7c6bff` | `#6656ff` |
| blossom            | `#cc2e36` | `#b02028` |
| marmalade          | `#ff8213` | `#e06800` |
| julia              | `#e85a8a` | `#cc3a6a` |
| ivy                | `#35a365` | `#258a50` |
| bosco              | `#2563eb` | `#1d4ed8` |

The swatches in `lib/themes.ts` read `--theme-*` variables, so color values stay in the stylesheet.
Every UI change gets checked in all six, in both modes. The e2e suite does that at 375px.

### Typography

| Role           | Font                         | Use                                             |
| -------------- | ---------------------------- | ----------------------------------------------- |
| Display        | Newsreader (serif)           | Headlines, section titles, the card's numbers   |
| UI default     | JetBrains Mono               | Labels, nav, badges, metadata, eyebrows         |
| Prose          | Inter                        | Hero description, feature text, docs paragraphs |

Mono is the body default (`body { font-family: var(--font-mono) }`). Sans only shows up in running
text.

Every size comes from `@theme static` at the top of `globals.css`. Ten steps, no eleventh:

| Token             | Size / leading | Role                                         |
| ----------------- | -------------- | -------------------------------------------- |
| `text-display-xl` | 80 / 0.95      | The hero headline at wide screens, serif     |
| `text-display-lg` | 64 / 1         | The hero headline, section headlines         |
| `text-display-md` | 40 / 1.1       | Narrow-screen headlines, docs h1             |
| `text-heading-lg` | 24 / 1.3       | Feature titles, MDX h2                       |
| `text-heading-md` | 18 / 1.4       | Smaller headings                             |
| `text-body-lg`    | 16 / 1.6       | Prose: docs paragraphs, lists, intros        |
| `text-body-md`    | 14 / 1.5       | Secondary prose, captions                    |
| `text-mono-md`    | 14 / 1.5       | Mono body, code                              |
| `text-mono-sm`    | 12 / 1.4       | The default UI label                         |
| `text-mono-xs`    | 10 / 1.3       | The smallest label, table heads, h4 eyebrows |

- **A token sets size and leading, never family.** `font-serif`, `font-sans` or `font-mono` stays at
  the call site.
- **No `text-[Npx]` and no Tailwind default steps** (`text-xs`, `text-sm`). Two spellings for one
  size is the ambiguity the scale removes. In inline styles, use `var(--text-mono-sm)`, as
  `mdx-content.tsx` does.
- **A new step goes in entrepta, registered in `TYPE_SCALE` in `lib/utils.ts`.** tailwind-merge
  can't tell `text-mono-sm` is a font size; unregistered, it gets filed as a text color and
  silently deleted by any color class in the same `cn()`.

---

## Visual identity

Editorial, not dashboard. A serif headline with one italic word in the brand ("personality."), a
mono eyebrow with a live dot, a short Inter paragraph, and the Activity Card as the object the page
is about, set in an orbit ring. Warm, personal copy that talks to the reader: "Make yourself at
home", "a good day, in a small card". The product is in English.

- The card is the protagonist. Decoration never competes with the numbers, the instructions or the
  primary action.
- Surfaces are separated by borders, not by fills. Glow and color come from the theme.
- Recurring marks: `◆` on the active docs link, the live dot, `↳` for a signature line, `01 /`
  numbering on labels and section heads.

---

## Motion and accessibility

- Entrances use `Reveal` (`whileInView`, once, a quarter visible, per `lib/motion.ts`). The hero
  title uses `TypeIn`. `Spotlight` is for the preview card, not everywhere. Past six items a
  stagger reads as lag, so `STAGGER_LIMIT` stops it there.
- JavaScript animations check `useReducedMotion()` and drop both movement and delays. CSS
  animations fall under the reduced-motion reset in `globals.css`.
- Text and values stay real in the DOM. Animated copies and decorative glyphs are `aria-hidden`.
- Every page has a skip link to its `<main>`, and the docs sidebar closes after navigating on mobile.

---

## The OG image

`apps/web/app/opengraph-image.png` is a static 2400×1260 PNG with its alt text in
`opengraph-image.alt.txt`. The Next file convention turns it into `og:image` for every route, and
the README shows the same file at the top, so there is one image to keep current.

A page that sets its own `openGraph` replaces the root one whole, image included. The docs route
carries it over with `images: (await parent).openGraph?.images` in `generateMetadata`; a new route
with its own `openGraph` does the same, or it shares without a picture.

It was composed on top of the live home page, with the real fonts, tokens and Activity Card, and
screenshotted at 2x. Redo it when the hero or the card changes enough that the preview lies. Don't
add `openGraph.images` back to `layout.tsx`: the file wins anyway, and a hardcoded URL goes stale.

---

## Writing new UI: things that broke once

- **A CSS `transform` on an SVG element replaces its `transform` attribute.** The loading arc sat at
  `transform="rotate(-90 100 100)"` and spun with a CSS `rotate()` keyframe. The keyframe threw the
  -90° away and the arc left its track. Animate `stroke-dashoffset` instead. The e2e test "loading
  arcs stay on their tracks" samples the animation to hold that.
- **Entrances start invisible.** `Reveal` and `TypeIn` begin at opacity 0, so without JavaScript
  the home page was blank. The `<noscript>` style in `app/layout.tsx` forces `[data-reveal]` and
  `[data-type-in] > span` visible. A new entrance component carries one of those attributes or adds
  its selector there. The e2e test loads the home with JavaScript off.
- **Radix renders only the active tab.** The installation page showed one file per bundle without
  JavaScript. The file bundles use `forceMount` with `data-[state=inactive]:hidden`, and the same
  `<noscript>` style shows every panel and the mobile docs nav. Content people need to read goes in
  the server HTML, not behind a tab.
- **A zero-length dash with round caps is a dot.** An empty ring drew a colored dot at 12 o'clock.
  The card renders no value arc when progress is zero, and a Vitest test holds that.
- **`cn()` only knows what's registered.** See the type scale above: a custom `@theme` class next
  to a color class can vanish from the merge with no error.
- **Text on a brand fill is `--fg-on-brand`, small brand text is `--fg-brand-text`.** A fixed white
  or black fails AA in some of the twelve theme and mode pairs.
- **Phosphor icons in server files come from `@phosphor-icons/react/dist/ssr`.** The default
  entry is client only.
- **Tailwind scans the registry.** `globals.css` has an `@source` for
  `packages/registry/components`, so the demos can style around the card. The card itself still
  uses only its `wk-*` classes.

---

## Naming

| Thing                  | Convention                      | Example                         |
| ---------------------- | ------------------------------- | ------------------------------- |
| registry items         | kebab-case                      | `today-activity-card`           |
| files                  | kebab-case                      | `today-activity-card.tsx`       |
| React components       | PascalCase                      | `TodayActivityCard`             |
| env vars               | `WRISTKIT_` prefix, upper snake | `WRISTKIT_API_KEY`              |
| database tables        | `wristkit_` prefix, snake_case  | `wristkit_samples`              |
| database columns       | snake_case                      | `recorded_at`                   |
| TypeScript identifiers | camelCase                       | `recordedAt`                    |
| commits                | Conventional Commits            | `feat(web): add theme switcher` |
| branches               | `type/short-desc`               | `feat/today-card`               |
