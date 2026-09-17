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
        initialArticles={result.articles.map(
          (article) => ({
            id: article.id,
            slug: article.slug,
            title: article.title,
            summary: article.summary,
            publishedAt:
              article.publishedAt,
            views: article.views,
            category: article.category
              ? {
                  id: article.category.id,
                  slug: article.category.slug,
                  name: article.category.name,
                }
              : null,
            mainImage: article.mainImage
              ? {
                  id: article.mainImage.id,
                  url: article.mainImage.url,
                  altText:
                    article.mainImage.altText,
                }
              : null,
          }),
        )}
      />
    );
  }

  const categories =
    await getCategories(language);

  const category = categories.find(
    (item) => item.slug === slug,
  );

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
      categorySlug={slug}
      initialArticles={result.articles.map(
        (article) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          summary: article.summary,
          publishedAt:
            article.publishedAt,
          views: article.views,
          category: article.category
            ? {
                id: article.category.id,
                slug: article.category.slug,
                name: article.category.name,
              }
            : null,
          mainImage: article.mainImage
            ? {
                id: article.mainImage.id,
                url: article.mainImage.url,
                altText:
                  article.mainImage.altText,
              }
            : null,
        }),
      )}
    />
  );
}