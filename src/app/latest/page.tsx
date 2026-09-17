import CategoryPage from "@/components/category/CategoryPage";
import { getArticles } from "@/lib/data/articles";

export default async function LatestPage() {
  const result = await getArticles({
    language: "EN",
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