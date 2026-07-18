"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { SidebarNav } from "./sidebar-nav";

/**
 * Docs sidebar wrapper: a collapsible disclosure below `md`, always expanded
 * from `md` up. Uses React state rather than a native <details> so the
 * expanded state is not fighting the user-agent's content-visibility on
 * closed <details> (which display overrides can't reliably beat).
 */
export function DocsSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="docs-sidebar-nav"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-5 py-4 font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-secondary)] md:hidden"
      >
        <span>Documentation</span>
        <span aria-hidden className={cn("transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </button>
      <div
        id="docs-sidebar-nav"
        className={cn(
          "flex-1 flex-col px-5 pt-2 pb-8 md:flex md:px-5 md:py-8",
          open ? "flex" : "hidden",
        )}
      >
        <nav aria-label="Documentation" className="flex flex-1 flex-col">
          <SidebarNav />
        </nav>
      </div>
    </>
  );
}
