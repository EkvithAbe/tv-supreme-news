import { notFound } from "next/navigation";

import EditArticleClient from "@/components/admin/EditArticleClient";
import { getArticleById } from "@/lib/data/articles";
import { getArticleAuthors } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditArticlePage({
  params,
}: Props) {
  const { id } = await params;

  const [article, categories, authors] =
    await Promise.all([
      getArticleById(id, "EN"),
      getCategories("EN"),
      getArticleAuthors(),
    ]);

  if (!article) {
    notFound();
  }

  const categoryOptions = categories.map(
    (category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }),
  );

  return (
    <EditArticleClient
      article={article}
      initialCategories={categoryOptions}
      initialAuthors={authors}
    />
  );
}