import { notFound } from "next/navigation";

import CategoryPage from "@/components/category/CategoryPage";
import { getArticles } from "@/lib/data/articles";
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

export default async function CategoryRoute({
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
   * Find the category directly from PostgreSQL.
   *
   * Nothing is hardcoded here.
   * The URL slug comes from the database category slug.
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

  /*
   * If PostgreSQL has no category with this slug,
   * then the route does not exist.
   */
  if (!category) {
    notFound();
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