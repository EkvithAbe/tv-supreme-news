import { NextResponse } from "next/server";

import { requireAdminApiAccess } from "@/lib/auth";
import {
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from "@/lib/data/users";
import { getActivityForUser, recordActivity } from "@/lib/data/activity";

export async function GET(request: Request) {
  const access = await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        error: "Editor ID is required.",
      },
      { status: 400 },
    );
  }

  const user = await getUserById(id);

  if (!user || user.role !== "EDITOR") {
    return NextResponse.json(
      {
        success: false,
        error: "Editor not found.",
      },
      { status: 404 },
    );
  }

  const activity = await getActivityForUser(id);

  return NextResponse.json({
    success: true,
    user,
    activity,
  });
}

export async function POST(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body =
      await request.json();

    const user =
      await createUser({
        name: body.name,
        email: body.email,
        password: body.password,
        role: "EDITOR",
      });

    await recordActivity({
      actorId: access.user.id,
      action: "EDITOR_CREATED",
      resourceType: "EDITOR",
      resourceId: user.id,
      summary: `Created Editor account for ${user.name}.`,
      notifyUser: {
        userId: user.id,
        notification: {
          kind: "EDITOR_ACCOUNT_CREATED",
          title: "Your Editor account is ready",
          message: "You can now sign in to the TV SUPREME CMS.",
          href: "/admin/profile",
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/users:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create user.",
      },
      { status: 400 },
    );
  }
}

export async function PUT(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body =
      await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          error:
            "User ID is required.",
        },
        { status: 400 },
      );
    }

    const existing = await getUserById(body.id);

    if (!existing || existing.role !== "EDITOR") {
      return NextResponse.json(
        {
          error: "Only Editor accounts can be managed here.",
        },
        { status: 404 },
      );
    }

    const user =
      await updateUser(
        body.id,
        {
          name: body.name,
          email: body.email,
          password:
            body.password ||
            undefined,
          phone:
            body.phone,
          jobTitle:
            body.jobTitle,
          bio:
            body.bio,
          profileImageId:
            body.profileImageId,
        },
      );

    await recordActivity({
      actorId: access.user.id,
      action: "EDITOR_UPDATED",
      resourceType: "EDITOR",
      resourceId: user.id,
      summary: `Updated Editor account for ${user.name}.`,
      notifyUser: {
        userId: user.id,
        notification: {
          kind: "EDITOR_ACCOUNT_UPDATED",
          title: "Your Editor account was updated",
          message: "An administrator updated your account details.",
          href: "/admin/profile",
        },
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/users:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update user.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const { searchParams } =
      new URL(request.url);

    const id =
      searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error:
            "User ID is required.",
        },
        { status: 400 },
      );
    }

    const existing = await getUserById(id);

    if (!existing || existing.role !== "EDITOR") {
      return NextResponse.json(
        {
          error: "Only Editor accounts can be managed here.",
        },
        { status: 404 },
      );
    }

    await deleteUser(id);

    await recordActivity({
      actorId: access.user.id,
      action: "EDITOR_DELETED",
      resourceType: "EDITOR",
      resourceId: id,
      summary: `Deleted Editor account for ${existing.name}.`,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/users:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete user.",
      },
      { status: 400 },
    );
  }
}
