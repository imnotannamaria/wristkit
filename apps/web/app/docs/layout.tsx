import Link from "next/link";

const C = {
  move: "#9d80ff",
  exercise: "#67e8c0",
  muted: "#666666",
  mutedSoft: "#3a3a3a",
  text: "#f5f5f5",
  border: "#1f1f1f",
  bg: "#050505",
  bgPanel: "#0b0b0b",
};

const nav = [
  {
    section: "Getting started",
    links: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/shortcut-setup", label: "iOS Shortcut" },
    ],
  },
  {
    section: "Components",
    links: [{ href: "/docs/components/today-activity-card", label: "TodayActivityCard" }],
  },
  {
    section: "Concepts",
    links: [
      { href: "/docs/concepts/component-states", label: "Component states" },
      { href: "/docs/concepts/registry", label: "Registry" },
      { href: "/docs/concepts/data-model", label: "Data model" },
    ],
  },
  {
    section: "Reference",
    links: [{ href: "/docs/faq", label: "FAQ" }],
  },
];

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
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 32,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${C.move}, ${C.exercise})`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: C.text,
              letterSpacing: "0.04em",
            }}
          >
            wristkit
          </span>
        </Link>

        {nav.map((group) => (
          <div key={group.section} style={{ marginBottom: 28 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: C.mutedSoft,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 10,
                paddingLeft: 10,
              }}
            >
              {group.section}
            </div>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: C.muted,
                  textDecoration: "none",
                  padding: "7px 10px",
                  borderRadius: 5,
                  marginBottom: 2,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </aside>

      {/* Content */}
      <main style={{ padding: "48px 64px 80px", maxWidth: 800 }}>
        {children}
      </main>
    </div>
  );
}
