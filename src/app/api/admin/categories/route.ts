import { NextResponse } from "next/server";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "@/lib/data/categories";

const validLanguages = [
  "EN",
  "SI",
  "TA",
] as const;

type CategoryLanguage =
  (typeof validLanguages)[number];

function getValidLanguage(
  value: string | null,
): CategoryLanguage {
  if (
    value &&
    validLanguages.includes(
      value as CategoryLanguage,
    )
  ) {
    return value as CategoryLanguage;
  }

  return "EN";
}

/**
 * GET /api/admin/categories
 *
 * Example:
 * /api/admin/categories?language=EN
 * /api/admin/categories?language=SI
 * /api/admin/categories?language=TA
 */
export async function GET(
  request: Request,
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const language =
      getValidLanguage(
        searchParams.get("language"),
      );

    const categories =
      await getCategories(language);

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/categories:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load categories.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST /api/admin/categories
 */
export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

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
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/categories:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create category.",
      },
      {
        status: 400,
      },
    );
  }
}

/**
 * PUT /api/admin/categories
 */
export async function PUT(
  request: Request,
) {
  try {
    const body =
      await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Category ID is required.",
        },
        {
          status: 400,
        },
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
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update category.",
      },
      {
        status: 400,
      },
    );
  }
}

/**
 * DELETE /api/admin/categories?id=CATEGORY_ID
 */
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
          success: false,
          error:
            "Category ID is required.",
        },
        {
          status: 400,
        },
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
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete category.",
      },
      {
        status: 400,
      },
    );
  }
}