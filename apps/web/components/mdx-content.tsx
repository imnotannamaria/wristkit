"use client";

import * as runtime from "react/jsx-runtime";
import { useMemo } from "react";

const customComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: 36,
        fontWeight: 500,
        letterSpacing: "-0.02em",
        margin: "0 0 16px",
        color: "#f5f5f5",
      }}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: 26,
        fontWeight: 500,
        letterSpacing: "-0.02em",
        margin: "40px 0 14px",
        color: "#f5f5f5",
        borderTop: "1px dashed #1f1f1f",
        paddingTop: 24,
      }}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "#67e8c0",
        margin: "28px 0 10px",
      }}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        lineHeight: 1.8,
        color: "#888",
        margin: "0 0 16px",
      }}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} style={{ color: "#9d80ff", textDecoration: "none" }} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} style={{ color: "#f5f5f5", fontWeight: 600 }} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const hasClass = "className" in props && props.className;
    if (hasClass) return <code {...props} />;
    return (
      <code
        {...props}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          background: "#161616",
          border: "1px solid #1f1f1f",
          borderRadius: 4,
          padding: "2px 6px",
          color: "#67e8c0",
        }}
      />
    );
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      {...props}
      style={{
        background: "#070707",
        border: "1px solid #1f1f1f",
        borderRadius: 8,
        padding: "16px",
        overflowX: "auto" as const,
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        lineHeight: 1.7,
        margin: "0 0 24px",
        color: "#ccc",
      }}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: "#888",
        lineHeight: 1.7,
        paddingLeft: 20,
        margin: "0 0 16px",
      }}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: "#888",
        lineHeight: 1.7,
        paddingLeft: 20,
        margin: "0 0 16px",
      }}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} style={{ marginBottom: 6 }} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      style={{
        borderLeft: "2px solid #9d80ff",
        paddingLeft: 16,
        margin: "0 0 16px",
        color: "#666",
        fontStyle: "italic" as const,
        fontFamily: "var(--font-serif)",
        fontSize: 15,
      }}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div style={{ overflowX: "auto" as const, marginBottom: 24 }}>
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
        padding: "8px 12px",
        textAlign: "left" as const,
        color: "#555",
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        fontWeight: 500,
      }}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      {...props}
      style={{
        borderBottom: "1px solid #161616",
        padding: "8px 12px",
        color: "#888",
      }}
    />
  ),
};

export function MdxContent({ code }: { code: string }) {
  const Component = useMemo(() => {
    const fn = new Function(code);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return fn({ ...runtime }).default as React.ComponentType<any>;
  }, [code]);

  return <Component components={customComponents} />;
}
