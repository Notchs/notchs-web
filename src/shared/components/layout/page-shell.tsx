import type { ReactNode } from "react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type PageShellProps = {
  /** Extra header content, shown beside the theme toggle. */
  headerMeta?: ReactNode;
  /** The `<main>` element of the page. */
  children: ReactNode;
};

/** Header, page content and footer: the frame every page sits in. */
export function PageShell({ headerMeta, children }: PageShellProps) {
  return (
    <>
      <SiteHeader>{headerMeta}</SiteHeader>
      {children}
      <SiteFooter />
    </>
  );
}
