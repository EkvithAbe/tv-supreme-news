import "server-only";

import { prisma } from "@/lib/prisma";
import {
  ArticleStatus,
  Language,
} from "../../../generated/prisma/client";

export type SupportedLanguage = "EN" | "SI" | "TA";

export type ArticleStatusValue =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED";

export interface ArticleTranslationInput {
  language: SupportedLanguage;
  title: string;
  summary?: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CreateArticleInput {
  slug: string;
  categoryId: string;
  authorId: string;
  mainImageId?: string;

  status?: ArticleStatusValue;

  isBreaking?: boolean;
  isFeatured?: boolean;
  showOnHomepage?: boolean;
  showInLatest?: boolean;

  publishedAt?: Date | string;
  scheduledAt?: Date | string;

  translations: ArticleTranslationInput[];

  tags?: string[];
  mediaIds?: string[];
}

export interface UpdateArticleInput {
  slug?: string;
  categoryId?: string;
  authorId?: string;
  mainImageId?: string | null;

  status?: ArticleStatusValue;

  isBreaking?: boolean;
  isFeatured?: boolean;
  showOnHomepage?: boolean;
  showInLatest?: boolean;

  publishedAt?: Date | string | null;
  scheduledAt?: Date | string | null;

  translations?: ArticleTranslationInput[];

  tags?: string[];
  mediaIds?: string[];
}

export interface GetArticlesOptions {
  language?: SupportedLanguage;
  status?: ArticleStatusValue;
  categoryId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

function getLanguageEnum(
  language: SupportedLanguage,
): Language {
  return Language[language];
}

function getArticleStatusEnum(
  status: ArticleStatusValue,
): ArticleStatus {
  return ArticleStatus[status];
}

function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseOptionalDate(
  value?: Date | string | null,
): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }

  return parsed;
}

function cleanTags(tags: string[] = []) {
  const unique = new Map<string, string>();

  for (const tag of tags) {
    const name = tag.trim();

    if (!name) {
      continue;
    }

    const key = name.toLowerCase();

    if (!unique.has(key)) {
      unique.set(key, name);
    }
  }

  return Array.from(unique.values());
}

function getDisplayTranslation(
  translations: Array<{
    language: Language;
    title: string;
    summary: string | null;
    content: string;
    seoTitle: string | null;
    seoDescription: string | null;
  }>,
  language: SupportedLanguage,
) {
  return (
    translations.find(
      (translation) =>
        translation.language ===
        getLanguageEnum(language),
    ) ??
    translations.find(
      (translation) =>
        translation.language === Language.EN,
    ) ??
    null
  );
}

/* =========================================================
   AUTHORS
========================================================= */

export async function getArticleAuthors() {
  return prisma.user.findMany({
    where: {
      role: {
        in: [
          "ADMIN",
          "EDITOR",
          "JOURNALIST",
        ],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

/* =========================================================
   GET ARTICLE BY ID
========================================================= */

export async function getArticleById(
  id: string,
  language: SupportedLanguage = "EN",
) {
  const article =
    await prisma.article.findUnique({
      where: { id },
    });

  if (!article) {
    return null;
  }

  const [
    translations,
    category,
    categoryTranslations,
    author,
    mainImage,
    articleTags,
    articleMedia,
  ] = await Promise.all([
    prisma.articleTranslation.findMany({
      where: { articleId: id },
      orderBy: { language: "asc" },
    }),

    prisma.category.findUnique({
      where: {
        id: article.categoryId,
      },
    }),

    prisma.categoryTranslation.findMany({
      where: {
        categoryId: article.categoryId,
      },
      orderBy: { language: "asc" },
    }),

    prisma.user.findUnique({
      where: {
        id: article.authorId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    }),

    article.mainImageId
      ? prisma.media.findUnique({
          where: {
            id: article.mainImageId,
          },
        })
      : null,

    prisma.articleTag.findMany({
      where: {
        articleId: id,
      },
    }),

    prisma.articleMedia.findMany({
      where: {
        articleId: id,
      },
      orderBy: {
        sortOrder: "asc",
      },
    }),
  ]);

  const tagIds = articleTags.map(
    (item) => item.tagId,
  );

  const tags =
    tagIds.length > 0
      ? await prisma.tag.findMany({
          where: {
            id: {
              in: tagIds,
            },
          },
        })
      : [];

  const mediaIds = articleMedia.map(
    (item) => item.mediaId,
  );

  const media =
    mediaIds.length > 0
      ? await prisma.media.findMany({
          where: {
            id: {
              in: mediaIds,
            },
          },
        })
      : [];

  const displayTranslation =
    getDisplayTranslation(
      translations,
      language,
    );

  const categoryTranslation =
    categoryTranslations.find(
      (translation) =>
        translation.language ===
        getLanguageEnum(language),
    ) ??
    categoryTranslations.find(
      (translation) =>
        translation.language === Language.EN,
    );

  return {
    id: article.id,
    slug: article.slug,

    status: article.status,

    categoryId: article.categoryId,
    authorId: article.authorId,
    mainImageId: article.mainImageId,

    isBreaking: article.isBreaking,
    isFeatured: article.isFeatured,
    showOnHomepage: article.showOnHomepage,
    showInLatest: article.showInLatest,

    views: article.views,

    publishedAt: article.publishedAt,
    scheduledAt: article.scheduledAt,

    createdAt: article.createdAt,
    updatedAt: article.updatedAt,

    language,

    title:
      displayTranslation?.title ??
      article.slug,

    summary:
      displayTranslation?.summary ??
      null,

    content:
      displayTranslation?.content ??
      "",

    seoTitle:
      displayTranslation?.seoTitle ??
      null,

    seoDescription:
      displayTranslation?.seoDescription ??
      null,

    translations,

    category: category
      ? {
          id: category.id,
          slug: category.slug,
          name:
            categoryTranslation?.name ??
            category.slug,
          description:
            categoryTranslation?.description ??
            null,
          translations:
            categoryTranslations,
        }
      : null,

    author,

    mainImage,

    tags,

    media,
  };
}

/* =========================================================
   GET ARTICLE BY SLUG
========================================================= */

export async function getArticleBySlug(
  slug: string,
  language: SupportedLanguage = "EN",
) {
  const article =
    await prisma.article.findUnique({
      where: {
        slug: normalizeSlug(slug),
      },
      select: {
        id: true,
      },
    });

  if (!article) {
    return null;
  }

  return getArticleById(
    article.id,
    language,
  );
}

/* =========================================================
   GET ARTICLES
========================================================= */

export async function getArticles(
  options: GetArticlesOptions = {},
) {
  const {
    language = "EN",
    status,
    categoryId,
    search,
    page = 1,
    pageSize = 20,
  } = options;

  const currentPage =
    Math.max(1, page);

  const currentPageSize =
    Math.min(
      100,
      Math.max(1, pageSize),
    );

  const where: {
    status?: ArticleStatus;
    categoryId?: string;
  } = {};

  if (status) {
    where.status =
      getArticleStatusEnum(status);
  }

  if (categoryId) {
    where.categoryId =
      categoryId;
  }

  if (search?.trim()) {
    const text =
      search.trim();

    const matches =
      await prisma.articleTranslation.findMany(
        {
          where: {
            OR: [
              {
                title: {
                  contains: text,
                  mode: "insensitive",
                },
              },
              {
                summary: {
                  contains: text,
                  mode: "insensitive",
                },
              },
              {
                content: {
                  contains: text,
                  mode: "insensitive",
                },
              },
            ],
          },
          select: {
            articleId: true,
          },
        },
      );

    const matchingIds =
      Array.from(
        new Set(
          matches.map(
            (item) =>
              item.articleId,
          ),
        ),
      );

    if (matchingIds.length === 0) {
      return {
        articles: [],
        total: 0,
        page: currentPage,
        pageSize: currentPageSize,
        totalPages: 0,
      };
    }

    return getArticlesByIds(
      matchingIds,
      where,
      language,
      currentPage,
      currentPageSize,
    );
  }

  const total =
    await prisma.article.count({
      where,
    });

  const articles =
    await prisma.article.findMany({
      where,
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip:
        (currentPage - 1) *
        currentPageSize,
      take: currentPageSize,
      select: {
        id: true,
      },
    });

  const articleResults =
    await Promise.all(
      articles.map(
        (article) =>
          getArticleById(
            article.id,
            language,
          ),
      ),
    );

  return {
    articles:
      articleResults.filter(
        (
          article,
        ): article is NonNullable<
          typeof article
        > => article !== null,
      ),
    total,
    page: currentPage,
    pageSize: currentPageSize,
    totalPages:
      Math.ceil(
        total / currentPageSize,
      ),
  };
}

async function getArticlesByIds(
  ids: string[],
  where: {
    status?: ArticleStatus;
    categoryId?: string;
  },
  language: SupportedLanguage,
  page: number,
  pageSize: number,
) {
  const finalWhere = {
    ...where,
    id: {
      in: ids,
    },
  };

  const total =
    await prisma.article.count({
      where: finalWhere,
    });

  const articles =
    await prisma.article.findMany({
      where: finalWhere,
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip:
        (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
      },
    });

  const articleResults =
    await Promise.all(
      articles.map(
        (article) =>
          getArticleById(
            article.id,
            language,
          ),
      ),
    );

  return {
    articles:
      articleResults.filter(
        (
          article,
        ): article is NonNullable<
          typeof article
        > => article !== null,
      ),
    total,
    page,
    pageSize,
    totalPages:
      Math.ceil(
        total / pageSize,
      ),
  };
}

/* =========================================================
   CREATE ARTICLE
========================================================= */

export async function createArticle(
  input: CreateArticleInput,
) {
  const slug =
    normalizeSlug(input.slug);

  if (!slug) {
    throw new Error(
      "Article slug is required.",
    );
  }

  if (
    input.translations.length === 0
  ) {
    throw new Error(
      "At least one article translation is required.",
    );
  }

  const english =
    input.translations.find(
      (translation) =>
        translation.language === "EN",
    );

  if (!english?.title.trim()) {
    throw new Error(
      "English article title is required.",
    );
  }

  if (!english.content.trim()) {
    throw new Error(
      "English article content is required.",
    );
  }

  const languages =
    new Set<SupportedLanguage>();

  for (
    const translation of
      input.translations
  ) {
    if (
      languages.has(
        translation.language,
      )
    ) {
      throw new Error(
        `Duplicate translation language: ${translation.language}`,
      );
    }

    languages.add(
      translation.language,
    );
  }

  const existing =
    await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

  if (existing) {
    throw new Error(
      `An article with slug "${slug}" already exists.`,
    );
  }

  const category =
    await prisma.category.findUnique({
      where: {
        id: input.categoryId,
      },
      select: { id: true },
    });

  if (!category) {
    throw new Error(
      "Selected category was not found.",
    );
  }

  const author =
    await prisma.user.findUnique({
      where: {
        id: input.authorId,
      },
      select: { id: true },
    });

  if (!author) {
    throw new Error(
      "Selected author was not found.",
    );
  }

  const status =
    input.status ?? "DRAFT";

  const publishedAt =
    parseOptionalDate(
      input.publishedAt,
    );

  const scheduledAt =
    parseOptionalDate(
      input.scheduledAt,
    );

  const finalPublishedAt =
    status === "PUBLISHED"
      ? publishedAt ?? new Date()
      : publishedAt;

  const articleId =
    await prisma.$transaction(
      async (tx) => {
        const article =
          await tx.article.create({
            data: {
              slug,

              status:
                getArticleStatusEnum(
                  status,
                ),

              categoryId:
                input.categoryId,

              authorId:
                input.authorId,

              mainImageId:
                input.mainImageId ??
                null,

              isBreaking:
                input.isBreaking ??
                false,

              isFeatured:
                input.isFeatured ??
                false,

              showOnHomepage:
                input.showOnHomepage ??
                false,

              showInLatest:
                input.showInLatest ??
                true,

              publishedAt:
                finalPublishedAt ??
                null,

              scheduledAt:
                scheduledAt ??
                null,
            },
          });

        await tx.articleTranslation.createMany(
          {
            data:
              input.translations.map(
                (translation) => ({
                  articleId:
                    article.id,

                  language:
                    getLanguageEnum(
                      translation.language,
                    ),

                  title:
                    translation.title.trim(),

                  summary:
                    translation.summary?.trim() ||
                    null,

                  content:
                    translation.content.trim(),

                  seoTitle:
                    translation.seoTitle?.trim() ||
                    null,

                  seoDescription:
                    translation.seoDescription?.trim() ||
                    null,
                }),
              ),
          },
        );

        const tags =
          cleanTags(
            input.tags ?? [],
          );

        for (const tagName of tags) {
          const tagSlug =
            normalizeSlug(
              tagName,
            );

          if (!tagSlug) {
            continue;
          }

          const tag =
            await tx.tag.upsert(
              {
                where: {
                  slug: tagSlug,
                },
                update: {
                  name: tagName,
                },
                create: {
                  slug: tagSlug,
                  name: tagName,
                },
              },
            );

          await tx.articleTag.create({
            data: {
              articleId:
                article.id,
              tagId: tag.id,
            },
          });
        }

        if (
          input.mediaIds &&
          input.mediaIds.length > 0
        ) {
          const mediaIds =
            Array.from(
              new Set(
                input.mediaIds,
              ),
            );

          await tx.articleMedia.createMany(
            {
              data: mediaIds.map(
                (
                  mediaId,
                  index,
                ) => ({
                  articleId:
                    article.id,
                  mediaId,
                  sortOrder: index,
                }),
              ),
            },
          );
        }

        return article.id;
      },
    );

  return getArticleById(
    articleId,
    "EN",
  );
}

/* =========================================================
   UPDATE ARTICLE
========================================================= */

export async function updateArticle(
  id: string,
  input: UpdateArticleInput,
) {
  const existing =
    await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        publishedAt: true,
      },
    });

  if (!existing) {
    throw new Error(
      "Article not found.",
    );
  }

  const slug =
    input.slug !== undefined
      ? normalizeSlug(input.slug)
      : undefined;

  if (slug) {
    const duplicate =
      await prisma.article.findFirst({
        where: {
          slug,
          NOT: { id },
        },
        select: { id: true },
      });

    if (duplicate) {
      throw new Error(
        `An article with slug "${slug}" already exists.`,
      );
    }
  }

  if (
    input.categoryId !== undefined
  ) {
    const category =
      await prisma.category.findUnique({
        where: {
          id: input.categoryId,
        },
        select: { id: true },
      });

    if (!category) {
      throw new Error(
        "Selected category was not found.",
      );
    }
  }

  if (
    input.authorId !== undefined
  ) {
    const author =
      await prisma.user.findUnique({
        where: {
          id: input.authorId,
        },
        select: { id: true },
      });

    if (!author) {
      throw new Error(
        "Selected author was not found.",
      );
    }
  }

  const newStatus =
    input.status;

  const publishDate =
    parseOptionalDate(
      input.publishedAt,
    );

  const scheduledDate =
    parseOptionalDate(
      input.scheduledAt,
    );

  await prisma.$transaction(
    async (tx) => {
      await tx.article.update({
        where: { id },

        data: {
          ...(slug
            ? { slug }
            : {}),

          ...(input.categoryId !==
          undefined
            ? {
                categoryId:
                  input.categoryId,
              }
            : {}),

          ...(input.authorId !==
          undefined
            ? {
                authorId:
                  input.authorId,
              }
            : {}),

          ...(input.mainImageId !==
          undefined
            ? {
                mainImageId:
                  input.mainImageId,
              }
            : {}),

          ...(newStatus !==
          undefined
            ? {
                status:
                  getArticleStatusEnum(
                    newStatus,
                  ),
              }
            : {}),

          ...(input.isBreaking !==
          undefined
            ? {
                isBreaking:
                  input.isBreaking,
              }
            : {}),

          ...(input.isFeatured !==
          undefined
            ? {
                isFeatured:
                  input.isFeatured,
              }
            : {}),

          ...(input.showOnHomepage !==
          undefined
            ? {
                showOnHomepage:
                  input.showOnHomepage,
              }
            : {}),

          ...(input.showInLatest !==
          undefined
            ? {
                showInLatest:
                  input.showInLatest,
              }
            : {}),

          ...(input.publishedAt !==
          undefined
            ? {
                publishedAt:
                  publishDate ??
                  null,
              }
            : {}),

          ...(input.scheduledAt !==
          undefined
            ? {
                scheduledAt:
                  scheduledDate ??
                  null,
              }
            : {}),
        },
      });

      if (input.translations) {
        for (
          const translation of
            input.translations
        ) {
          await tx.articleTranslation.upsert(
            {
              where: {
                articleId_language: {
                  articleId: id,
                  language:
                    getLanguageEnum(
                      translation.language,
                    ),
                },
              },

              update: {
                title:
                  translation.title.trim(),

                summary:
                  translation.summary?.trim() ||
                  null,

                content:
                  translation.content.trim(),

                seoTitle:
                  translation.seoTitle?.trim() ||
                  null,

                seoDescription:
                  translation.seoDescription?.trim() ||
                  null,
              },

              create: {
                articleId: id,

                language:
                  getLanguageEnum(
                    translation.language,
                  ),

                title:
                  translation.title.trim(),

                summary:
                  translation.summary?.trim() ||
                  null,

                content:
                  translation.content.trim(),

                seoTitle:
                  translation.seoTitle?.trim() ||
                  null,

                seoDescription:
                  translation.seoDescription?.trim() ||
                  null,
              },
            },
          );
        }
      }

      if (input.tags) {
        await tx.articleTag.deleteMany({
          where: {
            articleId: id,
          },
        });

        const tags =
          cleanTags(input.tags);

        for (const tagName of tags) {
          const tagSlug =
            normalizeSlug(
              tagName,
            );

          if (!tagSlug) {
            continue;
          }

          const tag =
            await tx.tag.upsert(
              {
                where: {
                  slug: tagSlug,
                },
                update: {
                  name: tagName,
                },
                create: {
                  slug: tagSlug,
                  name: tagName,
                },
              },
            );

          await tx.articleTag.create({
            data: {
              articleId: id,
              tagId: tag.id,
            },
          });
        }
      }

      if (input.mediaIds) {
        await tx.articleMedia.deleteMany(
          {
            where: {
              articleId: id,
            },
          },
        );

        const mediaIds =
          Array.from(
            new Set(
              input.mediaIds,
            ),
          );

        if (mediaIds.length > 0) {
          await tx.articleMedia.createMany(
            {
              data: mediaIds.map(
                (
                  mediaId,
                  index,
                ) => ({
                  articleId: id,
                  mediaId,
                  sortOrder: index,
                }),
              ),
            },
          );
        }
      }
    },
  );

  return getArticleById(
    id,
    "EN",
  );
}

/* =========================================================
   DELETE ARTICLE
========================================================= */

export async function deleteArticle(
  id: string,
) {
  const article =
    await prisma.article.findUnique({
      where: { id },
      select: { id: true },
    });

  if (!article) {
    throw new Error(
      "Article not found.",
    );
  }

  return prisma.article.delete({
    where: { id },
  });
}

/* =========================================================
   STATUS
========================================================= */

export async function updateArticleStatus(
  id: string,
  status: ArticleStatusValue,
) {
  const article =
    await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        publishedAt: true,
      },
    });

  if (!article) {
    throw new Error(
      "Article not found.",
    );
  }

  await prisma.article.update({
    where: { id },

    data: {
      status:
        getArticleStatusEnum(status),

      ...(status === "PUBLISHED" &&
      !article.publishedAt
        ? {
            publishedAt:
              new Date(),
          }
        : {}),
    },
  });

  return getArticleById(
    id,
    "EN",
  );
}

/* =========================================================
   VIEWS
========================================================= */

export async function incrementArticleViews(
  id: string,
) {
  const article =
    await prisma.article.findUnique({
      where: { id },
      select: { id: true },
    });

  if (!article) {
    return null;
  }

  return prisma.article.update({
    where: { id },

    data: {
      views: {
        increment: 1,
      },
    },

    select: {
      id: true,
      views: true,
    },
  });
}