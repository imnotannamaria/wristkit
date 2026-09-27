import { TopNav, TopNavLink, TopNavMenu } from "@/components/entrepta/top-nav";
import { WristKitMark } from "@/components/mark";
import { MobileNav } from "@/components/mobile-nav";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function SiteHeader({ docs = false }: { docs?: boolean }) {
  return (
    <header className="site-header">
      <div className="container">
        <TopNav
          className="border-0 bg-transparent px-0"
          left={
            <Link href="/" className="wordmark">
              <WristKitMark size={26} />
              <span>
                wristkit<span className="text-[var(--fg-brand-text)]">.</span>
              </span>
            </Link>
          }
          right={
            <>
              <TopNavMenu aria-label="Main">
                <TopNavLink href="/#activity">the card</TopNavLink>
                <TopNavLink href="/docs" active={docs}>
                  docs
                </TopNavLink>
                <TopNavLink href="https://github.com/imnotannamaria/wristkit" external>
                  <GithubLogoIcon size={16} aria-hidden /> source
                </TopNavLink>
              </TopNavMenu>
              <MobileNav />
            </>
          }
        />
      </div>
    </header>
  );
}
