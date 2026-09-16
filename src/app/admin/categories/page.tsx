import CategoriesClient from "../../../components/admin/CategoriesClient";
import { getCategories } from "@/lib/data/categories";

export default async function CategoriesPage() {
  const categories = await getCategories("EN");

  return (
    <CategoriesClient
      initialCategories={categories}
    />
  );
}