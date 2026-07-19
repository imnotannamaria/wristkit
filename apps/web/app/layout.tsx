import { ThemeScript, ThemeSwitcher } from "@/components/entrepta/theme-switcher";
import { Analytics } from "@vercel/analytics/next";
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

// Single brand theme; the switcher is here mainly for the dark/light toggle.
const SITE_THEMES = [{ id: "ivy", label: "Ivy", color: "#35a365", lightColor: "#1e8350" }] as const;

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
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "wristkit — Apple Health on the web",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="ivy"
      suppressHydrationWarning
      className={`${newsreader.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        {children}
        <ThemeSwitcher themes={SITE_THEMES} defaultTheme="ivy" />
        <Analytics />
      </body>
    </html>
  );
}
