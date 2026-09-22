import { NextResponse } from "next/server";

import {
  requireApiAccess,
} from "@/lib/auth";
import { UserRole } from "../../../../../generated/prisma/client";

export const runtime = "nodejs";

/**
 * GET /api/auth/me
 *
 * Returns only the safe identity fields needed by the CMS UI.
 */
export async function GET() {
  const access = await requireApiAccess([
    UserRole.ADMIN,
    UserRole.EDITOR,
  ]);

  if (access.response) {
    return access.response;
  }

  return NextResponse.json({
    success: true,
    user: access.user,
  });
}
