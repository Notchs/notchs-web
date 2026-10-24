import type { Metadata, Viewport } from "next";
import { Inter, Unbounded } from "next/font/google";

import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import { TeamBar } from "@/modules/team-hub";
import { glassInitScript } from "@/shared/lib/glass/refraction";
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
    // These scripts set data-theme and data-glass-refraction on <html>
    // before React hydrates.
    <html
      lang="en-IN"
      // Nothing (e.g. a glass shadow at the edge) may widen the page on phones.
      className={`${inter.variable} ${unbounded.variable} overflow-x-clip`}
      suppressHydrationWarning
    >
      <body className="grid min-h-svh grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr_auto] overflow-x-clip bg-background font-sans text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: glassInitScript }} />
        {children}
        {/* Team builds only: a corner link to the All pages hub. */}
        {env.siteAccess === "team" && <TeamBar />}
      </body>
    </html>
  );
}
