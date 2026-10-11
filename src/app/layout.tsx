import type { Metadata, Viewport } from "next";
import { Inter, Unbounded } from "next/font/google";

import { siteConfig } from "@/config/site";
import { openGraphBase } from "@/shared/lib/metadata";
import { themeInitScript } from "@/shared/lib/theme";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: "800",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    ...openGraphBase,
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: dark)",
      color: siteConfig.themeColors.dark,
    },
    {
      media: "(prefers-color-scheme: light)",
      color: siteConfig.themeColors.light,
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script sets data-theme on <html> before React hydrates.
    <html
      lang="en"
      className={`${inter.variable} ${unbounded.variable}`}
      suppressHydrationWarning
    >
      <body className="grid min-h-svh grid-rows-[auto_1fr_auto] bg-background font-sans text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
