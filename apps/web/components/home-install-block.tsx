"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/entrepta/tabs";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type Line = React.ReactNode[];

const tabs: { id: string; label: string; lang: string; lines: Line[] }[] = [
  {
    id: "init",
    label: "$ init",
    lang: "bash",
    lines: [
      [
        <span key="p" style={{ color: "var(--border-strong)" }}>
          $
        </span>,
        " ",
        <span key="c" style={{ color: "var(--fg-muted)" }}>
          npx{" "}
        </span>,
        <span key="w" style={{ color: "var(--metric-move)" }}>
          wristkit
        </span>,
        <span key="i" style={{ color: "var(--fg-primary)" }}>
          {" "}
          init
        </span>,
      ],
    ],
  },
  {
    id: "add",
    label: "$ add",
    lang: "bash",
    lines: [
      [
        <span key="p" style={{ color: "var(--border-strong)" }}>
          $
        </span>,
        " ",
        <span key="c" style={{ color: "var(--fg-muted)" }}>
          npx wristkit{" "}
        </span>,
        <span key="a" style={{ color: "var(--metric-exercise)" }}>
          add today-activity-card
        </span>,
      ],
    ],
  },
  {
    id: "import",
    label: "import",
    lang: "tsx",
    lines: [
      [
        <span key="k" style={{ color: "var(--metric-move)" }}>
          import{" "}
        </span>,
        <span key="b" style={{ color: "var(--fg-primary)" }}>
          {"{ "}
        </span>,
        <span key="n" style={{ color: "var(--metric-exercise)" }}>
          TodayActivityCard
        </span>,
        <span key="b2" style={{ color: "var(--fg-primary)" }}>
          {" }"}
        </span>,
        <span key="f" style={{ color: "var(--metric-move)" }}>
          {" "}
          from{" "}
        </span>,
        <span key="s" style={{ color: "var(--metric-steps)" }}>
          "@/components/today-activity-card"
        </span>,
        <span key="sc" style={{ color: "var(--fg-primary)" }}>
          ;
        </span>,
      ],
      [],
      [
        <span key="k" style={{ color: "var(--metric-move)" }}>
          export default async function{" "}
        </span>,
        <span key="n" style={{ color: "var(--metric-exercise)" }}>
          Dashboard
        </span>,
        <span key="p" style={{ color: "var(--fg-primary)" }}>
          {"() {"}
        </span>,
      ],
      [
        <span key="sp" style={{ color: "var(--fg-primary)" }}>
          {"  "}
        </span>,
        <span key="k" style={{ color: "var(--metric-move)" }}>
          const{" "}
        </span>,
        <span key="n" style={{ color: "var(--fg-primary)" }}>
          state{" "}
        </span>,
        <span key="e" style={{ color: "var(--fg-muted)" }}>
          ={" "}
        </span>,
        <span key="a" style={{ color: "var(--metric-move)" }}>
          await{" "}
        </span>,
        <span key="fn" style={{ color: "var(--metric-exercise)" }}>
          loadTodayActivity
        </span>,
        <span key="c" style={{ color: "var(--fg-primary)" }}>
          ();
        </span>,
      ],
      [
        <span key="sp" style={{ color: "var(--fg-primary)" }}>
          {"  "}
        </span>,
        <span key="r" style={{ color: "var(--metric-move)" }}>
          return{" "}
        </span>,
        <span key="lt" style={{ color: "var(--fg-muted)" }}>
          &lt;
        </span>,
        <span key="comp" style={{ color: "var(--metric-exercise)" }}>
          TodayActivityCard{" "}
        </span>,
        <span key="pr" style={{ color: "var(--metric-steps)" }}>
          state
        </span>,
        <span key="eq" style={{ color: "var(--fg-muted)" }}>
          =
        </span>,
        <span key="br" style={{ color: "var(--fg-primary)" }}>
          {"{"}
        </span>,
        <span key="st" style={{ color: "var(--metric-steps)" }}>
          state
        </span>,
        <span key="br2" style={{ color: "var(--fg-primary)" }}>
          {"}"}
        </span>,
        <span key="sl" style={{ color: "var(--fg-muted)" }}>
          /&gt;
        </span>,
        <span key="sc" style={{ color: "var(--fg-primary)" }}>
          ;
        </span>,
      ],
      [
        <span key="cb" style={{ color: "var(--fg-primary)" }}>
          {"}"}
        </span>,
      ],
    ],
  },
  {
    id: "shortcut",
    label: "shortcut",
    lang: "bash",
    lines: [
      [
        <span key="c" style={{ color: "var(--fg-muted)" }}>
          # install the iOS Shortcut on your iPhone
        </span>,
      ],
      [],
      [
        <span key="p" style={{ color: "var(--border-strong)" }}>
          $
        </span>,
        " ",
        <span key="c" style={{ color: "var(--fg-muted)" }}>
          npx wristkit{" "}
        </span>,
        <span key="a" style={{ color: "var(--metric-steps)" }}>
          shortcut
        </span>,
      ],
      [],
      [
        <span key="c" style={{ color: "var(--fg-muted)" }}>
          # opens the shortcut link — edit URL + API key, done
        </span>,
      ],
    ],
  },
];

function linesToText(lines: Line[]) {
  return lines
    .map((line) =>
      line
        .map((n) => {
          if (typeof n === "string") return n;
          if (typeof n === "object" && n !== null && "props" in (n as object)) {
            const el = n as React.ReactElement<{ children?: React.ReactNode }>;
            return typeof el.props.children === "string" ? el.props.children : "";
          }
          return "";
        })
        .join(""),
    )
    .join("\n");
}

export function HomeInstallBlock() {
  const [active, setActive] = useState(tabs[0]?.id ?? "init");
  const [copied, setCopied] = useState(false);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  if (!tab) return null;

  function handleCopy() {
    if (!tab) return;
    navigator.clipboard.writeText(linesToText(tab.lines)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div
      style={{
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--bg-surface)",
      }}
      data-surface="dark"
    >
      <Tabs value={active} onValueChange={setActive}>
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            background: "var(--bg-chrome)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <TabsList style={{ borderBottom: "none", background: "transparent" }}>
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy code"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "0 14px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: copied ? "var(--status-success)" : "var(--fg-muted)",
              borderLeft: "1px solid var(--border-subtle)",
              transition: "color 150ms",
            }}
          >
            {copied ? (
              <>
                <Check style={{ width: 11, height: 11, strokeWidth: 1.8 }} />
                copied
              </>
            ) : (
              <>
                <Copy style={{ width: 11, height: 11, strokeWidth: 1.5 }} />
                copy
              </>
            )}
          </button>
        </div>

        {tabs.map((t) => (
          <TabsContent key={t.id} value={t.id} style={{ margin: 0 }}>
            <div style={{ padding: "24px 28px", minHeight: 160 }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  lineHeight: 1.85,
                }}
              >
                <tbody>
                  {t.lines.map((line, i) => (
                    <tr key={`${t.id}-${i}`}>
                      <td
                        style={{
                          color: "var(--border-strong)",
                          fontSize: 11,
                          paddingRight: 24,
                          userSelect: "none",
                          verticalAlign: "top",
                          width: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {i + 1}
                      </td>
                      <td style={{ color: "var(--fg-primary)" }}>
                        {line.length > 0 ? line : <span>&nbsp;</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div
        style={{
          padding: "12px 28px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 24,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--fg-muted)",
          background: "var(--bg-chrome)",
        }}
      >
        <a
          href="https://github.com/imnotannamaria/wristkit"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "inherit",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          View on GitHub
        </a>
        <a href="/docs/installation" style={{ color: "inherit" }}>
          Full installation guide →
        </a>
      </div>
    </div>
  );
}
