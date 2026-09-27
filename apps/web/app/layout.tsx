import { ThemeScript, ThemeSwitcher } from "@/components/entrepta/theme-switcher";
import { THEMES } from "@/lib/themes";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://wristkit-web.vercel.app";
const SITE_DESCRIPTION =
  "Copy-paste React components for showing Apple Health data on your Next.js site. Bring your own Supabase. Zero telemetry.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "wristkit — Apple Health on the web",
    template: "%s · wristkit",
  },
  description: SITE_DESCRIPTION,
  keywords: ["apple health", "react", "next.js", "supabase", "components"],
  openGraph: {
    title: "wristkit — Apple Health on the web",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "wristkit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "wristkit — Apple Health on the web",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="entrepta"
      suppressHydrationWarning
      className={`${newsreader.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <head>
        <ThemeScript storageKey="wristkit" />
        <noscript>
          <style>{`
            [data-reveal], [data-type-in] > span {
              opacity: 1 !important;
              transform: none !important;
            }
            .docs-file-bundle [role="tablist"],
            [aria-controls="docs-sidebar-nav"] {
              display: none !important;
            }
            .docs-file-bundle [role="tabpanel"] {
              display: block !important;
            }
            #docs-sidebar-nav {
              display: flex !important;
            }
          `}</style>
        </noscript>
      </head>
      <body>
        {children}
        <ThemeSwitcher
          themes={THEMES}
          defaultTheme="entrepta"
          storageKey="wristkit"
          position="bottom-right"
        />
      </body>
    </html>
  );
}
