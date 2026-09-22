import { NextResponse } from "next/server";

import { requireAdminApiAccess } from "@/lib/auth";
import {
  createPage,
  deletePage,
  getPageById,
  getPages,
  updatePage,
  updatePageStatus,
  supportedLanguages,
  supportedStatuses,
  type PageLanguage,
  type PageStatusValue,
  type PageTranslationInput,
} from "@/lib/data/pages";

export const runtime = "nodejs";

/* ============================================================
   VALIDATION HELPERS
============================================================ */

function isValidLanguage(
  value: unknown,
): value is PageLanguage {
  return (
    typeof value === "string" &&
    supportedLanguages.includes(
      value as PageLanguage,
    )
  );
}

function isValidStatus(
  value: unknown,
): value is PageStatusValue {
  return (
    typeof value === "string" &&
    supportedStatuses.includes(
      value as PageStatusValue,
    )
  );
}

function getPageMutationErrorMessage(
  error: unknown,
  fallback: string,
) {
  const message =
    error instanceof Error ? error.message : "";

  if (
    message.includes("Page_slug_key") ||
    message.includes("Unique constraint failed") ||
    message.includes("already uses this URL slug")
  ) {
    return "A page already uses this URL slug. Choose a different slug or edit the existing page.";
  }

  const safeMessages = new Set([
    "Page not found.",
    "Page slug is required.",
    "Page title is required.",
    "Invalid page language.",
    "Invalid page status.",
  ]);

  return safeMessages.has(message) ? message : fallback;
}

/* ============================================================
   GET
   GET /api/admin/pages
============================================================ */

export async function GET(
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

    const languageParam =
      searchParams.get("language");

    let language: PageLanguage | undefined;

    if (languageParam) {
      if (!isValidLanguage(languageParam)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid language. Use EN, SI or TA.",
          },
          { status: 400 },
        );
      }

      language = languageParam;
    }

    const pages = await getPages(language);

    return NextResponse.json({
      success: true,
      pages,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/pages error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load pages.",
      },
      { status: 500 },
    );
  }
}

/* ============================================================
   POST
   POST /api/admin/pages
============================================================ */

export async function POST(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body = await request.json();

    const {
      slug,
      status,
      translations,
    } = body;

    if (
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Page slug is required.",
        },
        { status: 400 },
      );
    }

    if (
      status !== undefined &&
      !isValidStatus(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid page status. Use DRAFT or PUBLISHED.",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(translations)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Translations must be an array.",
        },
        { status: 400 },
      );
    }

    const cleanedTranslations: PageTranslationInput[] =
      [];

    for (const item of translations) {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid translation data.",
          },
          { status: 400 },
        );
      }

      const translation =
        item as Record<string, unknown>;

      if (
        !isValidLanguage(
          translation.language,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Each translation must use EN, SI or TA.",
          },
          { status: 400 },
        );
      }

      if (
        typeof translation.title !==
          "string" ||
        !translation.title.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Translation title is required.",
          },
          { status: 400 },
        );
      }

      cleanedTranslations.push({
        language:
          translation.language,
        title:
          translation.title.trim(),
        content:
          typeof translation.content ===
          "string"
            ? translation.content.trim()
            : "",
        seoTitle:
          typeof translation.seoTitle ===
          "string"
            ? translation.seoTitle.trim()
            : "",
        seoDescription:
          typeof translation.seoDescription ===
          "string"
            ? translation.seoDescription.trim()
            : "",
      });
    }

    if (
      cleanedTranslations.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "At least one translation is required.",
        },
        { status: 400 },
      );
    }

    const page = await createPage({
      slug: slug.trim(),
      status:
        status ?? "DRAFT",
      translations:
        cleanedTranslations,
    });

    return NextResponse.json(
      {
        success: true,
        page,
        message:
          "Page created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/pages error:",
      error,
    );

    const message = getPageMutationErrorMessage(
      error,
      "Failed to create page.",
    );

    const statusCode = message.includes("already uses")
      ? 409
      : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}

/* ============================================================
   PUT
   PUT /api/admin/pages
============================================================ */

export async function PUT(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body = await request.json();

    const {
      pageId,
      slug,
      status,
      translation,
    } = body;

    if (
      typeof pageId !== "string" ||
      !pageId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Page ID is required.",
        },
        { status: 400 },
      );
    }

    if (
      status !== undefined &&
      !isValidStatus(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid page status. Use DRAFT or PUBLISHED.",
        },
        { status: 400 },
      );
    }

    let cleanedTranslation:
      | PageTranslationInput
      | undefined;

    if (translation !== undefined) {
      if (
        !translation ||
        typeof translation !== "object"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid translation data.",
          },
          { status: 400 },
        );
      }

      if (
        !isValidLanguage(
          translation.language,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Translation language must be EN, SI or TA.",
          },
          { status: 400 },
        );
      }

      if (
        typeof translation.title !==
          "string" ||
        !translation.title.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Translation title is required.",
          },
          { status: 400 },
        );
      }

      cleanedTranslation = {
        language:
          translation.language,
        title:
          translation.title.trim(),
        content:
          typeof translation.content ===
          "string"
            ? translation.content.trim()
            : "",
        seoTitle:
          typeof translation.seoTitle ===
          "string"
            ? translation.seoTitle.trim()
            : "",
        seoDescription:
          typeof translation.seoDescription ===
          "string"
            ? translation.seoDescription.trim()
            : "",
      };
    }

    const page = await updatePage({
      pageId: pageId.trim(),

      ...(typeof slug === "string"
        ? {
            slug: slug.trim(),
          }
        : {}),

      ...(status !== undefined
        ? {
            status,
          }
        : {}),

      ...(cleanedTranslation
        ? {
            translation:
              cleanedTranslation,
          }
        : {}),
    });

    return NextResponse.json({
      success: true,
      page,
      message:
        "Page updated successfully.",
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/pages error:",
      error,
    );

    const message = getPageMutationErrorMessage(
      error,
      "Failed to update page.",
    );

    const statusCode =
      message.includes("already uses")
        ? 409
        : message
              .toLowerCase()
              .includes("not found")
          ? 404
          : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}

/* ============================================================
   DELETE
   DELETE /api/admin/pages?pageId=...
============================================================ */

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

    const pageId =
      searchParams.get("pageId");

    if (!pageId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Page ID is required.",
        },
        { status: 400 },
      );
    }

    await deletePage(pageId);

    return NextResponse.json({
      success: true,
      message:
        "Page deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/pages error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete page.";

    const statusCode =
      message
        .toLowerCase()
        .includes("not found")
        ? 404
        : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}

/* ============================================================
   PATCH
   PATCH /api/admin/pages
   Used for changing page status.
============================================================ */

export async function PATCH(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body = await request.json();

    const {
      pageId,
      status,
    } = body;

    if (
      typeof pageId !== "string" ||
      !pageId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Page ID is required.",
        },
        { status: 400 },
      );
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid page status. Use DRAFT or PUBLISHED.",
        },
        { status: 400 },
      );
    }

    const page =
      await updatePageStatus(
        pageId.trim(),
        status,
      );

    return NextResponse.json({
      success: true,
      page,
      message:
        status === "PUBLISHED"
          ? "Page published successfully."
          : "Page moved to draft successfully.",
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/pages error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update page status.";

    const statusCode =
      message
        .toLowerCase()
        .includes("not found")
        ? 404
        : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}
