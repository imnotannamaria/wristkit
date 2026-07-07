"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * Catches render errors from the velite-compiled MDX bundle so one broken
 * doc page does not blank out the whole docs section.
 */
export class MdxErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error("[mdx] render failed", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          style={{
            padding: "20px 24px",
            border: "1px solid var(--status-error)",
            borderRadius: "var(--radius-md)",
            background: "var(--status-error-soft)",
            color: "var(--fg-primary)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "var(--status-error-fg)" }}>{"// MDX render error"}</strong>
          <div style={{ marginTop: 8, color: "var(--fg-secondary)" }}>
            {this.state.error.message}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
