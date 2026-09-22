import { NextResponse } from "next/server";

import { requireAdminApiAccess } from "@/lib/auth";
import {
  getPendingProfileChangeRequests,
  reviewProfileChangeRequest,
} from "@/lib/data/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const access = await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const requests = await getPendingProfileChangeRequests();

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("GET /api/admin/profile/requests:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load profile change requests.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const access = await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body = await request.json();

    if (
      typeof body.id !== "string" ||
      (body.decision !== "APPROVE" && body.decision !== "REJECT")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "A request ID and decision are required.",
        },
        { status: 400 },
      );
    }

    await reviewProfileChangeRequest(
      body.id,
      access.user.id,
      body.decision,
      typeof body.reviewNote === "string"
        ? body.reviewNote
        : undefined,
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("PATCH /api/admin/profile/requests:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to review the request.",
      },
      { status: 400 },
    );
  }
}
