import { prisma } from "@/lib/prisma";
import { Language } from "../../../generated/prisma/client";

export type SupportedLanguage = "EN" | "SI" | "TA";

export interface CategoryTranslationInput {
  language: SupportedLanguage;
  name: string;
  description?: string;
}

export interface CreateCategoryInput {
  slug: string;
  translations: CategoryTranslationInput[];
}

export interface UpdateCategoryInput {
  slug?: string;
  translations?: CategoryTranslationInput[];
}

/**
 * Convert a category slug into a clean URL slug.
 *
 * Example:
 * "Sri Lanka News" -> "sri-lanka-news"
 */
function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Convert application language to Prisma enum.
 */
function getLanguageEnum(language: SupportedLanguage): Language {
  return Language[language];
}

/**
 * Select the correct translation for the current website language.
 *
 * Priority:
 * 1. Requested language
 * 2. English
 * 3. null
 */
function getDisplayTranslation(
  translations: Array<{
    language: Language;
    name: string;
    description: string | null;
  }>,
  language: SupportedLanguage,
) {
  return (
    translations.find(
      (translation) =>
        translation.language === getLanguageEnum(language),
    ) ??
    translations.find(
      (translation) =>
        translation.language === Language.EN,
    ) ??
    null
  );
}

/**
 * Get all categories from MySQL.
 *
 * Nothing is hardcoded here.
 */
export async function getCategories(
  language: SupportedLanguage = "EN",
) {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (categories.length === 0) {
    return [];
  }

  const result = await Promise.all(
    categories.map(async (category) => {
      const [
        translations,
        articleCount,
        videoCount,
      ] = await Promise.all([
        prisma.categoryTranslation.findMany({
          where: {
            categoryId: category.id,
          },
          orderBy: {
            language: "asc",
          },
        }),

        prisma.article.count({
          where: {
            categoryId: category.id,
          },
        }),

        prisma.video.count({
          where: {
            categoryId: category.id,
          },
        }),
      ]);

      const displayTranslation =
        getDisplayTranslation(
          translations,
          language,
        );

      return {
        id: category.id,
        slug: category.slug,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,

        translations,

        name:
          displayTranslation?.name ??
          category.slug,

        description:
          displayTranslation?.description ??
          null,

        articleCount,
        videoCount,
      };
    }),
  );

  return result;
}

/**
 * Get one category by ID.
 */
export async function getCategoryById(
  id: string,
  language: SupportedLanguage = "EN",
) {
  const category =
    await prisma.category.findUnique({
      where: {
        id,
      },
    });

  if (!category) {
    return null;
  }

  const [
    translations,
    articleCount,
    videoCount,
  ] = await Promise.all([
    prisma.categoryTranslation.findMany({
      where: {
        categoryId: id,
      },
      orderBy: {
        language: "asc",
      },
    }),

    prisma.article.count({
      where: {
        categoryId: id,
      },
    }),

    prisma.video.count({
      where: {
        categoryId: id,
      },
    }),
  ]);

  const displayTranslation =
    getDisplayTranslation(
      translations,
      language,
    );

  return {
    id: category.id,
    slug: category.slug,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,

    translations,

    name:
      displayTranslation?.name ??
      category.slug,

    description:
      displayTranslation?.description ??
      null,

    articleCount,
    videoCount,
  };
}

/**
 * Get one category by slug.
 */
export async function getCategoryBySlug(
  slug: string,
  language: SupportedLanguage = "EN",
) {
  const normalizedSlug =
    normalizeSlug(slug);

  const category =
    await prisma.category.findUnique({
      where: {
        slug: normalizedSlug,
      },
    });

  if (!category) {
    return null;
  }

  const [
    translations,
    articleCount,
    videoCount,
  ] = await Promise.all([
    prisma.categoryTranslation.findMany({
      where: {
        categoryId: category.id,
      },
      orderBy: {
        language: "asc",
      },
    }),

    prisma.article.count({
      where: {
        categoryId: category.id,
      },
    }),

    prisma.video.count({
      where: {
        categoryId: category.id,
      },
    }),
  ]);

  const displayTranslation =
    getDisplayTranslation(
      translations,
      language,
    );

  return {
    id: category.id,
    slug: category.slug,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,

    translations,

    name:
      displayTranslation?.name ??
      category.slug,

    description:
      displayTranslation?.description ??
      null,

    articleCount,
    videoCount,
  };
}

/**
 * Create a new category with
 * English / Sinhala / Tamil translations.
 */
export async function createCategory(
  input: CreateCategoryInput,
) {
  const slug =
    normalizeSlug(input.slug);

  if (!slug) {
    throw new Error(
      "Category slug is required.",
    );
  }

  if (
    input.translations.length === 0
  ) {
    throw new Error(
      "At least one category translation is required.",
    );
  }

  const languages =
    new Set<SupportedLanguage>();

  for (const translation of input.translations) {
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

    if (
      !translation.name.trim()
    ) {
      throw new Error(
        `Category name is required for ${translation.language}.`,
      );
    }
  }

  const existingCategory =
    await prisma.category.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

  if (existingCategory) {
    throw new Error(
      `A category with slug "${slug}" already exists.`,
    );
  }

  /**
   * Create category and translations
   * inside one database transaction.
   */
  return prisma.$transaction(
    async (tx) => {
      const category =
        await tx.category.create({
          data: {
            slug,
          },
        });

      await tx.categoryTranslation.createMany(
        {
          data:
            input.translations.map(
              (translation) => ({
                categoryId:
                  category.id,

                language:
                  getLanguageEnum(
                    translation.language,
                  ),

                name:
                  translation.name.trim(),

                description:
                  translation.description?.trim() ||
                  null,
              }),
            ),
        },
      );

      const translations =
        await tx.categoryTranslation.findMany({
          where: {
            categoryId: category.id,
          },
        });

      return {
        ...category,
        translations,
      };
    },
  );
}

/**
 * Update a category.
 *
 * Existing translations are updated.
 * Missing translations are created.
 */
export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
) {
  const existingCategory =
    await prisma.category.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        slug: true,
      },
    });

  if (!existingCategory) {
    throw new Error(
      "Category not found.",
    );
  }

  let newSlug:
    | string
    | undefined;

  if (
    input.slug !== undefined
  ) {
    newSlug =
      normalizeSlug(input.slug);

    if (!newSlug) {
      throw new Error(
        "Category slug is required.",
      );
    }

    const duplicateCategory =
      await prisma.category.findFirst({
        where: {
          slug: newSlug,
          NOT: {
            id,
          },
        },
        select: {
          id: true,
        },
      });

    if (duplicateCategory) {
      throw new Error(
        `A category with slug "${newSlug}" already exists.`,
      );
    }
  }

  return prisma.$transaction(
    async (tx) => {
      const category =
        await tx.category.update({
          where: {
            id,
          },
          data: {
            ...(newSlug
              ? {
                  slug: newSlug,
                }
              : {}),
          },
        });

      if (
        input.translations
      ) {
        for (
          const translation of
            input.translations
        ) {
          if (
            !translation.name.trim()
          ) {
            throw new Error(
              `Category name is required for ${translation.language}.`,
            );
          }

          await tx.categoryTranslation.upsert(
            {
              where: {
                categoryId_language: {
                  categoryId: id,

                  language:
                    getLanguageEnum(
                      translation.language,
                    ),
                },
              },

              update: {
                name:
                  translation.name.trim(),

                description:
                  translation.description?.trim() ||
                  null,
              },

              create: {
                categoryId: id,

                language:
                  getLanguageEnum(
                    translation.language,
                  ),

                name:
                  translation.name.trim(),

                description:
                  translation.description?.trim() ||
                  null,
              },
            },
          );
        }
      }

      const translations =
        await tx.categoryTranslation.findMany({
          where: {
            categoryId: category.id,
          },
          orderBy: {
            language: "asc",
          },
        });

      return {
        ...category,
        translations,
      };
    },
  );
}

/**
 * Delete a category.
 *
 * We prevent deletion when articles
 * are already assigned to it.
 */
export async function deleteCategory(
  id: string,
) {
  const category =
    await prisma.category.findUnique({
      where: {
        id,
      },
    });

  if (!category) {
    throw new Error(
      "Category not found.",
    );
  }

  const articleCount =
    await prisma.article.count({
      where: {
        categoryId: id,
      },
    });

  if (articleCount > 0) {
    throw new Error(
      "This category cannot be deleted because articles are assigned to it.",
    );
  }

  /**
   * CategoryTranslation uses
   * onDelete: Cascade in your schema,
   * so its translations are removed
   * automatically.
   */
  return prisma.category.delete({
    where: {
      id,
    },
  });
}