import Link from "next/link";

import { routes } from "@/config/routes";
import { Logo } from "@/shared/components/brand/logo";

export function SiteHeader() {
  return (
    <header className="bg-ink">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
        <Link href={routes.home}>
          <Logo />
        </Link>
      </div>
    </header>
  );
}
