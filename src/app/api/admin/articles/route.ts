import { NextResponse } from "next/server";

import {
  isAdmin,
  requireContentApiAccess,
} from "@/lib/auth";
import {
  createArticle,
  deleteArticle,
  getArticles,
  updateArticle,
  updateArticleStatus,
} from "@/lib/data/articles";
import { recordActivity } from "@/lib/data/activity";

/**
 * GET /api/admin/articles
 *
 * Returns articles from MySQL.
 */
export async function GET(request: Request) {
  const access =
    await requireContentApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || undefined;

    const statusParam =
      searchParams.get("status");

    const categoryId =
      searchParams.get("categoryId") || undefined;

    const pageParam =
      Number(searchParams.get("page") || "1");

    const pageSizeParam =
      Number(searchParams.get("pageSize") || "20");

    const validStatuses = [
      "DRAFT",
      "REVIEW",
      "APPROVED",
      "SCHEDULED",
      "PUBLISHED",
      "ARCHIVED",
    ] as const;

    const status =
      statusParam &&
      validStatuses.includes(
        statusParam as (typeof validStatuses)[number],
      )
        ? (statusParam as (typeof validStatuses)[number])
        : undefined;

    const page =
      Number.isFinite(pageParam) && pageParam > 0
        ? Math.floor(pageParam)
        : 1;

    const pageSize =
      Number.isFinite(pageSizeParam) &&
      pageSizeParam > 0
        ? Math.floor(pageSizeParam)
        : 20;

    const result = await getArticles({
      language: "EN",
      search,
      status,
      categoryId,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/articles:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load articles.",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/articles
 *
 * Creates a new article in MySQL.
 */
export async function POST(
  request: Request,
) {
  const access =
    await requireContentApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body =
      await request.json();

    const canManageHomepage = isAdmin(
      access.user,
    );

    if (
      !body.slug ||
      !body.categoryId ||
      (canManageHomepage &&
        !body.authorId)
    ) {
      return NextResponse.json(
        {
          error:
            "Slug, category and author are required.",
        },
        { status: 400 },
      );
    }

    const article =
      await createArticle({
        slug: body.slug,

        categoryId:
          body.categoryId,

        authorId:
          canManageHomepage
            ? body.authorId
            : access.user.id,

        mainImageId:
          body.mainImageId ??
          undefined,

        status:
          body.status ?? "DRAFT",

        isBreaking:
          canManageHomepage
            ? (body.isBreaking ?? false)
            : false,

        isFeatured:
          canManageHomepage
            ? (body.isFeatured ?? false)
            : false,

        showOnHomepage:
          canManageHomepage
            ? (body.showOnHomepage ?? false)
            : false,

        showInLatest:
          body.showInLatest ??
          true,

        publishedAt:
          body.publishedAt ??
          undefined,

        scheduledAt:
          body.scheduledAt ??
          undefined,

        translations:
          body.translations ??
          [],

        tags:
          Array.isArray(body.tags)
            ? body.tags
            : [],

        mediaIds:
          Array.isArray(body.mediaIds)
            ? body.mediaIds
            : [],
      });

    if (article) {
      const action =
        body.status === "SCHEDULED"
          ? "ARTICLE_SCHEDULED"
          : body.status === "PUBLISHED"
            ? "ARTICLE_PUBLISHED"
            : "ARTICLE_CREATED";

      await recordActivity({
        actorId: access.user.id,
        action,
        resourceType: "ARTICLE",
        resourceId: article.id,
        summary: `${action === "ARTICLE_SCHEDULED" ? "Scheduled" : action === "ARTICLE_PUBLISHED" ? "Published" : "Created"} article: ${article.title}`,
        notifyAdmins: {
          kind: "EDITOR_ARTICLE_ACTIVITY",
          title: "Article activity",
          message: `${access.user.name}: ${article.title}`,
          href: `/admin/news/edit/${article.id}`,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        article,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/articles:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create article.",
      },
      { status: 400 },
    );
  }
}

/**
 * PUT /api/admin/articles
 *
 * Updates an existing article in MySQL.
 *
 * Body example:
 * {
 *   "id": "article-id",
 *   "slug": "...",
 *   "categoryId": "...",
 *   "authorId": "...",
 *   "status": "DRAFT",
 *   "translations": [...]
 * }
 */
export async function PUT(
  request: Request,
) {
  const access =
    await requireContentApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body =
      await request.json();

    const canManageHomepage = isAdmin(
      access.user,
    );

    if (!body.id) {
      return NextResponse.json(
        {
          error:
            "Article id is required.",
        },
        { status: 400 },
      );
    }

    const article =
      await updateArticle(
        body.id,
        {
          ...(body.slug !== undefined
            ? {
                slug: body.slug,
              }
            : {}),

          ...(body.categoryId !== undefined
            ? {
                categoryId:
                  body.categoryId,
              }
            : {}),

          ...(canManageHomepage &&
          body.authorId !== undefined
            ? {
                authorId:
                  body.authorId,
              }
            : {}),

          ...(body.mainImageId !== undefined
            ? {
                mainImageId:
                  body.mainImageId,
              }
            : {}),

          ...(body.status !== undefined
            ? {
                status:
                  body.status,
              }
            : {}),

          ...(canManageHomepage &&
          body.isBreaking !== undefined
            ? {
                isBreaking:
                  body.isBreaking,
              }
            : {}),

          ...(canManageHomepage &&
          body.isFeatured !== undefined
            ? {
                isFeatured:
                  body.isFeatured,
              }
            : {}),

          ...(canManageHomepage &&
          body.showOnHomepage !== undefined
            ? {
                showOnHomepage:
                  body.showOnHomepage,
              }
            : {}),

          ...(body.showInLatest !== undefined
            ? {
                showInLatest:
                  body.showInLatest,
              }
            : {}),

          ...(body.publishedAt !== undefined
            ? {
                publishedAt:
                  body.publishedAt,
              }
            : {}),

          ...(body.scheduledAt !== undefined
            ? {
                scheduledAt:
                  body.scheduledAt,
              }
            : {}),

          ...(body.translations !== undefined
            ? {
                translations:
                  Array.isArray(
                    body.translations,
                  )
                    ? body.translations
                    : [],
              }
            : {}),

          ...(body.tags !== undefined
            ? {
                tags: Array.isArray(
                  body.tags,
                )
                  ? body.tags
                  : [],
              }
            : {}),

          ...(body.mediaIds !== undefined
            ? {
                mediaIds: Array.isArray(
                  body.mediaIds,
                )
                  ? body.mediaIds
                  : [],
              }
            : {}),
        },
      );

    if (article) {
      const action =
        body.status === "SCHEDULED"
          ? "ARTICLE_SCHEDULED"
          : body.status === "PUBLISHED"
            ? "ARTICLE_PUBLISHED"
            : "ARTICLE_UPDATED";

      await recordActivity({
        actorId: access.user.id,
        action,
        resourceType: "ARTICLE",
        resourceId: article.id,
        summary: `${action === "ARTICLE_SCHEDULED" ? "Scheduled" : action === "ARTICLE_PUBLISHED" ? "Published" : "Updated"} article: ${article.title}`,
        notifyAdmins: {
          kind: "EDITOR_ARTICLE_ACTIVITY",
          title: "Article activity",
          message: `${access.user.name}: ${article.title}`,
          href: `/admin/news/edit/${article.id}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/articles:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update article.",
      },
      { status: 400 },
    );
  }
}

/**
 * DELETE /api/admin/articles
 *
 * Deletes an article from MySQL.
 *
 * Body:
 * {
 *   "id": "article-id"
 * }
 */
export async function DELETE(
  request: Request,
) {
  const access =
    await requireContentApiAccess();

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
            "Article id is required.",
        },
        { status: 400 },
      );
    }

    await deleteArticle(
      body.id,
    );

    await recordActivity({
      actorId: access.user.id,
      action: "ARTICLE_DELETED",
      resourceType: "ARTICLE",
      resourceId: body.id,
      summary: "Deleted an article.",
      notifyAdmins: {
        kind: "EDITOR_ARTICLE_ACTIVITY",
        title: "Article deleted",
        message: `${access.user.name} deleted an article.`,
        href: "/admin/news",
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Article deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/articles:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete article.",
      },
      { status: 400 },
    );
  }
}

/**
 * PATCH /api/admin/articles
 *
 * Changes only the status of an article.
 *
 * Body:
 * {
 *   "id": "article-id",
 *   "status": "PUBLISHED"
 * }
 */
export async function PATCH(
  request: Request,
) {
  const access =
    await requireContentApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body =
      await request.json();

    if (!body.id || !body.status) {
      return NextResponse.json(
        {
          error:
            "Article id and status are required.",
        },
        { status: 400 },
      );
    }

    const validStatuses = [
      "DRAFT",
      "REVIEW",
      "APPROVED",
      "SCHEDULED",
      "PUBLISHED",
      "ARCHIVED",
    ] as const;

    if (
      !validStatuses.includes(
        body.status,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid article status.",
        },
        { status: 400 },
      );
    }

    const article =
      await updateArticleStatus(
        body.id,
        body.status,
      );

    if (article) {
      await recordActivity({
        actorId: access.user.id,
        action: `ARTICLE_STATUS_${body.status}`,
        resourceType: "ARTICLE",
        resourceId: article.id,
        summary: `Changed article status to ${body.status}: ${article.title}`,
        notifyAdmins: {
          kind: "EDITOR_ARTICLE_ACTIVITY",
          title: "Article status changed",
          message: `${access.user.name}: ${article.title}`,
          href: `/admin/news/edit/${article.id}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/articles:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update article status.",
      },
      { status: 400 },
    );
  }
}
