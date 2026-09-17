import { notFound } from "next/navigation";

import CategoryPage from "@/components/category/CategoryPage";
import { getArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";

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
  if (locale === "si") {
    return "SI";
  }

  if (locale === "ta") {
    return "TA";
  }

  return "EN";
}

export default async function CategoryRoute({
  params,
}: PageProps) {
  const { locale, slug } = await params;

  const language = getLanguage(locale);

  /*
   * "latest" is a special route and is not a
   * database category.
   */
  if (slug === "latest") {
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
   * from PostgreSQL.
   */
  const categories =
    await getCategories(language);

  const category = categories.find(
    (item) => item.slug === slug,
  );

  /*
   * If the category does not exist in PostgreSQL
   * for the requested language, return 404.
   */
  if (!category) {
    notFound();
  }

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