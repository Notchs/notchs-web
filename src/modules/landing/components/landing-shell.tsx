import type { ReactNode } from "react";

import { routes } from "@/config/routes";

import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";

/**
 * The landing page's header and footer around another page's `<main>`
 * (Privacy, Terms). Section links point back to the homepage.
 */
export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingHeader linkBase={routes.home} />
      {children}
      <LandingFooter linkBase={routes.home} />
    </>
  );
}
