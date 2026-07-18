# wristkit

**Apple Health data on your website — in minutes.**

![wristkit hero](./assets/hero.png)

A set of copy-paste React components for showing Apple Health data in any Next.js project. You bring your own Supabase. Zero telemetry. MIT.

## What it does

- Copy the component files into your project
- Run a SQL migration in Supabase
- Import the iOS Shortcut on your iPhone, set your URL and API key, done
- Your Apple Watch rings show up on your site, live, from your own database — we never see your data

## Quick start

**1. Install the peer dependencies**

```bash
pnpm add drizzle-orm postgres zod
```

**2. Add your environment variables**

```
WRISTKIT_DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
WRISTKIT_API_KEY=replace-with-32-random-bytes
```

Use the **Transaction pooler** URL from Supabase (Project Settings → Database → Connect). The direct connection does not work on Vercel.

Generate an API key:

```bash
node -e 'console.log(require("crypto").randomBytes(32).toString("base64url"))'
```

**3. Run the SQL migration in Supabase**

Go to the [Installation docs](https://wristkit-web.vercel.app/docs/installation) and copy the two SQL blocks into the Supabase SQL Editor.

**4. Copy the component files**

Go to the [Installation docs](https://wristkit-web.vercel.app/docs/installation) and copy the route handler and component files into your project.

**5. Use it in a Server Component**

```tsx
import { TodayActivityCard, loadTodayActivity } from "@/components/wristkit/today-activity-card"

export default async function Dashboard() {
  const state = await loadTodayActivity()
  return <TodayActivityCard state={state} />
}
```

**6. Set up the iOS Shortcut**

Download it from [wristkit-web.vercel.app/shortcut](https://wristkit-web.vercel.app/shortcut), open it in the Shortcuts app, and fill in your site URL and API key.

## Requirements

- Next.js 15+ (App Router)
- A [Supabase](https://supabase.com) project (free tier works)
- Node.js 20+

## Documentation

Full docs at **[wristkit-web.vercel.app/docs](https://wristkit-web.vercel.app/docs)**

- [Installation](https://wristkit-web.vercel.app/docs/installation)
- [iOS Shortcut setup](https://wristkit-web.vercel.app/docs/shortcut-setup)
- [TodayActivityCard](https://wristkit-web.vercel.app/docs/components/today-activity-card)
- [Component states](https://wristkit-web.vercel.app/docs/concepts/component-states)

## Privacy

Your data goes straight from your iPhone to your Supabase. We never see it, store it, or have any access to it. No analytics. No server-side logging. No third-party cloud.

## Development

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## License

MIT — see [LICENSE](./LICENSE)
