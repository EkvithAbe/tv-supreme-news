import { notFound } from "next/navigation";
import CategoryPage from "@/components/category/CategoryPage";

const validSlugs = [
  "latest",
  "sri-lanka",
  "world",
  "politics",
  "business",
  "sports",
  "entertainment",
  "technology",
  "lifestyle",
  "video",
];

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function CategoryRoute({
  params,
}: PageProps) {
  const { slug } = await params;

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return <CategoryPage categorySlug={slug} />;
}