import { NextResponse } from "next/server";

import {
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/lib/data/categories";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const created =
      await createCategory({
        slug: body.slug,
        translations:
          body.translations,
      });

    const category =
      await getCategoryById(
        created.id,
        "EN",
      );

    return NextResponse.json(
      {
        success: true,
        category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/categories:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create category.",
      },
      { status: 400 },
    );
  }
}

export async function PUT(
  request: Request,
) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          error:
            "Category ID is required.",
        },
        { status: 400 },
      );
    }

    await updateCategory(
      body.id,
      {
        slug: body.slug,
        translations:
          body.translations,
      },
    );

    const category =
      await getCategoryById(
        body.id,
        "EN",
      );

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/categories:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update category.",
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
            "Category ID is required.",
        },
        { status: 400 },
      );
    }

    await deleteCategory(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/categories:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete category.",
      },
      { status: 400 },
    );
  }
}