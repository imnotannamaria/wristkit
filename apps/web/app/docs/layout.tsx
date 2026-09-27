import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink href="#docs-content" />
      <SiteHeader docs />
      <div className="docs-layout container">
        <aside className="docs-sidebar">
          <DocsSidebar />
        </aside>
        <main id="docs-content" tabIndex={-1} className="docs-main">
          {children}
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
