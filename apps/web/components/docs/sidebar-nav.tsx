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
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 36,
        }}
      >
        <WristKitMark size={20} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--fg-primary)",
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
              fontSize: 11,
              color: "var(--fg-secondary)",
              letterSpacing: "0.14em",
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
                aria-current={active ? "page" : undefined}
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: active ? "var(--fg-primary)" : "var(--fg-secondary)",
                  padding: "6px 10px 6px 12px",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: 1,
                  position: "relative",
                  background: active ? "var(--bg-hover-soft)" : "transparent",
                  borderLeft: active ? "2px solid var(--fg-brand)" : "2px solid transparent",
                  transition: "color 150ms, background 150ms",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      ))}

      <div
        style={{
          marginTop: "auto",
          paddingTop: 32,
          borderTop: "1px dashed var(--border-subtle)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg-secondary)",
            letterSpacing: "0.04em",
          }}
        >
          v0.1.0 · MIT
        </div>
      </div>
    </>
  );
}
