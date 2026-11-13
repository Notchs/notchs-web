import { NextResponse, type NextRequest } from "next/server";

import { adminConfig, isAdminHost } from "@/config/admin";
import { API_PROXY_PREFIX } from "@/config/api";
import { env } from "@/config/env";
import { serverEnv } from "@/config/server-env";
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

/** Headers only this proxy may send to the API (notchs-api, app/common/http.py). */
const PROXY_SECRET_HEADER = "x-notchs-proxy-secret";
const PROXY_CLIENT_IP_HEADER = "x-notchs-client-ip";
/** Set by Netlify to the address that connected to it; visitors can't change it. */
const NETLIFY_CLIENT_IP_HEADER = "x-nf-client-connection-ip";

/**
 * Sends an API call on to the backend, with the visitor's address and the
 * shared secret that lets the API believe it. The API's rate limits count per
 * visitor with this; without it they can't tell visitors apart. Anything the
 * browser sent under these names is dropped first.
 */
function proxyToApi(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete(PROXY_SECRET_HEADER);
  headers.delete(PROXY_CLIENT_IP_HEADER);
  const visitor = request.headers.get(NETLIFY_CLIENT_IP_HEADER);
  if (serverEnv.apiProxySecret && visitor) {
    headers.set(PROXY_SECRET_HEADER, serverEnv.apiProxySecret);
    headers.set(PROXY_CLIENT_IP_HEADER, visitor);
  }
  const { pathname, search } = request.nextUrl;
  return NextResponse.rewrite(new URL(`${pathname}${search}`, env.apiUrl), {
    request: { headers },
  });
}

/**
 * Runs before every page and every API call.
 *
 * 1. Team lock first: on test links, anyone without the team login is sent to
 *    /team-login (see src/shared/lib/team-access.ts). Keep this first.
 * 2. API calls (/api/...) go to the backend through `proxyToApi`.
 * 3. Team builds have no admin or venue host, so those are simply served at
 *    /admin and /venue.
 * 4. On the live site, splits the site by host:
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

  const { pathname, search } = request.nextUrl;
  if (isUnder(API_PROXY_PREFIX, pathname)) return proxyToApi(request);

  if (env.siteAccess === "team") return NextResponse.next();

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
  // Pages and API calls; skip Next internals and files like icon.svg.
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)", "/api/:path*"],
};
