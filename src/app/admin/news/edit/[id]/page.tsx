import { notFound } from "next/navigation";

import EditArticleClient from "@/components/admin/EditArticleClient";
import { requireCmsUserPage } from "@/lib/auth";
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
  const user = await requireCmsUserPage();
  const { id } = await params;

  const [article, categories, authors] =
    await Promise.all([
      getArticleById(id, "EN"),
      getCategories("EN"),
      user.role === "ADMIN"
        ? getArticleAuthors()
        : Promise.resolve([]),
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
      currentUser={{
        id: user.id,
        name: user.name,
        role: user.role,
      }}
    />
  );
}
