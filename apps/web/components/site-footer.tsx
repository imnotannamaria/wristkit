import { WristKitMark } from "@/components/mark";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer container">
      <Link href="/" className="wordmark">
        <WristKitMark size={22} />
        wristkit.
      </Link>
      <p>
        Made by{" "}
        <a href="https://annamaria.app" target="_blank" rel="noreferrer">
          Anna Maria
        </a>{" "}
        · Built with{" "}
        <a href="https://entrepta.vercel.app" target="_blank" rel="noreferrer">
          Entrepta
        </a>
      </p>
      <div>
        <Link href="/docs">Documentation</Link>
        <a href="https://github.com/imnotannamaria/wristkit">
          GitHub <ArrowUpRightIcon size={12} aria-hidden />
        </a>
        <span>MIT</span>
      </div>
    </footer>
  );
}
