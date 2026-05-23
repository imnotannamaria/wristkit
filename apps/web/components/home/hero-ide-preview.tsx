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
const brand = { color: "var(--fg-brand)" } as const;
const ok = { color: "var(--status-success-fg)" } as const;
const info = { color: "var(--status-info)" } as const;
const warn = { color: "var(--status-warning)" } as const;
const fg = { color: "var(--fg-primary)" } as const;

const FILES: FileTab[] = [
  {
    id: "snapshot",
    name: "payload.json",
    lang: "JSON",
    cursor: "Ln 4, Col 18",
    body: (
      <>
        <span style={muted}>{"// POST /api/wristkit-sync  ·  x-api-key ✓"}</span>
        {"\n"}
        <span style={sec}>{"{"}</span>
        {"\n  "}
        <span style={brand}>"samples"</span>
        <span style={sec}>: [</span>
        {"\n    "}
        <span style={sec}>{"{ "}</span>
        <span style={brand}>"metric"</span>
        <span style={sec}>: </span>
        <span style={warn}>"kcal"</span>
        <span style={sec}>, </span>
        <span style={brand}>"value"</span>
        <span style={sec}>: </span>
        <span style={ok}>544</span>
        <span style={sec}>, </span>
        <span style={brand}>"recorded_at"</span>
        <span style={sec}>: </span>
        <span style={warn}>"2026-04-21T21:14:00-03:00"</span>
        <span style={sec}>{" }"}</span>
        <span style={sec}>,</span>
        {"\n    "}
        <span style={sec}>{"{ "}</span>
        <span style={brand}>"metric"</span>
        <span style={sec}>: </span>
        <span style={warn}>"exercise_minutes"</span>
        <span style={sec}>, </span>
        <span style={brand}>"value"</span>
        <span style={sec}>: </span>
        <span style={ok}>80</span>
        <span style={sec}>{" }"}</span>
        <span style={sec}>,</span>
        {"\n    "}
        <span style={sec}>{"{ "}</span>
        <span style={brand}>"metric"</span>
        <span style={sec}>: </span>
        <span style={warn}>"steps"</span>
        <span style={sec}>, </span>
        <span style={brand}>"value"</span>
        <span style={sec}>: </span>
        <span style={ok}>6480</span>
        <span style={sec}>{" }"}</span>
        {"\n  "}
        <span style={sec}>]</span>
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
    id: "route",
    name: "route.ts",
    lang: "TypeScript",
    cursor: "Ln 3, Col 14",
    body: (
      <>
        <span style={info}>import</span>
        <span style={sec}>{" { "}</span>
        <span style={fg}>POST</span>
        <span style={sec}>{" } "}</span>
        <span style={info}>from</span>{" "}
        <span style={warn}>"@/components/wristkit/wristkit-sync-handler"</span>
        {"\n\n"}
        <span style={info}>export</span> <span style={sec}>{"{ "}</span>
        <span style={fg}>POST</span>
        <span style={sec}>{" }"}</span>
        {"\n\n"}
        <span style={muted}>{"// .env.local"}</span>
        {"\n"}
        <span style={brand}>WRISTKIT_DATABASE_URL</span>
        <span style={sec}>=</span>
        <span style={warn}>postgres://...</span>
        {"\n"}
        <span style={brand}>WRISTKIT_API_KEY</span>
        <span style={sec}>=</span>
        <span style={warn}>"$(openssl rand -hex 32)"</span>
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
        boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
      }}
      data-surface="dark"
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
                fontSize: 12,
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
          color: "var(--zinc-50)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span>{current.lang}</span>
          <span style={{ opacity: 0.6 }}>·</span>
          <span>UTF-8</span>
          <span style={{ opacity: 0.6 }}>·</span>
          <span>{current.cursor}</span>
        </div>
        <span>wristkit · POST /api/wristkit-sync</span>
      </div>
    </aside>
  );
}
