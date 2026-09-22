import CategoriesClient from "../../../components/admin/CategoriesClient";
import { requireAdminPage } from "@/lib/auth";
import { getCategories } from "@/lib/data/categories";

export default async function CategoriesPage() {
  await requireAdminPage();

  const categories = await getCategories("EN");

  return (
    <CategoriesClient
      initialCategories={categories}
    />
  );
}
