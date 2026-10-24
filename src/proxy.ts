import { NextResponse, type NextRequest } from "next/server";

import { adminConfig, isAdminHost } from "@/config/admin";
import { env } from "@/config/env";
import { guardTeamAccess } from "@/shared/lib/team-access";

const { appPath } = adminConfig;

function isAdminAppPath(pathname: string) {
  return pathname === appPath || pathname.startsWith(`${appPath}/`);
}

/** The host the browser asked for, e.g. "admin.notchs.com" or "admin.localhost:3000". */
function requestHost(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    request.nextUrl.host;
  return host.split(",")[0].trim();
}

/**
 * Runs before every page.
 *
 * 1. Team lock first: on test links, anyone without the team login is sent to
 *    /team-login (see src/shared/lib/team-access.ts). Keep this first.
 * 2. Team builds have no admin host, so the panel is simply served at /admin.
 * 3. On the live site, splits the site by host:
 *    - admin.notchs.com/venues shows src/app/admin/venues (URL stays /venues).
 *    - admin.notchs.com/admin/... redirects to the same page without "/admin".
 *    - notchs.com/admin/... is a 404, so the panel is only on its own host.
 */
export async function proxy(request: NextRequest) {
  const locked = await guardTeamAccess(request);
  if (locked) return locked;

  if (env.siteAccess === "team") return NextResponse.next();

  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  const host = requestHost(request);

  if (isAdminHost(host)) {
    if (isAdminAppPath(pathname)) {
      // Keep the browser on the host it asked for, not the server's own.
      const [hostname, port = ""] = host.split(":");
      url.hostname = hostname;
      url.port = port;
      url.pathname = pathname.slice(appPath.length) || "/";
      return NextResponse.redirect(url);
    }
    url.pathname = pathname === "/" ? appPath : `${appPath}${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (isAdminAppPath(pathname)) {
    // No page lives here, so this renders the regular 404.
    url.pathname = "/404";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Pages only: skip the API proxy, Next internals and files like icon.svg.
  matcher: ["/((?!api/|_next/static|_next/image|.*\\..*).*)"],
};
