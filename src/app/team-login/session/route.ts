import type { NextRequest } from "next/server";

import { handleTeamLogin } from "@/shared/lib/team-access";

export function POST(request: NextRequest) {
  return handleTeamLogin(request);
}
