import { NextResponse } from "next/server";

import {
  createVideoCategory,
  deleteVideoCategory,
  getVideoCategories,
  getVideoCategoryById,
  updateVideoCategory,
} from "@/lib/data/video-categories";

const validLanguages = [
  "EN",
  "SI",
  "TA",
] as const;

type VideoCategoryLanguage =
  (typeof validLanguages)[number];

function getValidLanguage(
  value: string | null,
): VideoCategoryLanguage {
  if (
    value &&
    validLanguages.includes(
      value as VideoCategoryLanguage,
    )
  ) {
    return value as VideoCategoryLanguage;
  }

  return "EN";
}

/**
 * GET /api/admin/video-categories
 *
 * Examples:
 * /api/admin/video-categories?language=EN
 * /api/admin/video-categories?language=SI
 * /api/admin/video-categories?language=TA
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
      await getVideoCategories(language);

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/video-categories:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load video categories.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST /api/admin/video-categories
 */
export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const created =
      await createVideoCategory({
        slug: body.slug,
        translations:
          body.translations,
      });

    const category =
      await getVideoCategoryById(
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
      "POST /api/admin/video-categories:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create video category.",
      },
      {
        status: 400,
      },
    );
  }
}

/**
 * PUT /api/admin/video-categories
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
            "Video category ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    await updateVideoCategory(
      body.id,
      {
        slug: body.slug,
        translations:
          body.translations,
      },
    );

    const category =
      await getVideoCategoryById(
        body.id,
        "EN",
      );

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/video-categories:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update video category.",
      },
      {
        status: 400,
      },
    );
  }
}

/**
 * DELETE /api/admin/video-categories?id=VIDEO_CATEGORY_ID
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
            "Video category ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    await deleteVideoCategory(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/video-categories:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete video category.",
      },
      {
        status: 400,
      },
    );
  }
}