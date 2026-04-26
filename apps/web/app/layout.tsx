import type { Metadata } from "next";
import { JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--jb-mono",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--newsreader",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "wristkit — Apple Health on the web",
  description:
    "A CLI that drops production-ready React components for visualizing Apple Health data into any Next.js project. You bring your own Supabase.",
  keywords: ["apple health", "react", "next.js", "supabase", "components"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jbMono.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
