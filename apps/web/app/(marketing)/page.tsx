import {
  EnvCard,
  InstallCard,
  TodayActivityCardDemo,
  TodayActivityCardEmpty,
  TodayActivityCardError,
  TodayActivityCardLoading,
  TodayActivityCardPartial,
  TodayActivityCardStale,
} from "@/components/cards/today-activity-card-demo";
import { Button } from "@/components/entrepta/button";
import { buttonVariants } from "@/components/entrepta/button-variants";
import { StatusBar, StatusBarItem, StatusBarSeparator } from "@/components/entrepta/status-bar";
import {
  TopNav,
  TopNavBreadcrumb,
  TopNavLink,
  TopNavLogo,
  TopNavLogoMark,
  TopNavMenu,
  TopNavSeparator,
} from "@/components/entrepta/top-nav";
import { HomeInstallBlock } from "@/components/home-install-block";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <TopNav
        left={
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <TopNavLogo>
              <TopNavLogoMark>w</TopNavLogoMark>
              <span>wristkit</span>
            </TopNavLogo>
            <TopNavBreadcrumb>
              <TopNavSeparator />
              <span className="here">home</span>
            </TopNavBreadcrumb>
          </Link>
        }
        right={
          <TopNavMenu>
            <TopNavLink active asChild>
              <Link href="/">home</Link>
            </TopNavLink>
            <TopNavLink asChild>
              <Link href="/docs">docs</Link>
            </TopNavLink>
            <TopNavLink href="https://github.com/imnotannamaria/wristkit" external>
              github
            </TopNavLink>
            <TopNavLink href="https://www.npmjs.com/package/wristkit" external>
              npm
            </TopNavLink>
          </TopNavMenu>
        }
      />

      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "56px 56px 96px",
          boxSizing: "border-box",
        }}
      >
        {/* ─── Hero ─── */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
            gap: 48,
            alignItems: "end",
            marginBottom: 80,
          }}
        >
          <div>
            <div
              className="t-mono-xs t-brand"
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 18,
              }}
            >
              · apple health → web, in minutes
            </div>
            <h1 className="t-display-xl" style={{ margin: 0 }}>
              Your Health data.
              <br />
              <span className="t-muted">On</span> <em className="t-italic t-brand">your</em>{" "}
              <span className="t-muted">site.</span>
            </h1>
            <p
              className="t-body-lg t-secondary"
              style={{ marginTop: 24, maxWidth: 480, lineHeight: 1.6 }}
            >
              A CLI that drops production-ready React components for visualizing Apple Health data
              into any Next.js project. You bring your own Supabase. Zero telemetry. MIT.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <Button variant="command" size="lg">
                npx wristkit init
              </Button>
              <Link href="/docs" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                read the docs →
              </Link>
            </div>
          </div>
          <div>
            <TodayActivityCardDemo />
          </div>
        </section>

        {/* ─── Quick start ─── */}
        <section style={{ marginBottom: 80 }}>
          <SectionEyebrow>quick start</SectionEyebrow>
          <SectionTitle>
            Ship in an evening. <span className="t-muted">Three commands.</span>
          </SectionTitle>
          <div style={{ marginTop: 28 }}>
            <HomeInstallBlock />
          </div>
        </section>

        {/* ─── States grid ─── */}
        <section style={{ marginBottom: 80 }}>
          <SectionEyebrow>today · activity</SectionEyebrow>
          <SectionTitle>
            One card. <span className="t-muted">Six states, every edge handled.</span>
          </SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 22,
              marginTop: 28,
            }}
          >
            {[
              { label: "default · synced", card: <TodayActivityCardDemo /> },
              { label: "B · loading", card: <TodayActivityCardLoading /> },
              { label: "A · empty", card: <TodayActivityCardEmpty /> },
              { label: "C · partial", card: <TodayActivityCardPartial /> },
              { label: "D · stale", card: <TodayActivityCardStale /> },
              { label: "E · error", card: <TodayActivityCardError /> },
            ].map(({ label, card }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column" }}>
                <div
                  className="t-mono-xs t-muted"
                  style={{ letterSpacing: "0.08em", marginBottom: 8 }}
                >
                  {label}
                </div>
                <div style={{ flex: 1 }}>{card}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Zero telemetry ─── */}
        <section
          style={{
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "40px 44px",
            marginBottom: 80,
            background: "var(--bg-surface)",
          }}
        >
          <div
            className="t-mono-xs"
            style={{
              color: "var(--metric-steps)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            · zero telemetry
          </div>
          <h2 className="t-display-md" style={{ margin: "0 0 16px" }}>
            Your data never leaves <em className="t-italic t-brand">your infrastructure.</em>
          </h2>
          <p
            className="t-body-md t-secondary"
            style={{ maxWidth: 640, margin: 0, lineHeight: 1.7 }}
          >
            wristkit is a CLI tool and component library. We ship code to your project — we never
            see your data, your Supabase credentials, or your users. The iOS Shortcut posts directly
            to your own endpoint. We have zero access to anything.
          </p>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {[
              "No analytics SDK",
              "No server-side logging",
              "No third-party cloud",
              "BYO Supabase",
            ].map((text) => (
              <span
                key={text}
                className="t-mono-xs t-secondary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <span style={{ color: "var(--status-success)", fontSize: 8 }}>●</span>
                {text}
              </span>
            ))}
          </div>
        </section>

        {/* ─── For developers ─── */}
        <section style={{ marginBottom: 80 }}>
          <SectionEyebrow>for developers</SectionEyebrow>
          <SectionTitle>
            Three commands. <span className="t-muted">One evening.</span>
          </SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: 22,
              marginTop: 28,
            }}
          >
            <InstallCard />
            <EnvCard />
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section style={{ marginBottom: 80 }}>
          <SectionEyebrow>how it works</SectionEyebrow>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 0,
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              marginTop: 28,
              background: "var(--bg-surface)",
            }}
          >
            {[
              {
                n: "01",
                title: "npx wristkit init",
                body: "Detects your Next.js app, prompts for theme, writes components.json and .env.local.example.",
              },
              {
                n: "02",
                title: "Run the SQL",
                body: "Copy the migration block into your Supabase SQL editor. One table, two indexes, done.",
              },
              {
                n: "03",
                title: "Import the Shortcut",
                body: "Open the wristkit shortcut link on iPhone. Edit two fields: your URL and API key.",
              },
              {
                n: "04",
                title: "Add a component",
                body: "npx wristkit add today-activity-card — files land in your project, import and render.",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                style={{
                  padding: "28px 24px",
                  borderLeft: i === 0 ? "none" : "1px dashed var(--border-subtle)",
                }}
              >
                <div className="t-mono-xs t-muted" style={{ marginBottom: 12 }}>
                  {step.n}
                </div>
                <div className="t-mono-sm" style={{ color: "var(--fg-brand)", marginBottom: 10 }}>
                  {step.title}
                </div>
                <p
                  className="t-body-md t-secondary"
                  style={{ margin: 0, lineHeight: 1.55, fontFamily: "var(--font-serif)" }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section
          style={{
            textAlign: "center",
            padding: "72px 0",
            borderTop: "1px dashed var(--border-subtle)",
            borderBottom: "1px dashed var(--border-subtle)",
            marginBottom: 32,
          }}
        >
          <h2 className="t-display-lg" style={{ margin: "0 0 28px" }}>
            Ship your health dashboard <em className="t-italic t-brand">today.</em>
          </h2>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button variant="command" size="lg">
              npx wristkit init
            </Button>
            <Link href="/docs" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              or read the docs first →
            </Link>
          </div>
        </section>
      </main>

      <StatusBar
        left={
          <>
            <StatusBarItem>wristkit</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>v0.1.0</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>/home</StatusBarItem>
          </>
        }
        right={
          <>
            <StatusBarItem>MIT</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>zero telemetry ✓</StatusBarItem>
          </>
        }
      />
    </>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="t-mono-xs t-brand"
      style={{
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        marginBottom: 8,
      }}
    >
      · {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="t-display-md" style={{ margin: 0 }}>
      {children}
    </h2>
  );
}
