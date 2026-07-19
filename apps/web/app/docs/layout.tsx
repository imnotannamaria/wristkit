import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { WristKitMark } from "@/components/mark";
import { MobileNav } from "@/components/mobile-nav";
import { SkipLink } from "@/components/skip-link";
import Link from "next/link";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink href="#docs-content" />
      {/* Mobile-only site header: keeps the hamburger reachable without
          scrolling to the top. On md+ the sidebar handles navigation. */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-4 py-3 md:hidden"
        style={{
          background: "color-mix(in srgb, var(--bg-canvas) 90%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <Link href="/" className="inline-flex items-center gap-2">
          <WristKitMark size={20} />
          <span
            style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--fg-primary)" }}
          >
            wristkit<span style={{ color: "var(--fg-brand)" }}>.</span>
          </span>
        </Link>
        <MobileNav />
      </header>
      <div
        className="grid grid-cols-1 md:grid-cols-[220px_1fr]"
        style={{ minHeight: "100vh", background: "var(--bg-canvas)" }}
      >
        <aside className="flex flex-col border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] md:sticky md:top-0 md:h-screen md:overflow-auto md:border-r md:border-b-0">
          <DocsSidebar />
        </aside>
        <main
          id="docs-content"
          tabIndex={-1}
          className="px-5 py-10 md:px-[72px] md:pt-[52px] md:pb-24"
          style={{ maxWidth: 800 }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
