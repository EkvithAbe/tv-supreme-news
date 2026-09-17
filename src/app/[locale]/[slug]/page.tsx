import { notFound } from "next/navigation";

import CategoryPage from "@/components/category/CategoryPage";
import { getArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";

const validSlugs = [
  "latest",
  "sri-lanka",
  "world",
  "politics",
  "business",
  "sports",
  "entertainment",
  "technology",
  "lifestyle",
  "video",
];

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

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  const language = getLanguage(locale);

  /*
   * Load the categories from PostgreSQL.
   */
  const categories =
    await getCategories(language);

  /*
   * "latest" is not a database category.
   * It means all published articles.
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
        categorySlug={slug}
        initialArticles={result.articles}
      />
    );
  }

  /*
   * Find the requested category in PostgreSQL.
   */
  const category = categories.find(
    (item) => item.slug === slug,
  );

  if (!category) {
    notFound();
  }

  /*
   * Load only PUBLISHED articles for
   * the selected category.
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
      categorySlug={slug}
      initialArticles={result.articles}
    />
  );
}