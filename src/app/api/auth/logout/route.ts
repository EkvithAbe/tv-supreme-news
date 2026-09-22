import {
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  AUTH_SESSION_COOKIE,
  clearSessionCookie,
  revokeSession,
} from "@/lib/auth";

export const runtime = "nodejs";

/**
 * POST /api/auth/logout
 *
 * Deletes the database session when present, then expires the
 * browser cookie even when the session was already invalid.
 */
export async function POST(
  request: NextRequest,
) {
  try {
    await revokeSession(
      request.cookies.get(
        AUTH_SESSION_COOKIE,
      )?.value,
    );
  } catch (error) {
    console.error("POST /api/auth/logout error:", error);
  }

  const response = NextResponse.json({
    success: true,
  });

  clearSessionCookie(response);

  return response;
}
