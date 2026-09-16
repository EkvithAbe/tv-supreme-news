import NewArticleClient from "@/components/admin/NewArticleClient";
import { getArticleAuthors } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    getCategories("EN"),
    getArticleAuthors(),
  ]);

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
  }));

  return (
    <NewArticleClient
      initialCategories={categoryOptions}
      initialAuthors={authors}
    />
  );
}