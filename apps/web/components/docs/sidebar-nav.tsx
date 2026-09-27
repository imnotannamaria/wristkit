"use client";

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
    links: [{ href: "/docs/components/today-activity-card", label: "Activity Card" }],
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

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <p className="docs-nav-title">The field guide</p>
      {nav.map((group) => (
        <div key={group.section} className="docs-nav-group">
          <p className="docs-nav-label">{group.section}</p>
          {group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              aria-current={pathname === link.href ? "page" : undefined}
              className="docs-nav-link focus-ring"
            >
              <span aria-hidden className="docs-nav-marker">
                ◆
              </span>
              {link.label}
            </Link>
          ))}
        </div>
      ))}
      <div className="docs-nav-note">Open source · Yours to shape.</div>
    </>
  );
}
