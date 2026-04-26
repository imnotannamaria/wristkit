import Link from "next/link";
import { EnvCard, InstallCard, TodayActivityCardDemo } from "@/components/cards/today-activity-card-demo";
import {
  HistoryCard,
  HrvCard,
  ShortcutStatus,
  SleepCard,
  SnapshotLog,
  StandCard,
  StreakCard,
} from "@/components/cards/preview-cards";

const C = {
  move: "#9d80ff",
  exercise: "#67e8c0",
  steps: "#f5a623",
  muted: "#666666",
  mutedSoft: "#3a3a3a",
  text: "#f5f5f5",
  border: "#1f1f1f",
  bg: "#050505",
};

export default function HomePage() {
  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        padding: "56px 56px 80px",
        color: C.text,
        fontFamily: "var(--font-mono)",
        boxSizing: "border-box",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      {/* ─── Topbar ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 48,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: `linear-gradient(135deg, ${C.move}, ${C.exercise})`,
            }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.04em" }}>
            <span style={{ color: C.muted }}>@wristkit</span>
            <span style={{ color: C.mutedSoft }}> / </span>
            <span>home</span>
          </span>
        </div>
        <nav
          style={{
            display: "flex",
            gap: 22,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: C.muted,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            alignItems: "center",
          }}
        >
          <Link href="/" style={{ color: C.text, textDecoration: "none" }}>
            home
          </Link>
          <Link href="/docs" style={{ color: C.muted, textDecoration: "none" }}>
            docs
          </Link>
          <a
            href="https://github.com/annamaria/wristkit"
            target="_blank"
            rel="noreferrer"
            style={{ color: C.muted, textDecoration: "none" }}
          >
            github ↗
          </a>
          <a
            href="https://www.npmjs.com/package/wristkit"
            target="_blank"
            rel="noreferrer"
            style={{ color: C.muted, textDecoration: "none" }}
          >
            npm ↗
          </a>
        </nav>
      </div>

      {/* ─── Hero ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: 48,
          alignItems: "end",
          marginBottom: 64,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: C.exercise,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            <span style={{ color: C.mutedSoft }}>//</span> apple health → web, in minutes
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 500,
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
              color: C.text,
            }}
          >
            Your Health data.
            <br />
            <span style={{ color: C.muted }}>On</span>{" "}
            <span style={{ color: C.move }}>your</span>{" "}
            <span style={{ color: C.muted }}>site.</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              color: C.muted,
              lineHeight: 1.6,
              marginTop: 20,
              maxWidth: 440,
            }}
          >
            A CLI that drops production-ready React components for visualizing
            Apple Health data into any Next.js project. You bring your own
            Supabase. Zero telemetry. MIT.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
            <code
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.06em",
                background: C.text,
                color: C.bg,
                padding: "12px 18px",
                borderRadius: 8,
                userSelect: "all",
              }}
            >
              $ npx wristkit init
            </code>
            <Link
              href="/docs"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
                color: C.text,
                border: `1px solid ${C.border}`,
                padding: "12px 18px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              read the docs →
            </Link>
          </div>
        </div>
        <div>
          <TodayActivityCardDemo />
        </div>
      </div>

      {/* ─── Stats strip ─── */}
      <div
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "22px 26px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
          marginBottom: 56,
          background: "#0b0b0b",
        }}
      >
        {[
          { k: "packages", v: "1", suf: "npm" },
          { k: "deps", v: "2", suf: "peer" },
          { k: "p95 ingest", v: "<50", suf: "ms" },
          { k: "license", v: "MIT", suf: "" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              paddingLeft: i === 0 ? 0 : 24,
              borderLeft: i === 0 ? "none" : `1px dashed ${C.border}`,
            }}
          >
            <span
              style={{
                color: C.muted,
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {s.k}
            </span>
            <div style={{ marginTop: 6 }}>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 32,
                  fontWeight: 500,
                  color: C.text,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.v}
              </span>
              {s.suf && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: C.muted,
                    marginLeft: 6,
                  }}
                >
                  {s.suf}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Components section ─── */}
      <div
        style={{
          marginBottom: 22,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: C.exercise,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ⎯⎯ components
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 32,
              fontWeight: 500,
              margin: "6px 0 0",
              letterSpacing: "-0.02em",
            }}
          >
            Drop in a card.{" "}
            <span style={{ color: C.muted }}>We render the data.</span>
          </h2>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.muted }}>
          // 1 of 7 shipped
        </span>
      </div>

      {/* 2-col card grids */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 22,
          marginBottom: 22,
        }}
      >
        <SleepCard />
        <HrvCard />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 22,
          marginBottom: 22,
        }}
      >
        <HistoryCard metric="move" />
        <StandCard />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: 22,
          marginBottom: 56,
        }}
      >
        <SnapshotLog />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <StreakCard />
          <ShortcutStatus />
        </div>
      </div>

      {/* ─── Zero telemetry block ─── */}
      <div
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "32px 36px",
          marginBottom: 56,
          background: "#0b0b0b",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: C.steps,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          // zero telemetry
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 40,
            fontWeight: 500,
            margin: "0 0 16px",
            letterSpacing: "-0.02em",
          }}
        >
          Your data never leaves{" "}
          <span style={{ color: C.move }}>your infrastructure.</span>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: C.muted,
            lineHeight: 1.7,
            maxWidth: 620,
            margin: 0,
          }}
        >
          wristkit is a CLI tool and component library. We ship code to your project — we never
          see your data, your Supabase credentials, or your users. The iOS Shortcut posts directly
          to your own endpoint. We have zero access to anything.
        </p>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 32,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
          }}
        >
          {[
            { icon: "●", color: C.exercise, text: "No analytics SDK" },
            { icon: "●", color: C.exercise, text: "No server-side logging" },
            { icon: "●", color: C.exercise, text: "No third-party cloud" },
            { icon: "●", color: C.exercise, text: "BYO Supabase" },
          ].map((item) => (
            <span key={item.text} style={{ display: "flex", alignItems: "center", gap: 8, color: C.muted }}>
              <span style={{ color: item.color, fontSize: 8 }}>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Dev section ─── */}
      <div style={{ marginBottom: 22 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: C.move,
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ⎯⎯ for developers
        </span>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 32,
            fontWeight: 500,
            margin: "6px 0 0",
            letterSpacing: "-0.02em",
          }}
        >
          Three commands.{" "}
          <span style={{ color: C.muted }}>One evening.</span>
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 22,
          marginBottom: 80,
        }}
      >
        <InstallCard />
        <EnvCard />
      </div>

      {/* ─── How it works ─── */}
      <div style={{ marginBottom: 56 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: C.muted,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          ⎯⎯ how it works
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 0,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            overflow: "hidden",
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
                borderLeft: i === 0 ? "none" : `1px dashed ${C.border}`,
                background: "#0b0b0b",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: C.mutedSoft,
                  marginBottom: 12,
                }}
              >
                {step.n}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: C.exercise,
                  marginBottom: 10,
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.55,
                }}
              >
                {step.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div
        style={{
          textAlign: "center",
          padding: "64px 0",
          borderTop: `1px dashed ${C.border}`,
          borderBottom: `1px dashed ${C.border}`,
          marginBottom: 48,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 56,
            fontWeight: 500,
            margin: "0 0 24px",
            letterSpacing: "-0.03em",
          }}
        >
          Ship your health dashboard{" "}
          <span style={{ color: C.muted, fontStyle: "italic" }}>today.</span>
        </h2>
        <code
          style={{
            display: "inline-block",
            fontFamily: "var(--font-mono)",
            fontSize: 18,
            background: C.text,
            color: C.bg,
            padding: "16px 28px",
            borderRadius: 10,
            userSelect: "all",
            cursor: "text",
          }}
        >
          $ npx wristkit init
        </code>
        <div style={{ marginTop: 16 }}>
          <Link
            href="/docs"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: C.muted,
              textDecoration: "none",
              letterSpacing: "0.06em",
            }}
          >
            or read the docs first →
          </Link>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: C.muted,
        }}
      >
        <span>// wristkit · open-source · MIT</span>
        <span>v0.1.0 · zero telemetry ✓</span>
      </div>
    </div>
  );
}
