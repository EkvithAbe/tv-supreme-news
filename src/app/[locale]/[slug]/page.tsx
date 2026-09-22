import { notFound } from "next/navigation";

import CategoryPage from "@/components/category/CategoryPage";
import PublicPageRenderer from "@/components/pages/PublicPageRenderer";
import { getArticles } from "@/lib/data/articles";
import { getPageBySlug } from "@/lib/data/pages";
import { getPageBuilderBlocks } from "@/lib/page-builder";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

type SupportedLanguage = "EN" | "SI" | "TA";

function getLanguage(
  locale: string,
): SupportedLanguage {
  const normalized =
    locale.trim().toLowerCase();

  if (normalized === "si") {
    return "SI";
  }

  if (normalized === "ta") {
    return "TA";
  }

  return "EN";
}

export default async function PublicSlugRoute({
  params,
}: PageProps) {
  const { locale, slug } = await params;

  const language = getLanguage(locale);

  const normalizedSlug =
    slug.trim().toLowerCase();

  /*
   * "latest" is a special system route.
   * It is not a database category.
   */
  if (normalizedSlug === "latest") {
    const result = await getArticles({
      language,
      status: "PUBLISHED",
      page: 1,
      pageSize: 100,
    });

    return (
      <CategoryPage
        categorySlug="latest"
        initialArticles={result.articles}
      />
    );
  }

  /*
   * All other category routes are resolved directly
   * from MySQL.
   */
  const category =
    await prisma.category.findUnique({
      where: {
        slug: normalizedSlug,
      },
      select: {
        id: true,
        slug: true,
      },
    });

  if (!category) {
    const page = await getPageBySlug(
      normalizedSlug,
      language,
    );

    if (!page || page.status !== "PUBLISHED") {
      notFound();
    }

    const mediaIds = getPageBuilderBlocks(page.content)
      .map((block) => block.mediaId)
      .filter((mediaId): mediaId is string => Boolean(mediaId));

    const media = mediaIds.length
      ? await prisma.media.findMany({
          where: {
            id: {
              in: mediaIds,
            },
          },
          select: {
            id: true,
            url: true,
            filename: true,
            type: true,
            altText: true,
          },
        })
      : [];

    return (
      <PublicPageRenderer
        page={page}
        media={media}
      />
    );
  }

  /*
   * Get published articles for this category
   * in the requested language.
   */
  const result = await getArticles({
    language,
    status: "PUBLISHED",
    categoryId: category.id,
    page: 1,
    pageSize: 100,
  });

  return (
    <CategoryPage
      categorySlug={category.slug}
      initialArticles={result.articles}
    />
  );
}
