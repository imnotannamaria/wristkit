import { TodayActivityCardDemo } from "@/components/cards/today-activity-card-demo";
import { Badge } from "@/components/entrepta/badge";
import { buttonVariants } from "@/components/entrepta/button-variants";
import {
  Card,
  CardComment,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTitle,
} from "@/components/entrepta/card";
import { TopNav, TopNavLink, TopNavMenu } from "@/components/entrepta/top-nav";
import { HeroIdePreview } from "@/components/home/hero-ide-preview";
import { WristKitMark } from "@/components/mark";
import { SkipLink } from "@/components/skip-link";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <HomeTopNav />
      <main
        id="main-content"
        tabIndex={-1}
        className="page"
        style={{ paddingTop: 88, paddingBottom: 96 }}
      >
        <HeroSection />
        <ComponentShowcase />
        <PackagesSection />
        <InstallSection />
        <CtaStrip />
      </main>
      <SiteFooter />
    </>
  );
}

// ─── TopNav ───────────────────────────────────────────────────
function HomeTopNav() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "rgba(9, 9, 11, 0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <TopNav
          style={{
            background: "transparent",
            borderBottom: "none",
            paddingTop: 12,
            paddingBottom: 12,
          }}
          left={
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <WristKitMark size={22} />
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 18,
                  color: "var(--fg-primary)",
                  lineHeight: 1,
                }}
              >
                wristkit
                <span style={{ color: "var(--fg-brand)" }}>.</span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--fg-muted)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 3,
                  padding: "2px 6px",
                  marginLeft: 6,
                }}
              >
                v0.1
              </span>
            </Link>
          }
          right={
            <>
              <TopNavMenu aria-label="Main">
                <TopNavLink active asChild>
                  <Link href="/">home</Link>
                </TopNavLink>
                <TopNavLink asChild>
                  <Link href="/docs">docs</Link>
                </TopNavLink>
                <TopNavLink asChild>
                  <Link href="/docs/shortcut-setup">shortcut</Link>
                </TopNavLink>
                <TopNavLink asChild>
                  <Link href="/docs/components/today-activity-card">components</Link>
                </TopNavLink>
                <TopNavLink href="https://github.com/imnotannamaria/wristkit" external>
                  github
                </TopNavLink>
              </TopNavMenu>
              <MobileNav />
            </>
          }
        />
      </div>
    </header>
  );
}

// ─── Mobile nav ───────────────────────────────────────────────
const MOBILE_LINKS = [
  { label: "home", href: "/", active: true },
  { label: "docs", href: "/docs" },
  { label: "shortcut", href: "/docs/shortcut-setup" },
  { label: "components", href: "/docs/components/today-activity-card" },
];

function MobileNav() {
  return (
    <details className="relative md:hidden">
      <summary
        aria-label="Toggle navigation menu"
        className="inline-flex size-9 cursor-pointer list-none items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-subtle)] text-[var(--fg-secondary)] [&::-webkit-details-marker]:hidden"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
          role="presentation"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </summary>
      <nav
        aria-label="Mobile"
        className="absolute right-0 top-[calc(100%+12px)] z-50 flex min-w-44 flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 font-mono text-[13px] uppercase tracking-[0.06em] shadow-lg"
      >
        {MOBILE_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-[var(--radius-sm)] px-3 py-2 text-[var(--fg-secondary)] hover:bg-[var(--bg-chrome)] hover:text-[var(--fg-primary)]",
              l.active && "text-[var(--fg-primary)]",
            )}
          >
            {l.label}
          </Link>
        ))}
        <a
          href="https://github.com/imnotannamaria/wristkit"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[var(--radius-sm)] px-3 py-2 text-[var(--fg-secondary)] hover:bg-[var(--bg-chrome)] hover:text-[var(--fg-primary)]"
        >
          github ↗
        </a>
      </nav>
    </details>
  );
}

// ─── Hero ─────────────────────────────────────────────────────
function HeroSection() {
  const stats = [
    { dt: "package", dd: "1" },
    { dt: "registry items", dd: "4" },
    { dt: "telemetry", dd: "zero" },
    { dt: "license", dd: "MIT" },
  ];
  return (
    <section
      className="container grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]"
      style={{
        paddingTop: 80,
        paddingBottom: 64,
        gap: 56,
        alignItems: "start",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg-muted)",
            marginBottom: 24,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          <span>open source · MIT</span>
          <span
            style={{
              border: "1px solid var(--border-subtle)",
              borderRadius: 3,
              padding: "2px 6px",
              color: "var(--fg-brand)",
              textTransform: "none",
              letterSpacing: "normal",
            }}
          >
            v0.1
          </span>
          <span>by anna maria</span>
        </div>
        <h1 className="t-display-xl" style={{ margin: 0 }}>
          Apple Health,
          <br />
          on <em className="t-italic">your</em> <span className="t-muted">web stack.</span>
        </h1>
        <p
          className="t-body-lg t-secondary"
          style={{ marginTop: 28, maxWidth: 540, lineHeight: 1.65 }}
        >
          <strong style={{ color: "var(--fg-primary)", fontWeight: 500 }}>wristkit</strong> is a
          small set of React components for your Next.js project, so you can show your Apple Health
          data on the web. Copy the files from the docs, point them at your own Supabase, and the
          iOS Shortcut posts straight to your endpoint. No third party cloud, no SDK in the middle.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 32,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/docs/components/today-activity-card"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            browse the components →
          </Link>
          <Link href="/docs" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            read the docs
          </Link>
        </div>
        <dl
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{
            gap: 12,
            margin: 0,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.dt}
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                padding: 12,
              }}
            >
              <dt
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--fg-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                {s.dt}
              </dt>
              <dd
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  color: "var(--fg-primary)",
                  margin: 0,
                }}
              >
                {s.dd}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <HeroIdePreview />
    </section>
  );
}

// ─── Component showcase ──────────────────────────────────────
function ComponentShowcase() {
  return (
    <section className="container bt-subtle" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div
        className="flex flex-col md:flex-row md:items-end md:justify-between"
        style={{
          marginBottom: 40,
          gap: 24,
        }}
      >
        <div>
          <div
            className="t-mono-xs t-brand"
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            · components/wristkit
          </div>
          <h2
            className="t-display-md"
            style={{ margin: 0, fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.05 }}
          >
            One <em className="t-italic">card</em>.
            <br />
            <span className="t-muted">Your day, at a glance.</span>
          </h2>
        </div>
        <span
          className="t-mono-xs t-muted"
          style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          section 2.1 · components
        </span>
      </div>
      <TodayActivityCardDemo />
    </section>
  );
}

// ─── Packages (registry items) ───────────────────────────────
const REGISTRY_ITEMS = [
  {
    label: "components/wristkit",
    num: "01",
    title: "TodayActivityCard",
    desc: "A React Server Component with all 5 states (loading, empty, stale, error, ok). Copy it into any /app page.",
    tag: "<TodayActivityCard state={state} />",
    href: "/docs/components/today-activity-card",
  },
  {
    label: "app/api/wristkit-sync",
    num: "02",
    title: "Route handler",
    desc: "A POST endpoint that checks the x-api-key, parses the Shortcut payload with Zod and writes to your Supabase through Drizzle.",
    tag: "export async function POST(req)",
    href: "/docs/installation",
  },
  {
    label: "shortcuts/wristkit",
    num: "03",
    title: "iOS Shortcut",
    desc: "Reads Active Energy, Exercise Minutes and Steps from HealthKit. You can schedule it to run every day at 23:59 with iOS Automation.",
    tag: "wristkit-sync.shortcut",
    href: "/docs/shortcut-setup",
  },
];

function PackagesSection() {
  return (
    <section className="container bt-subtle" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div
        className="flex flex-col md:flex-row md:items-end md:justify-between"
        style={{
          marginBottom: 40,
          gap: 24,
        }}
      >
        <h2
          className="t-display-md"
          style={{ margin: 0, fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.05 }}
        >
          <em className="t-italic">Three</em> pieces. <span className="t-muted">One evening.</span>
        </h2>
        <Link
          href="/docs"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--fg-brand)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          browse all ↗
        </Link>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{
          gap: 16,
        }}
      >
        {REGISTRY_ITEMS.map((p) => (
          <Link
            key={p.num}
            href={p.href}
            style={{ display: "block", color: "inherit", textDecoration: "none" }}
          >
            <Card>
              <CardHeader>
                <CardLabel>{p.label}</CardLabel>
                <CardMeta>{p.num}</CardMeta>
              </CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "var(--fg-secondary)",
                  margin: 0,
                }}
              >
                {p.desc}
              </p>
              <CardFooter>
                <CardComment>{p.tag}</CardComment>
                <span style={{ color: "var(--fg-brand)" }}>→</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Install ────────────────────────────────────────────────
const INSTALL_STEPS = [
  {
    n: "01",
    cmd: "copy → components/wristkit/today-activity-card",
    out: "card, states, load and queries",
  },
  {
    n: "02",
    cmd: "copy → app/api/wristkit-sync/route.ts",
    out: "ingest handler · zod + drizzle",
  },
  {
    n: "03",
    cmd: "psql -f schemas/0001_initial.sql",
    out: "supabase sql editor",
  },
  {
    n: "04",
    cmd: "open wristkit-web.vercel.app/shortcut",
    out: null,
  },
];

const ENV_VARS = [
  { k: "WRISTKIT_DATABASE_URL", v: "set" },
  { k: "WRISTKIT_API_KEY", v: "set" },
];

function InstallSection() {
  return (
    <section className="container bt-subtle" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ marginBottom: 40 }}>
        <div
          className="t-mono-xs t-brand"
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}
        >
          · getting started
        </div>
        <h2
          className="t-display-md"
          style={{ margin: "0 0 16px", fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.05 }}
        >
          <em className="t-italic">Four</em> files.
          <br />
          <span className="t-muted">You own the pipeline.</span>
        </h2>
        <p className="t-body-md t-secondary" style={{ maxWidth: 540, lineHeight: 1.65, margin: 0 }}>
          Copy the component into your project, paste the route handler, run the SQL on Supabase and
          install the Apple Shortcut. Snapshots land in your database and your React renders them.
        </p>
      </div>
      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]"
        style={{
          gap: 24,
        }}
      >
        <div
          style={{
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 16px",
              borderBottom: "1px solid var(--border-subtle)",
              background: "var(--bg-chrome)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--fg-secondary)",
            }}
          >
            <div aria-hidden style={{ display: "flex", gap: 6 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--status-error)",
                  opacity: 0.6,
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--status-warning)",
                  opacity: 0.6,
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--status-success)",
                  opacity: 0.6,
                }}
              />
            </div>
            <span style={{ color: "var(--fg-muted)" }}>terminal · zsh</span>
            <span style={{ marginLeft: "auto", color: "var(--fg-muted)" }}>~/your-portfolio</span>
            <span
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--fg-brand)",
                fontSize: 10,
              }}
            >
              bash
            </span>
          </div>
          <div
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {INSTALL_STEPS.map((s) => (
              <div key={s.n} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "var(--fg-muted)", fontSize: 11, width: 20 }}>{s.n}</span>
                  <span style={{ color: "var(--fg-secondary)" }}>
                    <span style={{ color: "var(--fg-brand)" }}>$</span> {s.cmd}
                  </span>
                </div>
                {s.out && (
                  <div
                    style={{
                      paddingLeft: 32,
                      fontSize: 11,
                      color: "var(--fg-muted)",
                    }}
                  >
                    → {s.out}
                  </div>
                )}
              </div>
            ))}
            <div
              style={{
                paddingLeft: 32,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--status-success)",
                }}
              />
              <span style={{ color: "var(--status-success-fg)" }}>synced</span>
              <span style={{ color: "var(--fg-muted)" }}>
                {"// first snapshot arrived 21:14:08"}
              </span>
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardLabel>environment</CardLabel>
            <Badge variant="soft" color="success" dot>
              {ENV_VARS.length} / {ENV_VARS.length}
            </Badge>
          </CardHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ENV_VARS.map((e, i) => (
              <div
                key={e.k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  paddingTop: i ? 12 : 0,
                  borderTop: i ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                <span style={{ color: "var(--fg-secondary)" }}>{e.k}</span>
                <span
                  style={{
                    color: "var(--status-success-fg)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--status-success)",
                    }}
                  />
                  {e.v}
                </span>
              </div>
            ))}
          </div>
          <CardFooter>
            <CardComment>loaded from .env.local</CardComment>
            <Link href="/docs/installation" style={{ color: "var(--fg-brand)" }}>
              docs ↗
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────
function CtaStrip() {
  return (
    <section className="container bt-subtle" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div
        className="px-6 py-12 md:px-12 md:py-16"
        style={{
          position: "relative",
          textAlign: "center",
          background: "radial-gradient(ellipse at top, var(--bg-surface-brand), transparent 60%)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        <div
          className="t-mono-xs t-brand"
          style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          · own your data
        </div>
        <h2 className="t-display-lg" style={{ margin: "24px 0", fontWeight: 400 }}>
          Start <em className="t-italic">shipping.</em>
        </h2>
        <p
          className="t-body-md t-secondary"
          style={{ maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.65 }}
        >
          Your iPhone is already counting. Pipe it into your portfolio in one evening. Zero
          telemetry, your own Supabase and MIT.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/docs/components/today-activity-card"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            browse the components →
          </Link>
          <Link href="/docs" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            read the docs
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────
const FOOTER_GROUPS = [
  {
    title: "Registry",
    items: [
      { label: "TodayActivityCard", href: "/docs/components/today-activity-card" },
      { label: "Route handler", href: "/docs/installation" },
      { label: "iOS Shortcut", href: "/docs/shortcut-setup" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "GitHub ↗", href: "https://github.com/imnotannamaria/wristkit", external: true },
      { label: "Docs", href: "/docs" },
    ],
  },
  {
    title: "Author",
    items: [
      { label: "Anna Maria", href: "https://github.com/imnotannamaria", external: true },
      { label: "annamaria.app ↗", href: "https://annamaria.app", external: true },
      {
        label: "MIT",
        href: "https://github.com/imnotannamaria/wristkit/blob/main/LICENSE",
        external: true,
      },
    ],
  },
];

function SiteFooter() {
  return (
    <footer className="bt-subtle" style={{ marginTop: 64, paddingBottom: 64 }}>
      <div
        className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]"
        style={{
          paddingTop: 64,
          gap: 48,
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <WristKitMark size={22} />
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 18,
                color: "var(--fg-primary)",
              }}
            >
              wristkit<span style={{ color: "var(--fg-brand)" }}>.</span>
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--fg-muted)",
              maxWidth: 320,
              lineHeight: 1.6,
              marginTop: 16,
            }}
          >
            A small set of copy-paste React components for piping Apple Health into the web. Open
            source, MIT and zero telemetry. You bring the Supabase.
          </p>
        </div>
        {FOOTER_GROUPS.map((group) => (
          <div key={group.title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--fg-muted)",
                margin: 0,
              }}
            >
              {group.title}
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {group.items.map((item) => {
                const cleanLabel = item.label.replace(/\s*↗\s*$/, "");
                return (
                  <li key={item.label}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--fg-secondary)",
                        }}
                      >
                        {cleanLabel}
                        <span aria-hidden> ↗</span>
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--fg-secondary)",
                        }}
                      >
                        {cleanLabel}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div
        className="container"
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--fg-muted)",
        }}
      >
        <span>v0.1.0 · 2026</span>
        <span>built with entrepta · ivy</span>
      </div>
    </footer>
  );
}
