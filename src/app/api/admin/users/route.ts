import { NextResponse } from "next/server";

import {
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/data/users";

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const user =
      await createUser({
        name: body.name,
        email: body.email,
        password: body.password,
        role:
          body.role ??
          "JOURNALIST",
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

    const user =
      await updateUser(
        body.id,
        {
          name: body.name,
          email: body.email,
          password:
            body.password ||
            undefined,
          role: body.role,
        },
      );

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

    await deleteUser(id);

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