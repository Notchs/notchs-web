import { NextResponse, type NextRequest } from "next/server";

import { adminConfig, isAdminHost } from "@/config/admin";
import { env } from "@/config/env";
import { isVenueHost, venueConfig, venueOrigin } from "@/config/venue";
import { guardTeamAccess } from "@/shared/lib/team-access";

const { appPath: adminPath } = adminConfig;
const { appPath: venuePath } = venueConfig;

function isUnder(appPath: string, pathname: string) {
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

/** Redirects within the host the browser asked for, not the server's own. */
function redirectOnHost(url: URL, host: string, pathname: string) {
  const [hostname, port = ""] = host.split(":");
  url.hostname = hostname;
  url.port = port;
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

/**
 * Runs before every page.
 *
 * 1. Team lock first: on test links, anyone without the team login is sent to
 *    /team-login (see src/shared/lib/team-access.ts). Keep this first.
 * 2. Team builds have no admin or venue host, so those are simply served at
 *    /admin and /venue.
 * 3. On the live site, splits the site by host:
 *    - admin.notchs.com/venues shows src/app/admin/venues (URL stays /venues).
 *    - admin.notchs.com/admin/... redirects to the same page without "/admin".
 *    - notchs.com/admin/... is a 404, so the panel is only on its own host.
 *    - venues.notchs.com/login shows src/app/venue/login (URL stays /login),
 *      and the bare host shows the dashboard overview.
 *    - venues.notchs.com/venue/... redirects to the same page without "/venue".
 *    - notchs.com/venue/... redirects to the venue host, so links already sent
 *      in emails keep working.
 */
export async function proxy(request: NextRequest) {
  const locked = await guardTeamAccess(request);
  if (locked) return locked;

  if (env.siteAccess === "team") return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();
  const host = requestHost(request);

  if (isAdminHost(host)) {
    if (isUnder(adminPath, pathname)) {
      return redirectOnHost(url, host, pathname.slice(adminPath.length) || "/");
    }
    url.pathname = pathname === "/" ? adminPath : `${adminPath}${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (isVenueHost(host)) {
    if (isUnder(venuePath, pathname)) {
      return redirectOnHost(url, host, pathname.slice(venuePath.length) || "/");
    }
    url.pathname = pathname === "/" ? venuePath : `${venuePath}${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (isUnder(adminPath, pathname)) {
    // No page lives here, so this renders the regular 404.
    url.pathname = "/404";
    return NextResponse.rewrite(url);
  }

  if (isUnder(venuePath, pathname)) {
    const path = pathname.slice(venuePath.length) || "/";
    return NextResponse.redirect(new URL(`${path}${search}`, venueOrigin));
  }

  return NextResponse.next();
}

export const config = {
  // Pages only: skip the API proxy, Next internals and files like icon.svg.
  matcher: ["/((?!api/|_next/static|_next/image|.*\\..*).*)"],
};
