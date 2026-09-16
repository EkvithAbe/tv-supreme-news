import ArticlesClient from "@/components/admin/ArticlesClient";
import { getArticles } from "@/lib/data/articles";

export default async function AllNewsPage() {
  const result = await getArticles({
    language: "EN",
    page: 1,
    pageSize: 100,
  });

  return (
    <ArticlesClient
      initialArticles={result.articles.map(
        (article) => ({
          ...article,
          publishedAt:
            article.publishedAt?.toISOString() ??
            null,
          scheduledAt:
            article.scheduledAt?.toISOString() ??
            null,
          createdAt:
            article.createdAt.toISOString(),
        }),
      )}
    />
  );
}