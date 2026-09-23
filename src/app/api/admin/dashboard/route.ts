import { NextResponse } from "next/server";

import { requireContentApiAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type CategoryCount = {
  categoryId: string;
  _count: {
    _all: number;
  };
};

export async function GET() {
  const access = await requireContentApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const [
      totalNews,
      drafts,
      review,
      published,
      scheduled,
      archived,
      mediaCount,
      mediaSize,
      recentArticles,
      rawCategoryCounts,
      categories,
      categoryTranslations,
    ] = await Promise.all([
      /* =========================================================
         ARTICLE COUNTS
      ========================================================== */

      prisma.article.count(),

      prisma.article.count({
        where: {
          status: "DRAFT",
        },
      }),

      prisma.article.count({
        where: {
          status: "REVIEW",
        },
      }),

      prisma.article.count({
        where: {
          status: "PUBLISHED",
        },
      }),

      prisma.article.count({
        where: {
          status: "SCHEDULED",
        },
      }),

      prisma.article.count({
        where: {
          status: "ARCHIVED",
        },
      }),

      /* =========================================================
         MEDIA COUNT
      ========================================================== */

      prisma.media.count(),

      /* =========================================================
         MEDIA TOTAL SIZE
      ========================================================== */

      prisma.media.aggregate({
        _sum: {
          size: true,
        },
      }),

      /* =========================================================
         RECENT ARTICLES
      ========================================================== */

      prisma.article.findMany({
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        take: 5,
        select: {
          id: true,
          slug: true,
          status: true,
          categoryId: true,
          publishedAt: true,
          createdAt: true,
        },
      }),

      /* =========================================================
         ARTICLE COUNT BY CATEGORY
      ========================================================== */

      prisma.article.groupBy({
        by: ["categoryId"],
        _count: {
          _all: true,
        },
      }),

      /* =========================================================
         CATEGORIES
      ========================================================== */

      prisma.category.findMany({
        select: {
          id: true,
          slug: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      /* =========================================================
         CATEGORY TRANSLATIONS
      ========================================================== */

      prisma.categoryTranslation.findMany({
        select: {
          categoryId: true,
          language: true,
          name: true,
        },
      }),
    ]);

    /* =========================================================
       CATEGORY COUNT TYPE
    ========================================================== */

    const categoryCounts =
      rawCategoryCounts as CategoryCount[];

    /* =========================================================
       RECENT ARTICLE TRANSLATIONS
    ========================================================== */

    const recentArticleIds = recentArticles.map(
      (article) => article.id,
    );

    const recentTranslations =
      recentArticleIds.length > 0
        ? await prisma.articleTranslation.findMany({
            where: {
              articleId: {
                in: recentArticleIds,
              },
            },
            select: {
              articleId: true,
              language: true,
              title: true,
              summary: true,
            },
          })
        : [];

    /* =========================================================
       BUILD RECENT ARTICLES
    ========================================================== */

    const recent = recentArticles.map(
      (article) => {
        const translation =
          recentTranslations.find(
            (item) =>
              item.articleId === article.id &&
              String(item.language) === "EN",
          ) ??
          recentTranslations.find(
            (item) =>
              item.articleId === article.id,
          );

        const category =
          categories.find(
            (item) =>
              item.id === article.categoryId,
          );

        const categoryTranslation =
          categoryTranslations.find(
            (item) =>
              item.categoryId ===
                article.categoryId &&
              String(item.language) === "EN",
          ) ??
          categoryTranslations.find(
            (item) =>
              item.categoryId ===
              article.categoryId,
          );

        return {
          id: article.id,

          slug: article.slug,

          title:
            translation?.title ??
            article.slug,

          summary:
            translation?.summary ??
            null,

          status: article.status,

          category: category
            ? {
                id: category.id,

                slug: category.slug,

                name:
                  categoryTranslation?.name ??
                  category.slug,
              }
            : null,

          publishedAt:
            article.publishedAt,

          createdAt:
            article.createdAt,
        };
      },
    );

    /* =========================================================
       BUILD CATEGORY DATA
    ========================================================== */

    const categoryData =
      categories.map(
        (category) => {
          const categoryTranslation =
            categoryTranslations.find(
              (item) =>
                item.categoryId ===
                  category.id &&
                String(item.language) === "EN",
            ) ??
            categoryTranslations.find(
              (item) =>
                item.categoryId ===
                category.id,
            );

          const count =
            categoryCounts.find(
              (item) =>
                item.categoryId ===
                category.id,
            )?._count._all ?? 0;

          return {
            id: category.id,

            slug: category.slug,

            name:
              categoryTranslation?.name ??
              category.slug,

            count,
          };
        },
      );

    /* =========================================================
       MEDIA TOTAL SIZE
    ========================================================== */

    const totalMediaSizeBytes =
      mediaSize._sum.size ?? 0;

    /* =========================================================
       RESPONSE
    ========================================================== */

    return NextResponse.json({
      success: true,

      stats: {
        totalNews,
        drafts,
        review,
        published,
        scheduled,
        archived,
      },

      recentArticles: recent,

      categories: categoryData,

      media: {
        count: mediaCount,

        totalSizeBytes:
          totalMediaSizeBytes,
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to load dashboard data.",
      },
      {
        status: 500,
      },
    );
  }
}
