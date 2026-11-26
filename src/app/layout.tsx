import type { Metadata, Viewport } from "next";
import { Inter, Unbounded } from "next/font/google";

import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import { TeamBar } from "@/modules/team-hub";
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
  // Dark is the default; the theme toggle updates this for a saved choice.
  themeColor: siteConfig.themeColors.dark,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Dark is the default. The theme script swaps in a saved choice before
    // first paint, so there is no flash.
    <html
      lang="en-IN"
      data-theme="dark"
      className={`${inter.variable} ${unbounded.variable}`}
      suppressHydrationWarning
    >
      <body className="grid min-h-svh grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr_auto] bg-background font-sans text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
        {/* Team builds only: a corner link to the All pages hub. */}
        {env.siteAccess === "team" && <TeamBar />}
      </body>
    </html>
  );
}
