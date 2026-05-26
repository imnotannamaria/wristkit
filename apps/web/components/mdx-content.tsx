"use client";

import {
  TodayActivityCardDemo,
  TodayActivityCardEmpty,
  TodayActivityCardError,
  TodayActivityCardLoading,
  TodayActivityCardPartial,
  TodayActivityCardRingsOnly,
  TodayActivityCardStale,
} from "@/components/cards/today-activity-card-demo";
import { CodeBlock } from "@/components/entrepta/code-block";
import { MdxErrorBoundary } from "@/components/mdx-error-boundary";
import { useMemo } from "react";
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

function MdxPre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const codeEl = children as React.ReactElement<{
    "data-language"?: string;
    children?: React.ReactNode;
  }>;
  const lang = codeEl?.props?.["data-language"];
  const text = extractText(codeEl?.props?.children);

  return (
    <div style={{ margin: "0 0 28px" }}>
      <CodeBlock code={text} language={lang}>
        <pre {...props} style={{ margin: 0 }}>
          {children}
        </pre>
      </CodeBlock>
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
        color: "var(--fg-primary)",
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
        color: "var(--fg-primary)",
        paddingTop: 24,
        borderTop: "1px dashed var(--border-subtle)",
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
        color: "var(--fg-brand)",
        margin: "32px 0 10px",
      }}
    />
  ),

  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        lineHeight: 1.7,
        color: "var(--fg-secondary)",
        margin: "0 0 18px",
      }}
    />
  ),

  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      style={{
        color: "var(--fg-brand)",
        textDecoration: "none",
        transition: "color 150ms",
      }}
    />
  ),

  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} style={{ color: "var(--fg-primary)", fontWeight: 600 }} />
  ),

  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} style={{ color: "var(--fg-brand)", fontStyle: "italic" }} />
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
          background: "var(--bg-surface-elevated)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-sm)",
          padding: "2px 7px",
          color: "var(--fg-brand)",
        }}
      />
    );
  },

  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <MdxPre {...props} />,

  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        color: "var(--fg-secondary)",
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
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        color: "var(--fg-secondary)",
        lineHeight: 1.8,
        paddingLeft: 22,
        margin: "0 0 18px",
      }}
    />
  ),

  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} style={{ marginBottom: 7 }} />,

  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      style={{
        borderLeft: "2px solid var(--fg-brand)",
        paddingLeft: 18,
        margin: "0 0 20px",
        color: "var(--fg-secondary)",
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
        backgroundImage: "linear-gradient(to right, var(--border-subtle) 50%, transparent 50%)",
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
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
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
        borderBottom: "1px solid var(--border-subtle)",
        padding: "10px 14px",
        textAlign: "left" as const,
        color: "var(--fg-muted)",
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        fontWeight: 500,
        background: "var(--bg-surface)",
      }}
    />
  ),

  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      {...props}
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        padding: "9px 14px",
        color: "var(--fg-secondary)",
        fontSize: 12,
      }}
    />
  ),

  TodayActivityCardDemo,
  TodayActivityCardEmpty,
  TodayActivityCardLoading,
  TodayActivityCardStale,
  TodayActivityCardError,
  TodayActivityCardPartial,
  TodayActivityCardRingsOnly,
};

export function MdxContent({ code }: { code: string }) {
  const Component = useMemo(() => {
    // Velite compiles each MDX file into a self-contained module body. We
    // run it once per page render via new Function so the React runtime
    // can resolve jsx/jsxs. The source is build-time (our own MDX), not
    // user input — never let untrusted strings reach this call.
    const fn = new Function(code);
    return fn({ ...runtime }).default as React.ComponentType<{
      components?: Record<string, React.ComponentType<unknown>>;
    }>;
  }, [code]);

  return (
    <MdxErrorBoundary>
      <Component
        components={customComponents as unknown as Record<string, React.ComponentType<unknown>>}
      />
    </MdxErrorBoundary>
  );
}
