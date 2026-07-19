"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "home", href: "/" },
  { label: "docs", href: "/docs" },
  { label: "shortcut", href: "/docs/shortcut-setup" },
  { label: "components", href: "/docs/components/today-activity-card" },
];

/**
 * Hamburger site nav, shown below `md`. Reused on the home page and in the docs
 * mobile header so switching pages never requires scrolling back to the top.
 * A native <details> keeps it JS-free; the active link is derived from the path.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <details className="relative md:hidden">
      <summary
        aria-label="Toggle navigation menu"
        className="inline-flex size-9 cursor-pointer list-none items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-subtle)] text-[var(--fg-secondary)] [&::-webkit-details-marker]:hidden"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
          role="presentation"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </summary>
      <nav
        aria-label="Mobile"
        className="absolute right-0 top-[calc(100%+12px)] z-50 flex min-w-44 flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 font-mono text-[13px] uppercase tracking-[0.06em] shadow-lg"
      >
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-[var(--radius-sm)] px-3 py-2 text-[var(--fg-secondary)] hover:bg-[var(--bg-chrome)] hover:text-[var(--fg-primary)]",
              pathname === l.href && "text-[var(--fg-primary)]",
            )}
          >
            {l.label}
          </Link>
        ))}
        <a
          href="https://github.com/imnotannamaria/wristkit"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[var(--radius-sm)] px-3 py-2 text-[var(--fg-secondary)] hover:bg-[var(--bg-chrome)] hover:text-[var(--fg-primary)]"
        >
          github ↗
        </a>
      </nav>
    </details>
  );
}
