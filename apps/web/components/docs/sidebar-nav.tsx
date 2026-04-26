"use client";

import { WristKitMark } from "@/components/mark";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/"
        className="docs-logo"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 36,
          textDecoration: "none",
        }}
      >
        <WristKitMark size={20} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "#f5f5f5",
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
              color: "#3a3a3a",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 6,
              paddingLeft: 10,
            }}
          >
            {group.section}
          </div>
          {group.links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`docs-nav-link${active ? " docs-nav-link--active" : ""}`}
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: active ? "#f5f5f5" : "#666",
                  textDecoration: "none",
                  padding: "6px 10px 6px 12px",
                  borderRadius: 5,
                  marginBottom: 1,
                  position: "relative",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      ))}

      <div style={{ marginTop: "auto", paddingTop: 32, borderTop: "1px dashed #1a1a1a" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#3a3a3a",
            letterSpacing: "0.04em",
          }}
        >
          v0.1.0 · MIT
        </div>
      </div>
    </>
  );
}
