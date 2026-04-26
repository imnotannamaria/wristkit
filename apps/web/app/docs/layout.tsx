import { SidebarNav } from "@/components/docs/sidebar-nav";

const C = {
  border: "#1f1f1f",
  bg: "#050505",
  bgPanel: "#0b0b0b",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        minHeight: "100vh",
        background: C.bg,
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          borderRight: `1px solid ${C.border}`,
          padding: "32px 20px",
          background: C.bgPanel,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SidebarNav />
      </aside>

      {/* Content */}
      <main style={{ padding: "52px 72px 96px", maxWidth: 800 }}>{children}</main>
    </div>
  );
}
