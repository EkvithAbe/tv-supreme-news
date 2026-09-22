import NewArticleClient from "@/components/admin/NewArticleClient";
import { requireCmsUserPage } from "@/lib/auth";
import { getArticleAuthors } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";

export default async function NewArticlePage() {
  const user = await requireCmsUserPage();

  const [categories, authors] = await Promise.all([
    getCategories("EN"),
    user.role === "ADMIN"
      ? getArticleAuthors()
      : Promise.resolve([]),
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
      currentUser={{
        id: user.id,
        name: user.name,
        role: user.role,
      }}
    />
  );
}
