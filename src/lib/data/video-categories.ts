import { prisma } from "@/lib/prisma";
import { Language } from "../../../generated/prisma/client";

export type SupportedLanguage = "EN" | "SI" | "TA";

export interface VideoCategoryTranslationInput {
  language: SupportedLanguage;
  name: string;
  description?: string;
}

export interface CreateVideoCategoryInput {
  slug: string;
  translations: VideoCategoryTranslationInput[];
}

export interface UpdateVideoCategoryInput {
  slug?: string;
  translations?: VideoCategoryTranslationInput[];
}

/**
 * Convert a video category slug into a clean URL slug.
 *
 * Example:
 * "Sports Highlights" -> "sports-highlights"
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
function getLanguageEnum(
  language: SupportedLanguage,
): Language {
  return Language[language];
}

/**
 * Select the correct translation for the requested language.
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

/**
 * Get all video categories.
 */
export async function getVideoCategories(
  language: SupportedLanguage = "EN",
) {
  const categories =
    await prisma.videoCategory.findMany({
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
        videoCount,
      ] = await Promise.all([
        prisma.videoCategoryTranslation.findMany({
          where: {
            videoCategoryId: category.id,
          },
          orderBy: {
            language: "asc",
          },
        }),

        prisma.video.count({
          where: {
            videoCategoryId: category.id,
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

        videoCount,
      };
    }),
  );

  return result;
}

/**
 * Get one video category by ID.
 */
export async function getVideoCategoryById(
  id: string,
  language: SupportedLanguage = "EN",
) {
  const category =
    await prisma.videoCategory.findUnique({
      where: {
        id,
      },
    });

  if (!category) {
    return null;
  }

  const [
    translations,
    videoCount,
  ] = await Promise.all([
    prisma.videoCategoryTranslation.findMany({
      where: {
        videoCategoryId: id,
      },
      orderBy: {
        language: "asc",
      },
    }),

    prisma.video.count({
      where: {
        videoCategoryId: id,
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

    videoCount,
  };
}

/**
 * Get one video category by slug.
 */
export async function getVideoCategoryBySlug(
  slug: string,
  language: SupportedLanguage = "EN",
) {
  const normalizedSlug =
    normalizeSlug(slug);

  const category =
    await prisma.videoCategory.findUnique({
      where: {
        slug: normalizedSlug,
      },
    });

  if (!category) {
    return null;
  }

  const [
    translations,
    videoCount,
  ] = await Promise.all([
    prisma.videoCategoryTranslation.findMany({
      where: {
        videoCategoryId: category.id,
      },
      orderBy: {
        language: "asc",
      },
    }),

    prisma.video.count({
      where: {
        videoCategoryId: category.id,
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

    videoCount,
  };
}

/**
 * Create a new video category
 * with English / Sinhala / Tamil translations.
 */
export async function createVideoCategory(
  input: CreateVideoCategoryInput,
) {
  const slug =
    normalizeSlug(input.slug);

  if (!slug) {
    throw new Error(
      "Video category slug is required.",
    );
  }

  if (
    input.translations.length === 0
  ) {
    throw new Error(
      "At least one video category translation is required.",
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
        `Video category name is required for ${translation.language}.`,
      );
    }
  }

  const existingCategory =
    await prisma.videoCategory.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

  if (existingCategory) {
    throw new Error(
      `A video category with slug "${slug}" already exists.`,
    );
  }

  /**
   * Create category and translations
   * inside one database transaction.
   */
  return prisma.$transaction(
    async (tx) => {
      const category =
        await tx.videoCategory.create({
          data: {
            slug,
          },
        });

      await tx.videoCategoryTranslation.createMany(
        {
          data:
            input.translations.map(
              (translation) => ({
                videoCategoryId:
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
        await tx.videoCategoryTranslation.findMany(
          {
            where: {
              videoCategoryId:
                category.id,
            },
            orderBy: {
              language: "asc",
            },
          },
        );

      return {
        ...category,
        translations,
      };
    },
  );
}

/**
 * Update a video category.
 *
 * Existing translations are updated.
 * Missing translations are created.
 */
export async function updateVideoCategory(
  id: string,
  input: UpdateVideoCategoryInput,
) {
  const existingCategory =
    await prisma.videoCategory.findUnique({
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
      "Video category not found.",
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
        "Video category slug is required.",
      );
    }

    const duplicateCategory =
      await prisma.videoCategory.findFirst({
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
        `A video category with slug "${newSlug}" already exists.`,
      );
    }
  }

  return prisma.$transaction(
    async (tx) => {
      const category =
        await tx.videoCategory.update({
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

          if (
            !translation.name.trim()
          ) {
            throw new Error(
              `Video category name is required for ${translation.language}.`,
            );
          }

          await tx.videoCategoryTranslation.upsert(
            {
              where: {
                videoCategoryId_language:
                  {
                    videoCategoryId:
                      id,

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
                videoCategoryId:
                  id,

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
        await tx.videoCategoryTranslation.findMany(
          {
            where: {
              videoCategoryId:
                category.id,
            },

            orderBy: {
              language: "asc",
            },
          },
        );

      return {
        ...category,
        translations,
      };
    },
  );
}

/**
 * Delete a video category.
 *
 * We prevent deletion when videos
 * are already assigned to it.
 */
export async function deleteVideoCategory(
  id: string,
) {
  const category =
    await prisma.videoCategory.findUnique({
      where: {
        id,
      },
    });

  if (!category) {
    throw new Error(
      "Video category not found.",
    );
  }

  const videoCount =
    await prisma.video.count({
      where: {
        videoCategoryId: id,
      },
    });

  if (videoCount > 0) {
    throw new Error(
      "This video category cannot be deleted because videos are assigned to it.",
    );
  }

  /**
   * VideoCategoryTranslation uses
   * onDelete: Cascade in the schema,
   * so translations are removed
   * automatically.
   */
  return prisma.videoCategory.delete({
    where: {
      id,
    },
  });
}