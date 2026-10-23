import { NextResponse, type NextRequest } from "next/server";

import { guardTeamAccess } from "@/shared/lib/team-access";

/**
 * Runs before every page. On test links it sends anyone without the team login
 * to /team-login; on the live site it lets every request straight through.
 * Keep `guardTeamAccess` first when adding more logic here.
 */
export async function proxy(request: NextRequest) {
  return (await guardTeamAccess(request)) ?? NextResponse.next();
}

export const config = {
  // Pages only: skip the API proxy, Next internals and files like icon.svg.
  matcher: ["/((?!api/|_next/static|_next/image|.*\\..*).*)"],
};
