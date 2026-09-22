import { NextResponse } from "next/server";

import {
  requireContentApiAccess,
} from "@/lib/auth";
import {
  getProfile,
  requestProfileCredentialChange,
  updateOwnProfile,
} from "@/lib/data/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const access = await requireContentApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const profile = await getProfile(access.user.id);

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("GET /api/admin/profile:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load your profile.",
      },
      { status: 500 },
    );
  }
}

/** Updates the signed-in user's permitted profile fields. */
export async function PUT(request: Request) {
  const access = await requireContentApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body = await request.json();

    if (access.user.role === "EDITOR" && (body.email !== undefined || body.password)) {
      return NextResponse.json(
        {
          success: false,
          error: "Editors must request approval to change email or password.",
        },
        { status: 403 },
      );
    }

    const profile = await updateOwnProfile(
      access.user.id,
      access.user.role,
      {
        name: body.name,
        phone: body.phone,
        jobTitle: body.jobTitle,
        bio: body.bio,
        profileImageId: body.profileImageId,
        ...(access.user.role === "ADMIN"
          ? {
              email: body.email,
              password: body.password,
            }
          : {}),
      },
    );

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("PUT /api/admin/profile:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save your profile.",
      },
      { status: 400 },
    );
  }
}

/** Editors request an email/password change for admin approval. */
export async function POST(request: Request) {
  const access = await requireContentApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    if (access.user.role !== "EDITOR") {
      return NextResponse.json(
        {
          success: false,
          error: "Administrators can change their credentials directly.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const type = body.type;
    const value = body.value;

    if (
      (type !== "EMAIL" && type !== "PASSWORD") ||
      typeof value !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid credential change request is required.",
        },
        { status: 400 },
      );
    }

    const changeRequest = await requestProfileCredentialChange(
      access.user.id,
      type,
      value,
    );

    return NextResponse.json(
      {
        success: true,
        changeRequest,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/profile:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit the request.",
      },
      { status: 400 },
    );
  }
}
