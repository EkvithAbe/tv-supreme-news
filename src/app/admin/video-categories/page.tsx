import VideoCategoriesClient from "@/components/admin/VideoCategoriesClient";
import { getVideoCategories } from "@/lib/data/video-categories";

export default async function VideoCategoriesPage() {
  const categories = await getVideoCategories("EN");

  return (
    <VideoCategoriesClient
      initialCategories={categories}
    />
  );
}