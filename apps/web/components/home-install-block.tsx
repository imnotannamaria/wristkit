"use client";

import { useState } from "react";

const C = {
  move: "#9d80ff",
  exercise: "#67e8c0",
  steps: "#f5a623",
  muted: "#666",
  mutedSoft: "#3a3a3a",
  text: "#f5f5f5",
  border: "#1f1f1f",
  bg: "#050505",
};

type Line = React.ReactNode[];

const tabs: { id: string; label: string; lang: string; lines: Line[] }[] = [
  {
    id: "init",
    label: "$ init",
    lang: "bash",
    lines: [
      [<span key="p" style={{ color: C.mutedSoft }}>$</span>, " ", <span key="c" style={{ color: C.muted }}>npx </span>, <span key="w" style={{ color: C.move }}>wristkit</span>, <span key="i" style={{ color: C.text }}> init</span>],
    ],
  },
  {
    id: "add",
    label: "$ add",
    lang: "bash",
    lines: [
      [<span key="p" style={{ color: C.mutedSoft }}>$</span>, " ", <span key="c" style={{ color: C.muted }}>npx wristkit </span>, <span key="a" style={{ color: C.exercise }}>add today-activity-card</span>],
    ],
  },
  {
    id: "import",
    label: "import",
    lang: "tsx",
    lines: [
      [<span key="k" style={{ color: C.move }}>import </span>, <span key="b" style={{ color: C.text }}>{"{ "}</span>, <span key="n" style={{ color: C.exercise }}>TodayActivityCard</span>, <span key="b2" style={{ color: C.text }}>{" }"}</span>, <span key="f" style={{ color: C.move }}> from </span>, <span key="s" style={{ color: C.steps }}>"@/components/today-activity-card"</span>, <span key="sc" style={{ color: C.text }}>;</span>],
      [],
      [<span key="k" style={{ color: C.move }}>export default async function </span>, <span key="n" style={{ color: C.exercise }}>Dashboard</span>, <span key="p" style={{ color: C.text }}>{"() {"}</span>],
      [<span key="sp" style={{ color: C.text }}>{"  "}</span>, <span key="k" style={{ color: C.move }}>const </span>, <span key="n" style={{ color: C.text }}>state </span>, <span key="e" style={{ color: C.muted }}>= </span>, <span key="a" style={{ color: C.move }}>await </span>, <span key="fn" style={{ color: C.exercise }}>loadTodayActivity</span>, <span key="c" style={{ color: C.text }}>();</span>],
      [<span key="sp" style={{ color: C.text }}>{"  "}</span>, <span key="r" style={{ color: C.move }}>return </span>, <span key="lt" style={{ color: C.muted }}>&lt;</span>, <span key="comp" style={{ color: C.exercise }}>TodayActivityCard </span>, <span key="pr" style={{ color: C.steps }}>state</span>, <span key="eq" style={{ color: C.muted }}>=</span>, <span key="br" style={{ color: C.text }}>{"{"}</span>, <span key="st" style={{ color: C.steps }}>state</span>, <span key="br2" style={{ color: C.text }}>{"}"}</span>, <span key="sl" style={{ color: C.muted }}>/&gt;</span>, <span key="sc" style={{ color: C.text }}>;</span>],
      [<span key="cb" style={{ color: C.text }}>{"}"}</span>],
    ],
  },
  {
    id: "shortcut",
    label: "shortcut",
    lang: "bash",
    lines: [
      [<span key="c" style={{ color: C.muted }}># install the iOS Shortcut on your iPhone</span>],
      [],
      [<span key="p" style={{ color: C.mutedSoft }}>$</span>, " ", <span key="c" style={{ color: C.muted }}>npx wristkit </span>, <span key="a" style={{ color: C.steps }}>shortcut</span>],
      [],
      [<span key="c" style={{ color: C.muted }}># opens the shortcut link — edit URL + API key, done</span>],
    ],
  },
];

export function HomeInstallBlock() {
  const [active, setActive] = useState(tabs[0]!.id);
  const [copied, setCopied] = useState(false);

  // biome-ignore lint/style/noNonNullAssertion: tabs is static, active always matches
  const tab = (tabs.find((t) => t.id === active) ?? tabs[0])!;

  function handleCopy() {
    const text = tab.lines
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
          .join("")
      )
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <style>{`
        .wk-tab { transition: color 0.15s ease, background 0.15s ease; }
        .wk-tab:hover { color: #f5f5f5 !important; background: rgba(255,255,255,0.05) !important; }
        .wk-install-copy { transition: color 0.15s ease, border-color 0.15s ease, transform 0.15s cubic-bezier(0.16,1,0.3,1), background 0.15s ease; }
        .wk-install-copy:hover { color: #f5f5f5 !important; border-color: #444 !important; background: rgba(255,255,255,0.05) !important; transform: scale(1.05); }
        .wk-install-copy:active { transform: scale(0.95); }
        @keyframes wk-install-pop { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        .wk-install-popped { animation: wk-install-pop 0.22s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes wk-line-in { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        .wk-code-line { animation: wk-line-in 0.18s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>
      <div
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 56,
          background: "#0a0a0a",
        }}
      >
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: `1px solid ${C.border}`,
            background: "#0f0f0f",
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map((t) => {
              const isActive = t.id === active;
              return (
                <button
                  key={t.id}
                  type="button"
                  className="wk-tab"
                  onClick={() => setActive(t.id)}
                  style={{
                    background: isActive ? "rgba(255,255,255,0.07)" : "none",
                    border: isActive ? `1px solid #2a2a2a` : "1px solid transparent",
                    borderRadius: 6,
                    cursor: "pointer",
                    padding: "5px 10px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: isActive ? C.text : C.muted,
                    letterSpacing: "0.06em",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Copy button */}
          <button
            type="button"
            className={`wk-install-copy${copied ? " wk-install-popped" : ""}`}
            onClick={handleCopy}
            style={{
              background: "none",
              border: `1px solid #2a2a2a`,
              borderRadius: 6,
              cursor: "pointer",
              padding: "5px 10px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: copied ? C.exercise : C.muted,
              letterSpacing: "0.06em",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {copied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                copied
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M8 4V2.5A1.5 1.5 0 006.5 1H2.5A1.5 1.5 0 001 2.5v4A1.5 1.5 0 002.5 8H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                copy
              </>
            )}
          </button>
        </div>

        {/* Code area */}
        <div style={{ padding: "24px 28px", minHeight: 140 }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.85 }}>
            <tbody>
              {tab.lines.map((line, i) => (
                <tr
                  key={`${active}-${i}`}
                  className="wk-code-line"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <td
                    style={{
                      color: C.mutedSoft,
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
                  <td style={{ color: C.text }}>
                    {line.length > 0 ? line : <span>&nbsp;</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 28px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: C.muted,
          }}
        >
          <a
            href="https://github.com/annamaria/wristkit"
            target="_blank"
            rel="noreferrer"
            className="wk-nav-link"
            style={{ color: C.muted, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View on GitHub
          </a>
          <a
            href="/docs/installation"
            className="wk-nav-link"
            style={{ color: C.muted, textDecoration: "none" }}
          >
            Full installation guide →
          </a>
        </div>
      </div>
    </>
  );
}
