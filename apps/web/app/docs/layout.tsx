import { SidebarNav } from "@/components/docs/sidebar-nav";
import { SkipLink } from "@/components/skip-link";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        minHeight: "100vh",
        background: "var(--bg-canvas)",
      }}
    >
      <SkipLink href="#docs-content" />
      <aside
        style={{
          borderRight: "1px solid var(--border-subtle)",
          padding: "32px 20px",
          background: "var(--bg-surface)",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <nav aria-label="Documentation">
          <SidebarNav />
        </nav>
      </aside>
      <main id="docs-content" tabIndex={-1} style={{ padding: "52px 72px 96px", maxWidth: 800 }}>
        {children}
      </main>
    </div>
  );
}
