"use client";

import { useMemo, useState } from "react";
import type React from "react";
import * as runtime from "react/jsx-runtime";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node !== null && typeof node === "object" && "props" in node) {
    return extractText((node as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return "";
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <style>{`
        .wk-copy-btn { transition: color 0.15s ease, border-color 0.15s ease, transform 0.15s cubic-bezier(0.16,1,0.3,1), background 0.15s ease; }
        .wk-copy-btn:hover { color: #f5f5f5 !important; border-color: #444 !important; background: rgba(255,255,255,0.05) !important; transform: scale(1.05); }
        .wk-copy-btn:active { transform: scale(0.95); }
        @keyframes wk-pop { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
        .wk-copy-copied { animation: wk-pop 0.22s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes wk-check-draw { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } }
        .wk-check { stroke-dasharray: 20; stroke-dashoffset: 20; animation: wk-check-draw 0.25s 0.05s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>
      <button
        type="button"
        className={`wk-copy-btn${copied ? " wk-copy-copied" : ""}`}
        onClick={() => {
          navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
        style={{
          background: "none",
          border: "1px solid #2a2a2a",
          borderRadius: 6,
          cursor: "pointer",
          padding: "4px 8px",
          color: copied ? "#67e8c0" : "#555",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.06em",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        {copied ? (
          <>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                className="wk-check"
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            copied
          </>
        ) : (
          <>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <rect
                x="4"
                y="4"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M8 4V2.5A1.5 1.5 0 006.5 1H2.5A1.5 1.5 0 001 2.5v4A1.5 1.5 0 002.5 8H4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            copy
          </>
        )}
      </button>
    </>
  );
}

function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const codeEl = children as React.ReactElement<{
    "data-language"?: string;
    children?: React.ReactNode;
  }>;
  const lang = codeEl?.props?.["data-language"];
  const text = extractText(codeEl?.props?.children);

  return (
    <div
      style={{
        margin: "0 0 28px",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #1e1e1e",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "#111",
          borderBottom: "1px solid #1e1e1e",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#555",
            letterSpacing: "0.04em",
          }}
        >
          {lang ?? "code"}
        </span>
        <CopyButton text={text} />
      </div>
      {/* Code area */}
      <pre
        {...props}
        style={{
          background: "#0d0d0d",
          margin: 0,
          padding: "22px 24px",
          overflowX: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.8,
          borderRadius: 0,
        }}
      >
        {children}
      </pre>
    </div>
  );
}

const customComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: 36,
        fontWeight: 500,
        letterSpacing: "-0.02em",
        margin: "0 0 20px",
        color: "#f5f5f5",
      }}
    />
  ),

  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: 24,
        fontWeight: 500,
        letterSpacing: "-0.02em",
        margin: "48px 0 16px",
        color: "#f5f5f5",
        paddingTop: 24,
        borderTop: "1px dashed #222",
      }}
    />
  ),

  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        color: "#67e8c0",
        margin: "32px 0 10px",
      }}
    />
  ),

  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        lineHeight: 1.85,
        color: "#aaa",
        margin: "0 0 18px",
      }}
    />
  ),

  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      className="docs-prose-link"
      style={{ color: "#9d80ff", textDecoration: "none" }}
    />
  ),

  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} style={{ color: "#e5e5e5", fontWeight: 600 }} />
  ),

  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} style={{ color: "#bbb", fontStyle: "italic" }} />
  ),

  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const hasClass = "className" in props && props.className;
    if (hasClass) return <code {...props} />;
    return (
      <code
        {...props}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.88em",
          background: "#0f0f0f",
          border: "1px solid #222",
          borderRadius: 5,
          padding: "2px 7px",
          color: "#67e8c0",
        }}
      />
    );
  },

  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <CodeBlock {...props} />,

  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: "#aaa",
        lineHeight: 1.8,
        paddingLeft: 22,
        margin: "0 0 18px",
      }}
    />
  ),

  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: "#aaa",
        lineHeight: 1.8,
        paddingLeft: 22,
        margin: "0 0 18px",
      }}
    />
  ),

  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} style={{ marginBottom: 7, color: "#aaa" }} />
  ),

  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      style={{
        borderLeft: "2px solid #9d80ff55",
        paddingLeft: 18,
        margin: "0 0 20px",
        color: "#777",
        fontStyle: "italic" as const,
        fontFamily: "var(--font-serif)",
        fontSize: 15,
        lineHeight: 1.7,
      }}
    />
  ),

  hr: () => (
    <div
      style={{
        margin: "40px 0",
        height: 1,
        backgroundImage: "linear-gradient(to right, #1f1f1f 50%, transparent 50%)",
        backgroundSize: "6px 1px",
        backgroundRepeat: "repeat-x",
      }}
    />
  ),

  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div
      style={{
        overflowX: "auto" as const,
        marginBottom: 28,
        borderRadius: 8,
        border: "1px solid #1a1a1a",
      }}
    >
      <table
        {...props}
        style={{
          width: "100%",
          borderCollapse: "collapse" as const,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
        }}
      />
    </div>
  ),

  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      {...props}
      style={{
        borderBottom: "1px solid #1f1f1f",
        padding: "10px 14px",
        textAlign: "left" as const,
        color: "#555",
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        fontWeight: 500,
        background: "#0b0b0b",
      }}
    />
  ),

  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      {...props}
      style={{
        borderBottom: "1px solid #141414",
        padding: "9px 14px",
        color: "#999",
        fontSize: 12,
      }}
    />
  ),
};

export function MdxContent({ code }: { code: string }) {
  const Component = useMemo(() => {
    const fn = new Function(code);
    return fn({ ...runtime }).default as React.ComponentType<{
      components?: Record<string, React.ComponentType<unknown>>;
    }>;
  }, [code]);

  return (
    <Component
      components={customComponents as unknown as Record<string, React.ComponentType<unknown>>}
    />
  );
}
