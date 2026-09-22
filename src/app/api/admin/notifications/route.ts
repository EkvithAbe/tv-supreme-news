import { NextResponse } from "next/server";

import { requireContentApiAccess } from "@/lib/auth";
import {
  getNotificationsForUser,
  markNotificationsRead,
} from "@/lib/data/activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const access = await requireContentApiAccess();

  if (access.response) return access.response;

  const notifications = await getNotificationsForUser(access.user.id);

  return NextResponse.json({
    success: true,
    ...notifications,
  });
}

export async function PATCH(request: Request) {
  const access = await requireContentApiAccess();

  if (access.response) return access.response;

  try {
    const body = await request.json().catch(() => ({}));
    const ids = Array.isArray(body.ids)
      ? body.ids.filter((id: unknown): id is string => typeof id === "string")
      : undefined;

    await markNotificationsRead(access.user.id, ids);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/notifications:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update notifications.",
      },
      { status: 400 },
    );
  }
}
