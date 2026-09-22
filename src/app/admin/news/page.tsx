import ArticlesClient from "@/components/admin/ArticlesClient";
import { requireCmsUserPage } from "@/lib/auth";
import { getArticles } from "@/lib/data/articles";

export default async function AllNewsPage() {
  await requireCmsUserPage();

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
