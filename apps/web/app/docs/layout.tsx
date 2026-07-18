import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { SkipLink } from "@/components/skip-link";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[220px_1fr]"
      style={{ minHeight: "100vh", background: "var(--bg-canvas)" }}
    >
      <SkipLink href="#docs-content" />
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
  );
}
