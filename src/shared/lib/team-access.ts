import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/config/env";
import { routes } from "@/config/routes";
import { serverEnv } from "@/config/server-env";

/**
 * The team login that locks test links (deploy previews and branch deploys).
 *
 * The live site is never locked: `env.siteAccess` is fixed when the site is
 * built, and only Netlify production builds are "public". Every other build is
 * locked, and stays locked if the team login is not set, so a missing setting
 * can never put unfinished work in public.
 *
 * Signing in sets an HttpOnly cookie holding an HMAC of the username, keyed by
 * the password. Changing either one signs everybody out.
 */

const COOKIE_NAME = "notchs_team";
const SESSION_DAYS = 30;

/** Paths that stay open on team builds, so people can sign in. */
const OPEN_PATHS = new Set<string>([routes.teamLogin, routes.teamLoginSession]);

const encoder = new TextEncoder();

async function sessionToken(username: string, password: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`team-session-v1:${username}`),
  );
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

/** Compares in constant time, so response times don't reveal the token. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** The token a signed-in browser holds, or null while the login is not set. */
async function expectedToken() {
  const { teamUsername, teamPassword } = serverEnv;
  if (!teamUsername || !teamPassword) return null;
  return sessionToken(teamUsername, teamPassword);
}

/**
 * For src/proxy.ts. Returns a redirect to the team login when this request may
 * not see the page, or null to let it through.
 */
export async function guardTeamAccess(
  request: NextRequest,
): Promise<NextResponse | null> {
  if (env.siteAccess === "public") return null;

  const { pathname } = request.nextUrl;
  if (OPEN_PATHS.has(pathname)) return null;

  const expected = await expectedToken();
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (expected && cookie && safeEqual(cookie, expected)) return null;

  // Come back to the same page after signing in (minus Next's internal _rsc).
  const back = request.nextUrl.clone();
  back.searchParams.delete("_rsc");
  const login = new URL(routes.teamLogin, request.nextUrl);
  login.searchParams.set("next", back.pathname + back.search);

  const response = NextResponse.redirect(login);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export type TeamLoginResult = { ok: true } | { error: "wrong" | "unset" };

/** For the route at `routes.teamLoginSession`: checks the login, sets the cookie. */
export async function handleTeamLogin(request: NextRequest) {
  if (env.siteAccess === "public") {
    return new NextResponse(null, { status: 404 });
  }

  const reply = (body: TeamLoginResult, status: number) =>
    NextResponse.json(body, {
      status,
      headers: { "Cache-Control": "no-store" },
    });

  const expected = await expectedToken();
  if (!expected) return reply({ error: "unset" }, 503);

  const form = await request.formData();
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const given = await sessionToken(username, password);
  if (!safeEqual(given, expected)) return reply({ error: "wrong" }, 401);

  const response = reply({ ok: true }, 200);
  response.cookies.set(COOKIE_NAME, expected, {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return response;
}
