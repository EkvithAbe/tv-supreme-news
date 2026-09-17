import "server-only";

import { prisma } from "@/lib/prisma";

export const supportedLanguages = ["EN", "SI", "TA"] as const;
export type PageLanguage = (typeof supportedLanguages)[number];

export const supportedStatuses = ["DRAFT", "PUBLISHED"] as const;
export type PageStatusValue = (typeof supportedStatuses)[number];

export interface PageTranslationInput {
  language: PageLanguage;
  title: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CreatePageInput {
  slug: string;
  status?: PageStatusValue;
  translations: PageTranslationInput[];
}

export interface UpdatePageInput {
  pageId: string;
  slug?: string;
  status?: PageStatusValue;
  translation?: PageTranslationInput;
}

export interface PageRecord {
  id: string;
  pageId: string;
  translationId: string;
  slug: string;
  status: PageStatusValue;
  language: PageLanguage;
  title: string;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function isPageLanguage(
  value: string,
): value is PageLanguage {
  return supportedLanguages.includes(
    value as PageLanguage,
  );
}

function isPageStatus(
  value: string,
): value is PageStatusValue {
  return supportedStatuses.includes(
    value as PageStatusValue,
  );
}

/* ============================================================
   GET ALL PAGES
   Returns one record for each page translation.
============================================================ */

export async function getPages(
  language?: PageLanguage,
): Promise<PageRecord[]> {
  const pages = await prisma.page.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (pages.length === 0) {
    return [];
  }

  const pageIds = pages.map((page) => page.id);

  const translations = await prisma.pageTranslation.findMany({
    where: {
      pageId: {
        in: pageIds,
      },
      ...(language
        ? {
            language,
          }
        : {}),
    },
  });

  const pageMap = new Map(
    pages.map((page) => [page.id, page]),
  );

  return translations
    .map((translation) => {
      const page = pageMap.get(
        translation.pageId,
      );

      if (!page) {
        return null;
      }

      return {
        id: `${page.id}:${translation.id}`,
        pageId: page.id,
        translationId: translation.id,
        slug: page.slug,
        status: page.status as PageStatusValue,
        language:
          translation.language as PageLanguage,
        title: translation.title,
        content: translation.content,
        seoTitle: translation.seoTitle,
        seoDescription:
          translation.seoDescription,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      };
    })
    .filter(
      (item): item is PageRecord =>
        item !== null,
    );
}

/* ============================================================
   GET PAGE BY ID
============================================================ */

export async function getPageById(
  pageId: string,
): Promise<{
  id: string;
  slug: string;
  status: PageStatusValue;
  translations: Array<{
    id: string;
    language: PageLanguage;
    title: string;
    content: string;
    seoTitle: string | null;
    seoDescription: string | null;
  }>;
  createdAt: Date;
  updatedAt: Date;
} | null> {
  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
  });

  if (!page) {
    return null;
  }

  const translations =
    await prisma.pageTranslation.findMany({
      where: {
        pageId,
      },
      orderBy: {
        language: "asc",
      },
    });

  return {
    id: page.id,
    slug: page.slug,
    status: page.status as PageStatusValue,
    translations: translations.map(
      (translation) => ({
        id: translation.id,
        language:
          translation.language as PageLanguage,
        title: translation.title,
        content: translation.content,
        seoTitle: translation.seoTitle,
        seoDescription:
          translation.seoDescription,
      }),
    ),
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
}

/* ============================================================
   GET PAGE BY SLUG
============================================================ */

export async function getPageBySlug(
  slug: string,
  language: PageLanguage = "EN",
): Promise<PageRecord | null> {
  const page = await prisma.page.findUnique({
    where: {
      slug,
    },
  });

  if (!page) {
    return null;
  }

  const translation =
    await prisma.pageTranslation.findUnique({
      where: {
        pageId_language: {
          pageId: page.id,
          language,
        },
      },
    });

  if (!translation) {
    return null;
  }

  return {
    id: `${page.id}:${translation.id}`,
    pageId: page.id,
    translationId: translation.id,
    slug: page.slug,
    status: page.status as PageStatusValue,
    language:
      translation.language as PageLanguage,
    title: translation.title,
    content: translation.content,
    seoTitle: translation.seoTitle,
    seoDescription:
      translation.seoDescription,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
}

/* ============================================================
   CREATE PAGE
============================================================ */

export async function createPage(
  input: CreatePageInput,
) {
  const cleanSlug = input.slug
    .trim()
    .toLowerCase();

  const cleanTranslations =
    input.translations
      .filter(
        (translation) =>
          translation.title.trim(),
      )
      .map((translation) => ({
        language: translation.language,
        title: translation.title.trim(),
        content: translation.content.trim(),
        seoTitle:
          translation.seoTitle?.trim() || null,
        seoDescription:
          translation.seoDescription?.trim() ||
          null,
      }));

  if (!cleanSlug) {
    throw new Error(
      "Page slug is required.",
    );
  }

  if (cleanTranslations.length === 0) {
    throw new Error(
      "At least one page translation is required.",
    );
  }

  const duplicateLanguages =
    new Set<PageLanguage>();

  for (const translation of cleanTranslations) {
    if (
      !isPageLanguage(
        translation.language,
      )
    ) {
      throw new Error(
        "Invalid page language.",
      );
    }

    if (
      duplicateLanguages.has(
        translation.language,
      )
    ) {
      throw new Error(
        `Duplicate translation for ${translation.language}.`,
      );
    }

    duplicateLanguages.add(
      translation.language,
    );
  }

  const status =
    input.status ?? "DRAFT";

  if (!isPageStatus(status)) {
    throw new Error(
      "Invalid page status.",
    );
  }

  return prisma.$transaction(
    async (tx) => {
      const page = await tx.page.create({
        data: {
          slug: cleanSlug,
          status,
        },
      });

      await tx.pageTranslation.createMany({
        data: cleanTranslations.map(
          (translation) => ({
            pageId: page.id,
            language:
              translation.language,
            title: translation.title,
            content:
              translation.content,
            seoTitle:
              translation.seoTitle,
            seoDescription:
              translation.seoDescription,
          }),
        ),
      });

      return getPageById(page.id);
    },
  );
}

/* ============================================================
   UPDATE PAGE
============================================================ */

export async function updatePage(
  input: UpdatePageInput,
) {
  const page = await prisma.page.findUnique({
    where: {
      id: input.pageId,
    },
  });

  if (!page) {
    throw new Error(
      "Page not found.",
    );
  }

  const pageData: {
    slug?: string;
    status?: PageStatusValue;
  } = {};

  if (
    typeof input.slug === "string"
  ) {
    const cleanSlug = input.slug
      .trim()
      .toLowerCase();

    if (!cleanSlug) {
      throw new Error(
        "Page slug is required.",
      );
    }

    pageData.slug = cleanSlug;
  }

  if (
    typeof input.status ===
    "string"
  ) {
    if (
      !isPageStatus(
        input.status,
      )
    ) {
      throw new Error(
        "Invalid page status.",
      );
    }

    pageData.status =
      input.status;
  }

  return prisma.$transaction(
    async (tx) => {
      if (
        Object.keys(pageData).length >
        0
      ) {
        await tx.page.update({
          where: {
            id: input.pageId,
          },
          data: pageData,
        });
      }

      if (input.translation) {
        if (
          !isPageLanguage(
            input.translation.language,
          )
        ) {
          throw new Error(
            "Invalid page language.",
          );
        }

        const cleanTitle =
          input.translation.title.trim();

        if (!cleanTitle) {
          throw new Error(
            "Page title is required.",
          );
        }

        await tx.pageTranslation.upsert({
          where: {
            pageId_language: {
              pageId: input.pageId,
              language:
                input.translation.language,
            },
          },
          update: {
            title: cleanTitle,
            content:
              input.translation.content.trim(),
            seoTitle:
              input.translation.seoTitle?.trim() ||
              null,
            seoDescription:
              input.translation.seoDescription?.trim() ||
              null,
          },
          create: {
            pageId: input.pageId,
            language:
              input.translation.language,
            title: cleanTitle,
            content:
              input.translation.content.trim(),
            seoTitle:
              input.translation.seoTitle?.trim() ||
              null,
            seoDescription:
              input.translation.seoDescription?.trim() ||
              null,
          },
        });
      }

      return getPageById(
        input.pageId,
      );
    },
  );
}

/* ============================================================
   DELETE PAGE
============================================================ */

export async function deletePage(
  pageId: string,
): Promise<void> {
  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
    select: {
      id: true,
    },
  });

  if (!page) {
    throw new Error(
      "Page not found.",
    );
  }

  await prisma.page.delete({
    where: {
      id: pageId,
    },
  });
}

/* ============================================================
   UPDATE PAGE STATUS
============================================================ */

export async function updatePageStatus(
  pageId: string,
  status: PageStatusValue,
) {
  if (!isPageStatus(status)) {
    throw new Error(
      "Invalid page status.",
    );
  }

  await prisma.page.update({
    where: {
      id: pageId,
    },
    data: {
      status,
    },
  });

  return getPageById(pageId);
}