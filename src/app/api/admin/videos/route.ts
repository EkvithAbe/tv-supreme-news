import { NextResponse } from "next/server";

import {
  createVideo,
  deleteVideo,
  getVideoCategories,
  getVideoById,
  getVideos,
  updateVideo,
  updateVideoStatus,
  type VideoLanguageValue,
  type VideoStatusValue,
} from "@/lib/data/videos";

export const runtime = "nodejs";

const validLanguages: VideoLanguageValue[] = [
  "EN",
  "SI",
  "TA",
];

const validStatuses: VideoStatusValue[] = [
  "DRAFT",
  "REVIEW",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
];

function isValidLanguage(
  value: unknown,
): value is VideoLanguageValue {
  return (
    typeof value === "string" &&
    validLanguages.includes(
      value as VideoLanguageValue,
    )
  );
}

function isValidStatus(
  value: unknown,
): value is VideoStatusValue {
  return (
    typeof value === "string" &&
    validStatuses.includes(
      value as VideoStatusValue,
    )
  );
}

function parseDate(
  value: unknown,
): Date | null | undefined {
  if (
    value === undefined
  ) {
    return undefined;
  }

  if (
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(
      "Invalid date value.",
    );
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "Invalid date value.",
    );
  }

  return date;
}

function parseDuration(
  value: unknown,
): number | null | undefined {
  if (
    value === undefined
  ) {
    return undefined;
  }

  if (
    value === null ||
    value === ""
  ) {
    return null;
  }

  const duration = Number(value);

  if (
    !Number.isFinite(duration) ||
    duration < 0
  ) {
    throw new Error(
      "Duration must be a valid number of seconds.",
    );
  }

  return Math.floor(duration);
}

/**
 * GET /api/admin/videos
 *
 * Examples:
 * /api/admin/videos
 * /api/admin/videos?search=cricket
 * /api/admin/videos?status=PUBLISHED
 * /api/admin/videos?categoryId=abc
 * /api/admin/videos?language=EN
 */
export async function GET(
  request: Request,
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get(
        "search",
      ) ?? "";

    const statusParam =
      searchParams.get(
        "status",
      );

    const categoryId =
      searchParams.get(
        "categoryId",
      ) ?? undefined;

    const languageParam =
      searchParams.get(
        "language",
      );

    const pageParam = Number(
      searchParams.get(
        "page",
      ) ?? "1",
    );

    const pageSizeParam =
      Number(
        searchParams.get(
          "pageSize",
        ) ?? "100",
      );

    const page = Number.isFinite(
      pageParam,
    )
      ? pageParam
      : 1;

    const pageSize =
      Number.isFinite(
        pageSizeParam,
      )
        ? pageSizeParam
        : 100;

    const status =
      isValidStatus(statusParam)
        ? statusParam
        : undefined;

    const language =
      isValidLanguage(
        languageParam,
      )
        ? languageParam
        : undefined;

    const result =
      await getVideos({
        search,
        status,
        categoryId,
        language,
        page,
        pageSize,
      });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/videos error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load videos.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST /api/admin/videos
 *
 * JSON:
 * {
 *   "title": "...",
 *   "description": "...",
 *   "language": "EN",
 *   "status": "DRAFT",
 *   "categoryId": "...",
 *   "thumbnailId": "...",
 *   "videoUrl": "...",
 *   "duration": 252,
 *   "isFeatured": false,
 *   "publishedAt": "...",
 *   "scheduledAt": "..."
 * }
 */
export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const videoUrl =
      typeof body.videoUrl ===
      "string"
        ? body.videoUrl.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Video title is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!videoUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Video URL is required.",
        },
        {
          status: 400,
        },
      );
    }

    const language =
      body.language === undefined
        ? "EN"
        : body.language;

    if (
      !isValidLanguage(
        language,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid language.",
        },
        {
          status: 400,
        },
      );
    }

    const status =
      body.status === undefined
        ? "DRAFT"
        : body.status;

    if (
      !isValidStatus(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid video status.",
        },
        {
          status: 400,
        },
      );
    }

    const duration =
      parseDuration(
        body.duration,
      );

    const publishedAt =
      parseDate(
        body.publishedAt,
      );

    const scheduledAt =
      parseDate(
        body.scheduledAt,
      );

    const video =
      await createVideo({
        slug:
          typeof body.slug ===
          "string"
            ? body.slug
            : undefined,

        title,

        description:
          typeof body.description ===
          "string"
            ? body.description
            : null,

        language,

        status,

        categoryId:
          typeof body.categoryId ===
          "string"
            ? body.categoryId
            : null,

        thumbnailId:
          typeof body.thumbnailId ===
          "string"
            ? body.thumbnailId
            : null,

        videoUrl,

        duration,

        isFeatured:
          body.isFeatured === true,

        publishedAt,

        scheduledAt,
      });

    return NextResponse.json(
      {
        success: true,
        video,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/videos error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create video.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      },
    );
  }
}

/**
 * PUT /api/admin/videos
 *
 * Updates an existing video.
 */
export async function PUT(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Video ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const existing =
      await getVideoById(id);

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Video not found.",
        },
        {
          status: 404,
        },
      );
    }

    const updateData: {
      slug?: string;
      title?: string;
      description?: string | null;
      language?: VideoLanguageValue;
      status?: VideoStatusValue;
      categoryId?: string | null;
      thumbnailId?: string | null;
      videoUrl?: string;
      duration?: number | null;
      isFeatured?: boolean;
      publishedAt?: Date | null;
      scheduledAt?: Date | null;
    } = {};

    if (
      body.slug !== undefined
    ) {
      updateData.slug =
        typeof body.slug === "string"
          ? body.slug
          : "";
    }

    if (
      body.title !== undefined
    ) {
      updateData.title =
        typeof body.title === "string"
          ? body.title
          : "";
    }

    if (
      body.description !==
      undefined
    ) {
      updateData.description =
        typeof body.description ===
        "string"
          ? body.description
          : null;
    }

    if (
      body.language !==
      undefined
    ) {
      if (
        !isValidLanguage(
          body.language,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid language.",
          },
          {
            status: 400,
          },
        );
      }

      updateData.language =
        body.language;
    }

    if (
      body.status !==
      undefined
    ) {
      if (
        !isValidStatus(
          body.status,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid video status.",
          },
          {
            status: 400,
          },
        );
      }

      updateData.status =
        body.status;
    }

    if (
      body.categoryId !==
      undefined
    ) {
      updateData.categoryId =
        typeof body.categoryId ===
        "string"
          ? body.categoryId
          : null;
    }

    if (
      body.thumbnailId !==
      undefined
    ) {
      updateData.thumbnailId =
        typeof body.thumbnailId ===
        "string"
          ? body.thumbnailId
          : null;
    }

    if (
      body.videoUrl !==
      undefined
    ) {
      updateData.videoUrl =
        typeof body.videoUrl ===
        "string"
          ? body.videoUrl
          : "";
    }

    if (
      body.duration !==
      undefined
    ) {
      updateData.duration =
        parseDuration(
          body.duration,
        );
    }

    if (
      body.isFeatured !==
      undefined
    ) {
      updateData.isFeatured =
        body.isFeatured === true;
    }

    if (
      body.publishedAt !==
      undefined
    ) {
      updateData.publishedAt =
        parseDate(
          body.publishedAt,
        );
    }

    if (
      body.scheduledAt !==
      undefined
    ) {
      updateData.scheduledAt =
        parseDate(
          body.scheduledAt,
        );
    }

    const video =
      await updateVideo(
        id,
        updateData,
      );

    return NextResponse.json({
      success: true,
      video,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/videos error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update video.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      },
    );
  }
}

/**
 * DELETE /api/admin/videos?id=VIDEO_ID
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
          message:
            "Video ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const result =
      await deleteVideo(id);

    return NextResponse.json({
      success: true,
      message:
        "Video deleted successfully.",
      video: result.video,
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/videos error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete video.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      },
    );
  }
}

/**
 * PATCH /api/admin/videos
 *
 * Update status.
 *
 * JSON:
 * {
 *   "id": "...",
 *   "status": "PUBLISHED"
 * }
 */
export async function PATCH(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Video ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isValidStatus(
        body.status,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A valid video status is required.",
        },
        {
          status: 400,
        },
      );
    }

    const scheduledAt =
      parseDate(
        body.scheduledAt,
      );

    const video =
      await updateVideoStatus(
        id,
        body.status,
        scheduledAt,
      );

    return NextResponse.json({
      success: true,
      video,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/videos error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update video status.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      },
    );
  }
}