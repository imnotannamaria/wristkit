"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/entrepta/tabs";
import { useState } from "react";

type FileTab = {
  id: string;
  name: string;
  lang: string;
  cursor: string;
  body: React.ReactNode;
};

const muted = { color: "var(--fg-muted)" } as const;
const sec = { color: "var(--fg-secondary)" } as const;
const brand = { color: "var(--fg-brand-text)" } as const;
const ok = { color: "var(--status-success-fg)" } as const;
const info = { color: "var(--status-info-fg)" } as const;
const warn = { color: "var(--status-warning-fg)" } as const;
const fg = { color: "var(--fg-primary)" } as const;

const FILES: FileTab[] = [
  {
    id: "snapshot",
    name: "payload.json",
    lang: "JSON",
    cursor: "Ln 4, Col 16",
    body: (
      <>
        <span style={muted}>{"// POST /api/wristkit-sync  ·  x-api-key ✓"}</span>
        {"\n"}
        <span style={sec}>{"{"}</span>
        {"\n  "}
        <span style={brand}>"steps"</span>
        <span style={sec}>: </span>
        <span style={ok}>6480</span>
        <span style={sec}>,</span>
        {"\n  "}
        <span style={brand}>"moveKcal"</span>
        <span style={sec}>: </span>
        <span style={ok}>544</span>
        <span style={sec}>,</span>
        {"\n  "}
        <span style={brand}>"exerciseMin"</span>
        <span style={sec}>: </span>
        <span style={ok}>80</span>
        {"\n"}
        <span style={sec}>{"}"}</span>
        {"\n"}
        <span style={muted}>{"// → 200 ok · inserted 3"}</span>
      </>
    ),
  },
  {
    id: "page",
    name: "page.tsx",
    lang: "TypeScript",
    cursor: "Ln 6, Col 22",
    body: (
      <>
        <span style={info}>import</span>
        <span style={sec}>{" { "}</span>
        <span style={fg}>TodayActivityCard</span>
        <span style={sec}>{", "}</span>
        <span style={fg}>loadTodayActivity</span>
        <span style={sec}>{" } "}</span>
        <span style={info}>from</span>{" "}
        <span style={warn}>"@/components/wristkit/today-activity-card"</span>
        {"\n\n"}
        <span style={info}>export default async function</span> <span style={fg}>Dashboard</span>
        <span style={sec}>{"() {"}</span>
        {"\n  "}
        <span style={info}>const</span> <span style={fg}>state</span> ={" "}
        <span style={info}>await</span> <span style={fg}>loadTodayActivity</span>
        <span style={sec}>();</span>
        {"\n  "}
        <span style={info}>return</span> <span style={sec}>{"<"}</span>
        <span style={brand}>TodayActivityCard</span> <span style={muted}>state</span>
        <span style={sec}>{"={"}</span>
        <span style={fg}>state</span>
        <span style={sec}>{"} />"}</span>
        {"\n"}
        <span style={sec}>{"}"}</span>
      </>
    ),
  },
  {
    id: "environment",
    name: ".env.local",
    lang: "Environment",
    cursor: "Ln 3, Col 1",
    body: (
      <>
        <span style={muted}># Server environment · replace these placeholders</span>
        {"\n"}
        <span style={brand}>WRISTKIT_DATABASE_URL</span>
        <span style={sec}>=</span>
        <span style={warn}>your-supabase-transaction-pooler-url</span>
        {"\n"}
        <span style={brand}>WRISTKIT_API_KEY</span>
        <span style={sec}>=</span>
        <span style={warn}>your-generated-secret</span>
      </>
    ),
  },
];

export function HeroIdePreview() {
  const [active, setActive] = useState<string>(FILES[0]?.id ?? "snapshot");
  const current = FILES.find((f) => f.id === active) ?? FILES[0];
  if (!current) return null;

  return (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-canvas)",
        boxShadow: "var(--shadow-overlay)",
      }}
    >
      <Tabs value={active} onValueChange={setActive}>
        <TabsList>
          {FILES.map((f) => (
            <TabsTrigger key={f.id} value={f.id}>
              {f.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {FILES.map((f) => (
          <TabsContent key={f.id} value={f.id} style={{ margin: 0 }}>
            <pre
              style={{
                padding: "16px 20px",
                margin: 0,
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono-sm)",
                lineHeight: 1.6,
                overflowX: "auto",
                whiteSpace: "pre",
                color: "var(--fg-secondary)",
                minHeight: 280,
              }}
            >
              {f.body}
            </pre>
          </TabsContent>
        ))}
      </Tabs>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 16px",
          background: "var(--fg-brand)",
          color: "var(--fg-on-brand)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono-sm)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span>{current.lang}</span>
          <span className="hidden sm:inline" style={{ opacity: 0.6 }}>
            ·
          </span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="hidden sm:inline" style={{ opacity: 0.6 }}>
            ·
          </span>
          <span className="hidden sm:inline">{current.cursor}</span>
        </div>
        <span className="hidden sm:inline">wristkit · POST /api/wristkit-sync</span>
      </div>
    </aside>
  );
}
