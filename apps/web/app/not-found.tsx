import { buttonVariants } from "@/components/entrepta/button-variants";
import { ChromeMessage } from "@/components/entrepta/chrome-message";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="container">
        <ChromeMessage
          command="cat ./this-page"
          output="cat: ./this-page: No such file or directory"
          title="Nothing to see here."
          note="The page you're looking for moved or never existed. The docs are a good place to start."
          action={
            <div className="flex flex-wrap gap-3">
              <Link href="/" className={buttonVariants()}>
                Back to the home page
              </Link>
              <Link href="/docs" className={buttonVariants({ variant: "secondary" })}>
                Read the docs
              </Link>
            </div>
          }
          className="px-0 sm:px-0 lg:px-0"
        />
      </main>
      <SiteFooter />
    </>
  );
}
