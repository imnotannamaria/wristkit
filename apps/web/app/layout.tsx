import { ThemeScript } from "@/components/entrepta/theme-switcher";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wristkit — Apple Health on the web",
  description:
    "A CLI that drops production-ready React components for visualizing Apple Health data into any Next.js project. You bring your own Supabase.",
  keywords: ["apple health", "react", "next.js", "supabase", "components"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="ivy" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
